// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {IEligibilityRegistry, ICustodyLedger} from "./interfaces/IKept.sol";

/// @title AidPrograms
/// @notice "Show your QR" mode for NGOs: verify a household's eligibility on the spot without ever
/// receiving the government roster. Each programme has its own Semaphore scope, so:
///   - the same household cannot claim the same programme twice, and
///   - claims in different programmes cannot be linked to each other (no cross-programme profile).
/// Only the NGO's own terminal can submit a claim, right after handing the aid over, so a claim
/// counts as an in-person delivery on the custody ledger.
contract AidPrograms {
    struct Program {
        address ngo;
        uint256 hopId; // 0 = funded from the NGO's own resources
        uint256 disasterId;
        uint256 amountPerHousehold;
        uint32 tierMask; // bit i set => tier i eligible
        uint32 claims;
        bool active;
        string name;
    }

    IEligibilityRegistry public immutable registry;
    ICustodyLedger public immutable ledger;

    Program[] internal _programs;
    mapping(uint256 programId => mapping(uint256 nullifier => bool)) public claimed;

    event ProgramCreated(
        uint256 indexed programId,
        address indexed ngo,
        uint256 indexed hopId,
        uint256 disasterId,
        uint32 tierMask,
        uint256 amountPerHousehold,
        string name
    );
    event ProgramClosed(uint256 indexed programId);
    event Claimed(uint256 indexed programId, uint8 tier, uint256 nullifier);

    error NotHopRecipient();
    error OnlyNgo();
    error Inactive();
    error WrongScope();
    error TierNotEligible();
    error AlreadyClaimed();
    error InvalidProof();

    constructor(IEligibilityRegistry _registry, ICustodyLedger _ledger) {
        registry = _registry;
        ledger = _ledger;
        _programs.push(); // id 0 unused
    }

    function createProgram(
        uint256 hopId,
        uint256 disasterId,
        uint32 tierMask,
        uint256 amountPerHousehold,
        string calldata name
    ) external returns (uint256 programId) {
        if (hopId != 0 && ledger.hopRecipient(hopId) != msg.sender) revert NotHopRecipient();
        programId = _programs.length;
        _programs.push(
            Program({
                ngo: msg.sender,
                hopId: hopId,
                disasterId: disasterId,
                amountPerHousehold: amountPerHousehold,
                tierMask: tierMask,
                claims: 0,
                active: true,
                name: name
            })
        );
        emit ProgramCreated(programId, msg.sender, hopId, disasterId, tierMask, amountPerHousehold, name);
    }

    function closeProgram(uint256 programId) external {
        Program storage p = _programs[programId];
        if (msg.sender != p.ngo) revert OnlyNgo();
        p.active = false;
        emit ProgramClosed(programId);
    }

    function claim(uint256 programId, uint256 groupId, ISemaphore.SemaphoreProof calldata proof) external {
        Program storage p = _programs[programId];
        if (msg.sender != p.ngo) revert OnlyNgo();
        if (!p.active) revert Inactive();
        if (proof.scope != scopeOf(programId)) revert WrongScope();
        if (!registry.isGroup(groupId) || registry.groupDisaster(groupId) != p.disasterId) revert InvalidProof();
        uint8 tier = registry.groupTier(groupId);
        if (p.tierMask & (uint32(1) << tier) == 0) revert TierNotEligible();
        if (claimed[programId][proof.nullifier]) revert AlreadyClaimed();
        if (!registry.semaphore().verifyProof(groupId, proof)) revert InvalidProof();

        claimed[programId][proof.nullifier] = true;
        p.claims++;
        if (p.hopId != 0) ledger.recordProgramDelivery(p.hopId, p.amountPerHousehold);
        emit Claimed(programId, tier, proof.nullifier);
    }

    function scopeOf(uint256 programId) public view returns (uint256) {
        return uint256(keccak256(abi.encode(address(this), programId))) >> 8;
    }

    function programCount() external view returns (uint256) {
        return _programs.length - 1;
    }

    function program(uint256 programId) external view returns (Program memory) {
        return _programs[programId];
    }
}
