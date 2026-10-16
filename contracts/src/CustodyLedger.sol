// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IKeptFactory, IEligibilityRegistry, IReliefFund} from "./interfaces/IKept.sol";

/// @title CustodyLedger
/// @notice Follows each tranche of donated money through every pair of hands until it reaches a household.
///
///   Allocated/Disbursed  fund -> custodian (on-chain transfer, recorded by the fund)
///   Acknowledged         the receiving custodian confirms receipt (two-sided record)
///   Forwarded            custodian -> next custodian (e.g. foundation -> ministry -> county)
///   Reconciled           the paying custodian publishes its payment roster as pseudonymous lines
///                        (receipt address + amount; never a name, ID or bank account)
///   Delivered            the household itself signs "received" (or a proxy of its village does)
///   Disputed             the household signs "recorded as paid, but I did not receive it"
///
/// The lines are public, so nothing depends on the custodian afterwards: each household finds its own
/// line without asking anyone, the contract computes the batch total and household count itself, and
/// lines whose receipt address is not a registered household are counted publicly (possible ghosts).
/// Only a real household can confirm or dispute its own line: the receipt address must be one
/// registered with two signatures in the EligibilityRegistry, so a custodian cannot put its own keys
/// in a roster and confirm itself. A proxy can only act for households of the village the township
/// office designated it for, and the household's own signature always overrides the proxy's.
/// (At national scale the lines could be published off-chain and anchored by a hash; the demo keeps
/// them on-chain so that no step relies on the custodian.)
contract CustodyLedger is Ownable, EIP712 {
    struct Hop {
        uint256 parent; // 0 = straight from a fund
        address fund;
        address from;
        address to;
        uint256 amount;
        uint256 forwarded;
        uint256 reconciled;
        bytes32 evidenceHash; // hash of bank slip / transfer document
        uint64 createdAt;
        uint64 ackAt;
        uint32 estHouseholds;
        uint32 reconciledHouseholds;
        uint32 confirmed;
        uint32 proxyConfirmed;
        uint32 disputed;
        uint32 programDelivered;
        uint8 purposeId;
        uint32 unregistered; // roster lines whose receipt address is not a registered household
    }

    struct Batch {
        uint256 amount; // computed from the lines, not declared by the custodian
        uint32 households;
        uint32 unregistered;
        bytes32 docHash;
        uint64 at;
        uint64 atBlock;
    }

    /// @notice Lines per batch; larger rosters are reported in several batches.
    uint256 public constant MAX_LINES = 500;

    /// @notice Sample audits, as in risk-limiting election audits: instead of waiting for every
    /// household to answer, an independent auditor visits a random sample of each batch in person. The
    /// sample is a fifth of the lines, at least 5 and at most 59: if all 59 sampled households are found
    /// and confirm, the share of undelivered lines is below 5% with 95% confidence.
    uint256 public constant AUDIT_MIN = 5;
    uint256 public constant AUDIT_MAX = 59;
    /// @notice The sample is seeded by the hash of a block fixed at publication (AUDIT_DELAY blocks
    /// later), so neither the custodian nor whoever calls drawAudit can choose it.
    uint256 public constant AUDIT_DELAY = 2;

    bytes32 public constant AUDIT_VISIT_TYPEHASH = keccak256(
        "AuditVisit(uint256 hopId,uint256 batchIndex,address receipt,uint256 amount,bool received,address auditor)"
    );
    // auditOutcome values
    uint8 public constant VISIT_RECEIVED = 1;
    uint8 public constant VISIT_NOT_RECEIVED = 2;
    uint8 public constant VISIT_NOT_FOUND = 3;

    bytes32 public constant RECEIPT_TYPEHASH =
        keccak256("Receipt(uint256 hopId,uint256 batchIndex,address receipt,uint256 amount,bool received)");

    // lineState values. A household's own answer is final; a proxy's can be overridden by the household.
    uint8 public constant CONFIRMED = 1;
    uint8 public constant DISPUTED = 2;
    uint8 public constant PROXY_CONFIRMED = 3;
    uint8 public constant PROXY_DISPUTED = 4;

    IKeptFactory public immutable factory;
    IEligibilityRegistry public immutable registry;
    address public aidPrograms;

    Hop[] internal _hops;
    mapping(uint256 hopId => Batch[]) internal _batches;
    mapping(bytes32 => uint8) public lineState; // keccak(hopId, batchIndex, receipt) => see constants above
    mapping(bytes32 => uint256) internal _lineAmount; // keccak(hopId, batchIndex, receipt) => amount (0 = no line)
    mapping(uint256 hopId => mapping(uint256 batchIndex => address[])) internal _lineReceipts;
    mapping(uint256 hopId => mapping(uint256 batchIndex => address[])) internal _auditPicks;
    mapping(uint256 hopId => mapping(uint256 batchIndex => uint256)) public auditSeedBlockUsed;
    mapping(bytes32 => bool) internal _picked; // line key => drawn for the audit
    mapping(address => bool) public isAuditor;
    mapping(bytes32 => uint8) public auditOutcome; // line key => VISIT_*
    mapping(bytes32 => address) public auditedBy;

    event HopCreated(
        uint256 indexed hopId,
        uint256 indexed parent,
        address indexed fund,
        address from,
        address to,
        uint8 purposeId,
        uint256 amount,
        uint32 estHouseholds,
        bytes32 evidenceHash
    );
    event HopAcknowledged(uint256 indexed hopId, address indexed by);
    event Reconciled(
        uint256 indexed hopId,
        uint256 indexed batchIndex,
        uint256 amount,
        uint32 households,
        uint32 unregistered,
        bytes32 docHash
    );
    event LineConfirmed(uint256 indexed hopId, uint256 indexed batchIndex, bool received, bool byProxy);
    event ProxyOverridden(uint256 indexed hopId, uint256 indexed batchIndex, uint8 previous);
    event ProgramDelivery(uint256 indexed hopId, uint256 amount);
    event AuditDrawn(uint256 indexed hopId, uint256 indexed batchIndex, uint256 sampleSize, uint256 seedBlock, bytes32 seed);
    event AuditorSet(address indexed auditor, bool active);
    event AuditVisit(
        uint256 indexed hopId, uint256 indexed batchIndex, address receipt, uint8 outcome, address indexed auditor
    );

    error OnlyFund();
    error OnlyRecipient();
    error OnlyAidPrograms();
    error NotAcknowledged();
    error AlreadyAcknowledged();
    error ExceedsRemaining(uint256 remaining);
    error UnknownHop();
    error NotInRoster();
    error BadSignature();
    error AlreadyRecorded();
    error AlreadySet();
    error NotRegisteredHousehold();
    error BadRoster();
    error DuplicateLine(address receipt);
    error UnknownBatch();
    error AuditTooEarly();
    error AuditAlreadyDrawn();
    error NotAuditor();
    error NotSampled();
    error BadOutcome();
    error BadParams();

    constructor(IKeptFactory _factory, IEligibilityRegistry _registry, address _owner)
        Ownable(_owner)
        EIP712("Kept CustodyLedger", "1")
    {
        factory = _factory;
        registry = _registry;
        _hops.push(); // index 0 is the "no parent" sentinel
    }

    /// @notice Auditors visit sampled households. They should be independent of every custodian (in
    /// production the owner is a multisig of independent bodies).
    function setAuditor(address auditor, bool active) external onlyOwner {
        isAuditor[auditor] = active;
        emit AuditorSet(auditor, active);
    }

    function setAidPrograms(address _aidPrograms) external onlyOwner {
        if (aidPrograms != address(0)) revert AlreadySet();
        if (_aidPrograms == address(0)) revert BadParams();
        aidPrograms = _aidPrograms;
    }

    // ------------------------------------------------------------------
    // Hops
    // ------------------------------------------------------------------

    /// @notice Called by a Kept fund when an allocation executes (the tokens have already moved).
    function recordAllocation(
        uint256, /* proposalId */
        uint8 purposeId,
        address to,
        uint256 amount,
        uint32 estHouseholds,
        bytes32 evidenceHash
    ) external returns (uint256 hopId) {
        if (!factory.isFund(msg.sender)) revert OnlyFund();
        hopId = _createHop(0, msg.sender, msg.sender, to, purposeId, amount, estHouseholds, evidenceHash);
    }

    function acknowledge(uint256 hopId) external {
        Hop storage h = _hop(hopId);
        if (msg.sender != h.to) revert OnlyRecipient();
        if (h.ackAt != 0) revert AlreadyAcknowledged();
        h.ackAt = uint64(block.timestamp);
        emit HopAcknowledged(hopId, msg.sender);
    }

    /// @notice Pass part of a tranche on to the next custodian (money moves off-chain, by bank).
    function forward(uint256 parentId, address to, uint256 amount, uint32 estHouseholds, bytes32 evidenceHash)
        external
        returns (uint256 hopId)
    {
        Hop storage p = _hop(parentId);
        _requireHolder(p);
        uint256 rem = remaining(parentId);
        if (amount == 0 || amount > rem) revert ExceedsRemaining(rem);
        p.forwarded += amount;
        hopId = _createHop(parentId, p.fund, msg.sender, to, p.purposeId, amount, estHouseholds, evidenceHash);
    }

    /// @notice Publish a payment batch as pseudonymous lines (receipt address, amount). The total and
    /// the household count are computed here, and lines that are not registered households are counted.
    function reconcile(uint256 hopId, address[] calldata receipts, uint256[] calldata amounts, bytes32 docHash)
        external
        returns (uint256 batchIndex)
    {
        Hop storage h = _hop(hopId);
        _requireHolder(h);
        uint256 n = receipts.length;
        if (n == 0 || n != amounts.length || n > MAX_LINES) revert BadRoster();

        uint256 disasterId = IReliefFund(h.fund).disasterId();
        batchIndex = _batches[hopId].length;
        address[] storage list = _lineReceipts[hopId][batchIndex];
        uint256 total;
        uint32 unregistered;
        for (uint256 i = 0; i < n; i++) {
            address r = receipts[i];
            uint256 a = amounts[i];
            if (a == 0) revert BadRoster();
            bytes32 key = keccak256(abi.encode(hopId, batchIndex, r));
            if (_lineAmount[key] != 0) revert DuplicateLine(r);
            _lineAmount[key] = a;
            list.push(r);
            total += a;
            if (registry.villageOfReceipt(disasterId, r) == 0) unregistered++;
        }

        uint256 rem = remaining(hopId);
        if (total > rem) revert ExceedsRemaining(rem);
        h.reconciled += total;
        h.reconciledHouseholds += uint32(n);
        h.unregistered += unregistered;
        _batches[hopId].push(
            Batch({
                amount: total,
                households: uint32(n),
                unregistered: unregistered,
                docHash: docHash,
                at: uint64(block.timestamp),
                atBlock: uint64(block.number)
            })
        );
        emit Reconciled(hopId, batchIndex, total, uint32(n), unregistered, docHash);
    }

    /// @notice An NGO handed aid over in person after verifying a zero-knowledge eligibility proof.
    function recordProgramDelivery(uint256 hopId, uint256 amount) external {
        if (msg.sender != aidPrograms) revert OnlyAidPrograms();
        Hop storage h = _hop(hopId);
        if (h.ackAt == 0) revert NotAcknowledged();
        uint256 rem = remaining(hopId);
        if (amount > rem) revert ExceedsRemaining(rem);
        h.reconciled += amount;
        h.reconciledHouseholds++;
        h.programDelivered++;
        emit ProgramDelivery(hopId, amount);
    }

    // ------------------------------------------------------------------
    // Household confirmation / dispute (relayed; the household signs, never pays gas)
    // ------------------------------------------------------------------

    function confirmLine(uint256 hopId, uint256 batchIndex, address receipt, bool received, bytes calldata signature)
        external
    {
        Hop storage h = _hop(hopId);
        bytes32 key = keccak256(abi.encode(hopId, batchIndex, receipt));
        uint256 amount = _lineAmount[key];
        if (amount == 0) revert NotInRoster();

        uint256 disasterId = IReliefFund(h.fund).disasterId();
        uint32 village = registry.villageOfReceipt(disasterId, receipt);
        if (village == 0) revert NotRegisteredHousehold();

        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(RECEIPT_TYPEHASH, hopId, batchIndex, receipt, amount, received))
        );
        address signer = ECDSA.recover(digest, signature);
        bool byProxy;
        if (signer != receipt) {
            if (!registry.isProxy(disasterId, village, signer)) revert BadSignature();
            byProxy = true;
        }

        uint8 prev = lineState[key];
        // The household's own answer is final. A proxy can only answer an untouched line.
        if (prev == CONFIRMED || prev == DISPUTED || (prev != 0 && byProxy)) revert AlreadyRecorded();
        if (prev == PROXY_CONFIRMED) h.proxyConfirmed--;
        else if (prev == PROXY_DISPUTED) h.disputed--;
        if (prev != 0) emit ProxyOverridden(hopId, batchIndex, prev);
        lineState[key] = byProxy ? (received ? PROXY_CONFIRMED : PROXY_DISPUTED) : (received ? CONFIRMED : DISPUTED);

        if (!received) h.disputed++;
        else if (byProxy) h.proxyConfirmed++;
        else h.confirmed++;
        emit LineConfirmed(hopId, batchIndex, received, byProxy);
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------

    // ------------------------------------------------------------------
    // Sample audits
    // ------------------------------------------------------------------

    function auditSampleSize(uint256 lines) public pure returns (uint256 n) {
        n = (lines + 4) / 5;
        if (n < AUDIT_MIN) n = AUDIT_MIN;
        if (n > AUDIT_MAX) n = AUDIT_MAX;
        if (n > lines) n = lines;
    }

    /// @notice The block whose hash seeds a batch's sample: AUDIT_DELAY blocks after publication. Only the
    /// last 256 block hashes are readable, so a draw made later uses the next block on the same 256-block
    /// grid; the block used is public (auditSeedBlockUsed), so a late draw is visible.
    function auditSeedBlock(uint256 hopId, uint256 batchIndex) public view returns (uint256 seedBlock) {
        if (batchIndex >= _batches[hopId].length) revert UnknownBatch();
        uint256 first = _batches[hopId][batchIndex].atBlock + AUDIT_DELAY;
        if (block.number <= first) revert AuditTooEarly();
        seedBlock = first + ((block.number - first - 1) / 256) * 256;
    }

    /// @notice Anyone can draw the audit sample of a published batch once its seed block exists.
    function drawAudit(uint256 hopId, uint256 batchIndex) external returns (address[] memory picks) {
        _hop(hopId);
        uint256 seedBlock = auditSeedBlock(hopId, batchIndex);
        address[] storage out = _auditPicks[hopId][batchIndex];
        if (out.length != 0) revert AuditAlreadyDrawn();

        address[] storage lines = _lineReceipts[hopId][batchIndex];
        uint256 n = lines.length;
        uint256 k = auditSampleSize(n);
        bytes32 seed = keccak256(abi.encode(blockhash(seedBlock), hopId, batchIndex));
        uint256[] memory idx = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            idx[i] = i;
        }
        // Partial Fisher-Yates shuffle: the first k positions are a uniform sample without replacement.
        for (uint256 i = 0; i < k; i++) {
            uint256 j = i + (uint256(keccak256(abi.encode(seed, i))) % (n - i));
            (idx[i], idx[j]) = (idx[j], idx[i]);
            address receipt = lines[idx[i]];
            out.push(receipt);
            _picked[keccak256(abi.encode(hopId, batchIndex, receipt))] = true;
        }
        auditSeedBlockUsed[hopId][batchIndex] = seedBlock;
        emit AuditDrawn(hopId, batchIndex, k, seedBlock, seed);
        picks = out;
    }

    /// @notice An auditor records the in-person visit to a sampled household. "Received" and "not received"
    /// need the household's own signature over this visit (made in front of the auditor with its receipt
    /// key), so an auditor cannot invent them and an earlier remote confirmation cannot be reused. "Not found
    /// at the registered address" is the auditor's own statement, recorded under its address.
    function recordAuditVisit(
        uint256 hopId,
        uint256 batchIndex,
        address receipt,
        uint8 outcome,
        bytes calldata householdSig
    ) external {
        if (!isAuditor[msg.sender]) revert NotAuditor();
        bytes32 key = keccak256(abi.encode(hopId, batchIndex, receipt));
        if (!_picked[key]) revert NotSampled();
        if (auditOutcome[key] != 0) revert AlreadyRecorded();
        if (outcome == VISIT_RECEIVED || outcome == VISIT_NOT_RECEIVED) {
            bytes32 digest = _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        AUDIT_VISIT_TYPEHASH,
                        hopId,
                        batchIndex,
                        receipt,
                        _lineAmount[key],
                        outcome == VISIT_RECEIVED,
                        msg.sender
                    )
                )
            );
            if (ECDSA.recover(digest, householdSig) != receipt) revert BadSignature();
        } else if (outcome != VISIT_NOT_FOUND) {
            revert BadOutcome();
        }
        auditOutcome[key] = outcome;
        auditedBy[key] = msg.sender;
        emit AuditVisit(hopId, batchIndex, receipt, outcome, msg.sender);
    }

    /// @notice The receipt addresses drawn for a batch's audit (empty until drawn).
    function auditPicks(uint256 hopId, uint256 batchIndex) external view returns (address[] memory) {
        return _auditPicks[hopId][batchIndex];
    }

    /// @notice Amount recorded for a receipt address in a batch (0 = not in that batch).
    function lineAmount(uint256 hopId, uint256 batchIndex, address receipt) external view returns (uint256) {
        return _lineAmount[keccak256(abi.encode(hopId, batchIndex, receipt))];
    }

    /// @notice All lines of a batch, in the order the custodian published them.
    function batchLines(uint256 hopId, uint256 batchIndex)
        external
        view
        returns (address[] memory receipts, uint256[] memory amounts)
    {
        receipts = _lineReceipts[hopId][batchIndex];
        amounts = new uint256[](receipts.length);
        for (uint256 i = 0; i < receipts.length; i++) {
            amounts[i] = _lineAmount[keccak256(abi.encode(hopId, batchIndex, receipts[i]))];
        }
    }

    function remaining(uint256 hopId) public view returns (uint256) {
        Hop storage h = _hops[hopId];
        return h.amount - h.forwarded - h.reconciled;
    }

    function hopCount() external view returns (uint256) {
        return _hops.length - 1;
    }

    function hop(uint256 hopId) external view returns (Hop memory) {
        return _hop(hopId);
    }

    function hopRecipient(uint256 hopId) external view returns (address) {
        return _hop(hopId).to;
    }

    function batchCount(uint256 hopId) external view returns (uint256) {
        return _batches[hopId].length;
    }

    function batch(uint256 hopId, uint256 batchIndex) external view returns (Batch memory) {
        return _batches[hopId][batchIndex];
    }

    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    // ------------------------------------------------------------------
    // Internal
    // ------------------------------------------------------------------

    function _createHop(
        uint256 parent,
        address fund,
        address from,
        address to,
        uint8 purposeId,
        uint256 amount,
        uint32 estHouseholds,
        bytes32 evidenceHash
    ) internal returns (uint256 hopId) {
        hopId = _hops.length;
        Hop storage h = _hops.push();
        h.parent = parent;
        h.fund = fund;
        h.from = from;
        h.to = to;
        h.amount = amount;
        h.purposeId = purposeId;
        h.estHouseholds = estHouseholds;
        h.evidenceHash = evidenceHash;
        h.createdAt = uint64(block.timestamp);
        emit HopCreated(hopId, parent, fund, from, to, purposeId, amount, estHouseholds, evidenceHash);
    }

    function _hop(uint256 hopId) internal view returns (Hop storage h) {
        if (hopId == 0 || hopId >= _hops.length) revert UnknownHop();
        h = _hops[hopId];
    }

    function _requireHolder(Hop storage h) internal view {
        if (msg.sender != h.to) revert OnlyRecipient();
        if (h.ackAt == 0) revert NotAcknowledged();
    }
}
