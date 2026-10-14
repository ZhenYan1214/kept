// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {IEligibilityRegistry, IKeptFactory} from "./interfaces/IKept.sol";

/// @title VoiceModule
/// @notice Verified disaster-affected households get one anonymous vote on how their fund changes.
/// The same credential that lets a household receive aid lets it say no to a change of purpose.
/// Votes are Semaphore signals: the proof shows "I am a verified household of this disaster"
/// without revealing which one, and the nullifier (scoped to the vote) enforces one vote each,
/// across all damage tiers.
contract VoiceModule {
    struct Vote {
        address fund;
        uint256 disasterId;
        uint256 eligibleSnapshot;
        bytes32 descHash;
        uint64 opensAt;
        uint64 closesAt;
        uint32 yes;
        uint32 no;
        uint16 quorumBps;
    }

    IEligibilityRegistry public immutable registry;
    IKeptFactory public immutable factory;

    mapping(bytes32 => Vote) public votes;
    mapping(bytes32 voteKey => mapping(uint256 nullifier => bool)) public nullifierUsed;
    uint256 public voteNonce;

    event VoteOpened(
        bytes32 indexed voteKey,
        address indexed fund,
        uint256 indexed disasterId,
        uint64 closesAt,
        uint256 eligible,
        uint16 quorumBps,
        bytes32 descHash
    );
    event VoteCast(bytes32 indexed voteKey, bool support, uint256 nullifier);

    error OnlyFund();
    error VoteNotOpen();
    error WrongScope();
    error BadMessage();
    error AlreadyVoted();
    error InvalidProof();

    constructor(IEligibilityRegistry _registry, IKeptFactory _factory) {
        registry = _registry;
        factory = _factory;
    }

    function openVote(uint256 disasterId, uint64 duration, uint16 quorumBps, bytes32 descHash)
        external
        returns (bytes32 voteKey)
    {
        if (!factory.isFund(msg.sender)) revert OnlyFund();
        voteKey = keccak256(abi.encode(address(this), msg.sender, ++voteNonce));
        uint64 closesAt = uint64(block.timestamp) + duration;
        uint256 eligible = registry.verifiedHouseholds(disasterId);
        votes[voteKey] = Vote({
            fund: msg.sender,
            disasterId: disasterId,
            eligibleSnapshot: eligible,
            descHash: descHash,
            opensAt: uint64(block.timestamp),
            closesAt: closesAt,
            yes: 0,
            no: 0,
            quorumBps: quorumBps
        });
        emit VoteOpened(voteKey, msg.sender, disasterId, closesAt, eligible, quorumBps, descHash);
    }

    /// @notice The Semaphore scope must equal the vote key and the message must be 0 (no) or 1 (yes).
    /// Anyone may relay the transaction, so households never need a wallet or gas.
    function castVote(bytes32 voteKey, uint256 groupId, ISemaphore.SemaphoreProof calldata proof) external {
        Vote storage v = votes[voteKey];
        if (v.fund == address(0) || block.timestamp >= v.closesAt) revert VoteNotOpen();
        if (proof.scope != scopeOf(voteKey)) revert WrongScope();
        if (proof.message > 1) revert BadMessage();
        if (nullifierUsed[voteKey][proof.nullifier]) revert AlreadyVoted();
        if (!registry.isGroup(groupId) || registry.groupDisaster(groupId) != v.disasterId) revert InvalidProof();
        if (!registry.semaphore().verifyProof(groupId, proof)) revert InvalidProof();

        nullifierUsed[voteKey][proof.nullifier] = true;
        bool support = proof.message == 1;
        if (support) v.yes++;
        else v.no++;
        emit VoteCast(voteKey, support, proof.nullifier);
    }

    /// @notice Semaphore scopes are field elements; map the vote key into the field deterministically.
    function scopeOf(bytes32 voteKey) public pure returns (uint256) {
        return uint256(voteKey) >> 8;
    }

    function isClosed(bytes32 voteKey) external view returns (bool) {
        return block.timestamp >= votes[voteKey].closesAt;
    }

    /// @notice A change is vetoed when more households vote no than yes and turnout reaches quorum.
    function isVetoed(bytes32 voteKey) public view returns (bool) {
        Vote storage v = votes[voteKey];
        uint256 turnout = uint256(v.yes) + v.no;
        return v.no > v.yes && turnout * 10_000 >= uint256(v.quorumBps) * v.eligibleSnapshot;
    }
}
