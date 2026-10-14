// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ICustodyLedger, IVoiceModule} from "./interfaces/IKept.sol";

/// @title ReliefFund
/// @notice A disaster fund whose promises are fixed when the money is raised, not after.
/// - The charter lists the only purposes the money may ever be used for. Nothing outside the
///   charter (e.g. general public works, another disaster) can be funded, before or after the deadline.
/// - Each purpose has a cap as a share of everything raised.
/// - Allocations need committee approval and are written to the custody ledger as the first hop.
/// - Changing caps or extending the deadline goes through a public timelock during which verified
///   households vote; a majority "no" with quorum vetoes the change.
/// - Emergencies take a stricter committee threshold and execute at once, but still open a
///   (retroactive) household vote so the decision is answered for.
/// - The fund never forces money out the door at the deadline: unspent money simply stays locked
///   until households accept an extension. Prudence is not punished; opacity is.
contract ReliefFund is Initializable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Kind {
        Allocation,
        CapChange,
        Extension
    }

    enum Status {
        Pending,
        Queued,
        Executed,
        Vetoed,
        Cancelled
    }

    struct Purpose {
        string name;
        uint16 capBps;
        uint256 allocated;
    }

    struct Proposal {
        Kind kind;
        Status status;
        bool emergency;
        uint8 purposeId; // allocation purpose, or cap-change source
        uint8 toPurposeId; // cap-change destination
        uint16 approvals;
        uint16 newCapFrom;
        uint16 newCapTo;
        uint32 estHouseholds;
        uint64 newDeadline;
        uint64 createdAt;
        uint64 executeAfter;
        address proposer;
        address recipient;
        uint256 amount;
        uint256 hopId;
        bytes32 docHash;
        bytes32 voteKey;
    }

    struct InitParams {
        string name;
        string surplusRule;
        address custodian;
        IERC20 token;
        uint256 disasterId;
        uint64 deadline;
        uint16 threshold;
        uint16 emergencyThreshold;
        uint32 timelock;
        uint16 quorumBps;
        address[] committee;
        string[] purposeNames;
        uint16[] purposeCaps;
    }

    uint8 public constant NOT_IN_CHARTER = type(uint8).max;

    ICustodyLedger public ledger;
    IVoiceModule public voice;

    string public name;
    string public surplusRule;
    address public custodian;
    IERC20 public token;
    uint256 public disasterId;
    uint64 public deadline;
    uint16 public threshold;
    uint16 public emergencyThreshold;
    uint32 public timelock;
    uint16 public quorumBps;

    address[] internal _committee;
    mapping(address => bool) public isCommittee;
    Purpose[] internal _purposes;

    uint256 public totalRaised;
    uint256 public totalAllocated;
    uint256 public donationCount;

    Proposal[] internal _proposals;
    mapping(uint256 proposalId => mapping(address member => bool)) public hasApproved;

    event Chartered(string name, address indexed custodian, uint256 indexed disasterId, uint64 deadline);
    event Donated(address indexed donor, uint256 amount, uint256 indexed receiptNo, bytes32 memoHash);
    event Proposed(uint256 indexed id, Kind kind, address indexed proposer, bool emergency, bytes32 docHash);
    event Approved(uint256 indexed id, address indexed member, uint16 approvals);
    event Queued(uint256 indexed id, bytes32 voteKey, uint64 executeAfter);
    event Executed(uint256 indexed id, Kind kind, uint256 hopId);
    event Vetoed(uint256 indexed id, bytes32 voteKey);
    event Cancelled(uint256 indexed id);
    event EmergencyReview(uint256 indexed id, bytes32 voteKey);
    event CapChanged(uint8 indexed purposeId, uint16 oldCap, uint16 newCap);
    event DeadlineExtended(uint64 oldDeadline, uint64 newDeadline);

    error NotCommittee();
    error PurposeNotInCharter();
    error CapExceeded(uint8 purposeId, uint256 available);
    error CapsOverflow();
    error CapBelowAllocated();
    error FundExpired();
    error InsufficientBalance();
    error InvalidState();
    error TimelockActive();
    error AlreadyApproved();
    error BadParams();
    error OnlyProposer();

    modifier onlyCommittee() {
        if (!isCommittee[msg.sender]) revert NotCommittee();
        _;
    }

    constructor() {
        _disableInitializers();
    }

    function initialize(InitParams calldata p, ICustodyLedger _ledger, IVoiceModule _voice) external initializer {
        if (
            p.committee.length == 0 || p.threshold == 0 || p.threshold > p.committee.length
                || p.emergencyThreshold < p.threshold || p.emergencyThreshold > p.committee.length
                || p.purposeNames.length == 0 || p.purposeNames.length != p.purposeCaps.length
                || p.purposeNames.length >= NOT_IN_CHARTER || p.deadline <= block.timestamp || p.quorumBps > 10_000
        ) revert BadParams();

        ledger = _ledger;
        voice = _voice;
        name = p.name;
        surplusRule = p.surplusRule;
        custodian = p.custodian;
        token = p.token;
        disasterId = p.disasterId;
        deadline = p.deadline;
        threshold = p.threshold;
        emergencyThreshold = p.emergencyThreshold;
        timelock = p.timelock;
        quorumBps = p.quorumBps;

        for (uint256 i = 0; i < p.committee.length; i++) {
            address m = p.committee[i];
            if (m == address(0) || isCommittee[m]) revert BadParams();
            isCommittee[m] = true;
            _committee.push(m);
        }

        uint256 capSum;
        for (uint256 i = 0; i < p.purposeNames.length; i++) {
            capSum += p.purposeCaps[i];
            _purposes.push(Purpose({name: p.purposeNames[i], capBps: p.purposeCaps[i], allocated: 0}));
        }
        if (capSum > 10_000) revert CapsOverflow();

        emit Chartered(p.name, p.custodian, p.disasterId, p.deadline);
    }

    // ------------------------------------------------------------------
    // Donations
    // ------------------------------------------------------------------

    function donate(uint256 amount, bytes32 memoHash) external nonReentrant returns (uint256 receiptNo) {
        if (amount == 0) revert BadParams();
        token.safeTransferFrom(msg.sender, address(this), amount);
        totalRaised += amount;
        receiptNo = ++donationCount;
        emit Donated(msg.sender, amount, receiptNo, memoHash);
    }

    // ------------------------------------------------------------------
    // Proposals
    // ------------------------------------------------------------------

    function proposeAllocation(uint8 purposeId, address recipient, uint256 amount, uint32 estHouseholds, bytes32 docHash)
        external
        onlyCommittee
        returns (uint256 id)
    {
        if (purposeId >= _purposes.length) revert PurposeNotInCharter();
        if (recipient == address(0) || amount == 0) revert BadParams();
        Proposal storage pr = _newProposal(Kind.Allocation, false, docHash);
        pr.purposeId = purposeId;
        pr.recipient = recipient;
        pr.amount = amount;
        pr.estHouseholds = estHouseholds;
        id = _proposals.length - 1;
        _approve(id);
    }

    /// @notice Move cap from one charter purpose to another. Purposes outside the charter cannot exist.
    function proposeCapChange(uint8 fromId, uint8 toId, uint16 newCapFrom, uint16 newCapTo, bool emergency, bytes32 docHash)
        external
        onlyCommittee
        returns (uint256 id)
    {
        if (fromId >= _purposes.length || toId >= _purposes.length) revert PurposeNotInCharter();
        if (fromId == toId) revert BadParams();
        Proposal storage pr = _newProposal(Kind.CapChange, emergency, docHash);
        pr.purposeId = fromId;
        pr.toPurposeId = toId;
        pr.newCapFrom = newCapFrom;
        pr.newCapTo = newCapTo;
        id = _proposals.length - 1;
        _approve(id);
    }

    function proposeExtension(uint64 newDeadline, bytes32 docHash) external onlyCommittee returns (uint256 id) {
        if (newDeadline <= deadline) revert BadParams();
        Proposal storage pr = _newProposal(Kind.Extension, false, docHash);
        pr.newDeadline = newDeadline;
        id = _proposals.length - 1;
        _approve(id);
    }

    function approve(uint256 id) external onlyCommittee {
        _approve(id);
    }

    /// @notice After the timelock, anyone can execute a queued change unless households vetoed it.
    function execute(uint256 id) external nonReentrant {
        Proposal storage pr = _proposals[id];
        if (pr.status != Status.Queued) revert InvalidState();
        if (block.timestamp < pr.executeAfter) revert TimelockActive();
        if (voice.isVetoed(pr.voteKey)) {
            pr.status = Status.Vetoed;
            emit Vetoed(id, pr.voteKey);
            return;
        }
        _apply(id);
    }

    function cancel(uint256 id) external {
        Proposal storage pr = _proposals[id];
        if (msg.sender != pr.proposer) revert OnlyProposer();
        if (pr.status != Status.Pending && pr.status != Status.Queued) revert InvalidState();
        pr.status = Status.Cancelled;
        emit Cancelled(id);
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------

    function committee() external view returns (address[] memory) {
        return _committee;
    }

    function purposeCount() external view returns (uint256) {
        return _purposes.length;
    }

    function purpose(uint8 id) external view returns (Purpose memory) {
        return _purposes[id];
    }

    function proposalCount() external view returns (uint256) {
        return _proposals.length;
    }

    function proposal(uint256 id) external view returns (Proposal memory) {
        return _proposals[id];
    }

    /// @notice How much more can currently be allocated to a purpose under its cap.
    function available(uint8 purposeId) public view returns (uint256) {
        if (purposeId >= _purposes.length) revert PurposeNotInCharter();
        Purpose storage pu = _purposes[purposeId];
        uint256 cap = (totalRaised * pu.capBps) / 10_000;
        return cap > pu.allocated ? cap - pu.allocated : 0;
    }

    function balance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // ------------------------------------------------------------------
    // Internal
    // ------------------------------------------------------------------

    function _newProposal(Kind kind, bool emergency, bytes32 docHash) internal returns (Proposal storage pr) {
        pr = _proposals.push();
        pr.kind = kind;
        pr.status = Status.Pending;
        pr.emergency = emergency;
        pr.proposer = msg.sender;
        pr.createdAt = uint64(block.timestamp);
        pr.docHash = docHash;
        emit Proposed(_proposals.length - 1, kind, msg.sender, emergency, docHash);
    }

    function _approve(uint256 id) internal {
        Proposal storage pr = _proposals[id];
        if (pr.status != Status.Pending) revert InvalidState();
        if (hasApproved[id][msg.sender]) revert AlreadyApproved();
        hasApproved[id][msg.sender] = true;
        pr.approvals++;
        emit Approved(id, msg.sender, pr.approvals);

        if (pr.kind == Kind.Allocation) {
            if (pr.approvals >= threshold) _apply(id);
        } else if (pr.emergency) {
            if (pr.approvals >= emergencyThreshold) {
                _apply(id);
                pr.voteKey = voice.openVote(disasterId, timelock, quorumBps, pr.docHash);
                emit EmergencyReview(id, pr.voteKey);
            }
        } else if (pr.approvals >= threshold) {
            pr.status = Status.Queued;
            pr.executeAfter = uint64(block.timestamp) + timelock;
            pr.voteKey = voice.openVote(disasterId, timelock, quorumBps, pr.docHash);
            emit Queued(id, pr.voteKey, pr.executeAfter);
        }
    }

    function _apply(uint256 id) internal {
        Proposal storage pr = _proposals[id];
        if (pr.kind == Kind.Allocation) {
            if (block.timestamp > deadline) revert FundExpired();
            uint256 avail = available(pr.purposeId);
            if (pr.amount > avail) revert CapExceeded(pr.purposeId, avail);
            if (token.balanceOf(address(this)) < pr.amount) revert InsufficientBalance();
            _purposes[pr.purposeId].allocated += pr.amount;
            totalAllocated += pr.amount;
            pr.status = Status.Executed;
            token.safeTransfer(pr.recipient, pr.amount);
            pr.hopId = ledger.recordAllocation(
                id, pr.purposeId, pr.recipient, pr.amount, pr.estHouseholds, pr.docHash
            );
        } else if (pr.kind == Kind.CapChange) {
            Purpose storage from = _purposes[pr.purposeId];
            Purpose storage to = _purposes[pr.toPurposeId];
            if (from.allocated * 10_000 > uint256(pr.newCapFrom) * totalRaised) revert CapBelowAllocated();
            if (to.allocated * 10_000 > uint256(pr.newCapTo) * totalRaised) revert CapBelowAllocated();
            uint256 capSum;
            for (uint256 i = 0; i < _purposes.length; i++) {
                if (i == pr.purposeId) capSum += pr.newCapFrom;
                else if (i == pr.toPurposeId) capSum += pr.newCapTo;
                else capSum += _purposes[i].capBps;
            }
            if (capSum > 10_000) revert CapsOverflow();
            emit CapChanged(pr.purposeId, from.capBps, pr.newCapFrom);
            emit CapChanged(pr.toPurposeId, to.capBps, pr.newCapTo);
            from.capBps = pr.newCapFrom;
            to.capBps = pr.newCapTo;
            pr.status = Status.Executed;
        } else {
            emit DeadlineExtended(deadline, pr.newDeadline);
            deadline = pr.newDeadline;
            pr.status = Status.Executed;
        }
        emit Executed(id, pr.kind, pr.hopId);
    }
}
