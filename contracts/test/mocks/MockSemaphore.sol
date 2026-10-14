// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

/// @notice Unit-test stand-in for Semaphore. Tracks members and admins like the real contract;
/// a "proof" is valid when points[0] == 1 and the group has members. Real proofs are exercised in
/// the end-to-end script against the real Semaphore deployment.
contract MockSemaphore {
    uint256 public groupCounter;
    mapping(uint256 => address) public admin;
    mapping(uint256 => mapping(uint256 => bool)) public isMember;
    mapping(uint256 => uint256) public size;

    function createGroup(address _admin, uint256) external returns (uint256 id) {
        id = groupCounter++;
        admin[id] = _admin;
    }

    function addMember(uint256 groupId, uint256 commitment) external {
        require(msg.sender == admin[groupId], "not admin");
        isMember[groupId][commitment] = true;
        size[groupId]++;
    }

    function removeMember(uint256 groupId, uint256 commitment, uint256[] calldata) external {
        require(msg.sender == admin[groupId], "not admin");
        require(isMember[groupId][commitment], "not member");
        isMember[groupId][commitment] = false;
        size[groupId]--;
    }

    function updateMember(uint256 groupId, uint256 oldC, uint256 newC, uint256[] calldata) external {
        require(msg.sender == admin[groupId], "not admin");
        require(isMember[groupId][oldC], "not member");
        isMember[groupId][oldC] = false;
        isMember[groupId][newC] = true;
    }

    function verifyProof(uint256 groupId, ISemaphore.SemaphoreProof calldata proof) external view returns (bool) {
        return size[groupId] > 0 && proof.points[0] == 1;
    }
}
