// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

/// @notice Read-only view of the eligibility registry used by the other Kept modules.
interface IEligibilityRegistry {
    function semaphore() external view returns (ISemaphore);
    function groupDisaster(uint256 groupId) external view returns (uint256);
    function groupTier(uint256 groupId) external view returns (uint8);
    function isGroup(uint256 groupId) external view returns (bool);
    function verifiedHouseholds(uint256 disasterId) external view returns (uint256);
}

/// @notice The factory is the single source of truth for which funds follow the audited template.
interface IKeptFactory {
    function isFund(address fund) external view returns (bool);
}

interface ICustodyLedger {
    function recordAllocation(
        uint256 proposalId,
        uint8 purposeId,
        address to,
        uint256 amount,
        uint32 estHouseholds,
        bytes32 evidenceHash
    ) external returns (uint256 hopId);

    function recordProgramDelivery(uint256 hopId, uint256 amount) external;

    function hopRecipient(uint256 hopId) external view returns (address);
}

interface IVoiceModule {
    function openVote(uint256 disasterId, uint64 duration, uint16 quorumBps, bytes32 descHash)
        external
        returns (bytes32 voteKey);

    function isVetoed(bytes32 voteKey) external view returns (bool);

    function isClosed(bytes32 voteKey) external view returns (bool);
}
