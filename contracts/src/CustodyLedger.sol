// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {IKeptFactory} from "./interfaces/IKept.sol";

/// @title CustodyLedger
/// @notice Follows each tranche of donated money through every pair of hands until it reaches a household.
///
///   Allocated/Disbursed  fund -> custodian (on-chain transfer, recorded by the fund)
///   Acknowledged         the receiving custodian confirms receipt (two-sided record)
///   Forwarded            custodian -> next custodian (e.g. foundation -> ministry -> county)
///   Reconciled           the paying custodian commits a Merkle root of its payment roster
///                        (one hashed leaf per household: receipt address + amount)
///   Delivered            the household itself signs "received" (or a registered proxy does)
///   Disputed             the household signs "recorded as paid, but I did not receive it"
///
/// The roster never goes on-chain. The public sees totals; each household can prove it is counted,
/// and only a real household (holder of the receipt key) can confirm or dispute its own line.
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
    }

    struct Batch {
        bytes32 root;
        uint256 amount;
        uint32 households;
        bytes32 docHash;
        uint64 at;
    }

    bytes32 public constant RECEIPT_TYPEHASH =
        keccak256("Receipt(uint256 hopId,uint256 batchIndex,address receipt,uint256 amount,bool received)");

    IKeptFactory public immutable factory;
    address public aidPrograms;

    Hop[] internal _hops;
    mapping(uint256 hopId => Batch[]) internal _batches;
    mapping(bytes32 => uint8) public lineState; // keccak(hopId, batchIndex, receipt) => 1 confirmed, 2 disputed
    mapping(address => bool) public isProxy; // registered social workers / village chiefs

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
        uint256 indexed hopId, uint256 indexed batchIndex, bytes32 root, uint256 amount, uint32 households, bytes32 docHash
    );
    event LineConfirmed(uint256 indexed hopId, uint256 indexed batchIndex, bool received, bool byProxy);
    event ProgramDelivery(uint256 indexed hopId, uint256 amount);
    event ProxySet(address indexed proxy, bool active);

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

    constructor(IKeptFactory _factory, address _owner) Ownable(_owner) EIP712("Kept CustodyLedger", "1") {
        factory = _factory;
        _hops.push(); // index 0 is the "no parent" sentinel
    }

    function setAidPrograms(address _aidPrograms) external onlyOwner {
        if (aidPrograms != address(0)) revert AlreadySet();
        aidPrograms = _aidPrograms;
    }

    function setProxy(address proxy, bool active) external onlyOwner {
        isProxy[proxy] = active;
        emit ProxySet(proxy, active);
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

    /// @notice Commit a payment roster batch: Merkle root over (receipt address, amount) leaves.
    function reconcile(uint256 hopId, bytes32 root, uint256 amount, uint32 households, bytes32 docHash)
        external
        returns (uint256 batchIndex)
    {
        Hop storage h = _hop(hopId);
        _requireHolder(h);
        uint256 rem = remaining(hopId);
        if (amount == 0 || amount > rem) revert ExceedsRemaining(rem);
        h.reconciled += amount;
        h.reconciledHouseholds += households;
        batchIndex = _batches[hopId].length;
        _batches[hopId].push(
            Batch({root: root, amount: amount, households: households, docHash: docHash, at: uint64(block.timestamp)})
        );
        emit Reconciled(hopId, batchIndex, root, amount, households, docHash);
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

    function confirmLine(
        uint256 hopId,
        uint256 batchIndex,
        address receipt,
        uint256 amount,
        bool received,
        bytes32[] calldata merkleProof,
        bytes calldata signature
    ) external {
        _hop(hopId);
        Batch storage b = _batches[hopId][batchIndex];
        if (!MerkleProof.verifyCalldata(merkleProof, b.root, leaf(receipt, amount))) revert NotInRoster();

        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(RECEIPT_TYPEHASH, hopId, batchIndex, receipt, amount, received))
        );
        address signer = ECDSA.recover(digest, signature);
        bool byProxy;
        if (signer != receipt) {
            if (!isProxy[signer]) revert BadSignature();
            byProxy = true;
        }

        bytes32 key = keccak256(abi.encode(hopId, batchIndex, receipt));
        if (lineState[key] != 0) revert AlreadyRecorded();
        lineState[key] = received ? 1 : 2;

        Hop storage h = _hops[hopId];
        if (!received) h.disputed++;
        else if (byProxy) h.proxyConfirmed++;
        else h.confirmed++;
        emit LineConfirmed(hopId, batchIndex, received, byProxy);
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------

    /// @notice OpenZeppelin StandardMerkleTree leaf encoding for (address, uint256).
    function leaf(address receipt, uint256 amount) public pure returns (bytes32) {
        return keccak256(bytes.concat(keccak256(abi.encode(receipt, amount))));
    }

    function verifyInclusion(uint256 hopId, uint256 batchIndex, address receipt, uint256 amount, bytes32[] calldata proof)
        external
        view
        returns (bool)
    {
        return MerkleProof.verifyCalldata(proof, _batches[hopId][batchIndex].root, leaf(receipt, amount));
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
