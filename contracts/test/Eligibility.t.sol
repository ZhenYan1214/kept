// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Base} from "./Base.t.sol";
import {EligibilityRegistry} from "../src/EligibilityRegistry.sol";

contract EligibilityTest is Base {
    function test_TwoSignatureRegistration() public {
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"));
        assertEq(registry.verifiedHouseholds(disasterId), 0, "not verified before second signature");

        vm.prank(office);
        registry.approveRegistration(id);
        assertEq(registry.verifiedHouseholds(disasterId), 1);
        assertTrue(sem.isMember(_group(0), 111));
        (uint32 verified,,,,,,,) = registry.villageStats(disasterId, VILLAGE_A);
        assertEq(verified, 1);
    }

    function test_SameRoleCannotApprove() public {
        vm.prank(office);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"));
        vm.prank(office);
        vm.expectRevert(EligibilityRegistry.SameRoleCannotApprove.selector);
        registry.approveRegistration(id);
    }

    function test_ChiefCannotActOutsideOwnVillage() public {
        vm.prank(chiefA);
        vm.expectRevert(EligibilityRegistry.OutOfJurisdiction.selector);
        registry.proposeRegistration(disasterId, 0, VILLAGE_B, 111, keccak256("B-1"));
    }

    function test_OfficeCannotActOutsideTownship() public {
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"));
        vm.prank(otherOffice);
        vm.expectRevert(EligibilityRegistry.OutOfJurisdiction.selector);
        registry.approveRegistration(id);
    }

    function test_SameHouseholdCannotRegisterTwiceAcrossVillages() public {
        bytes32 tag = keccak256("HMAC(national id)");
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, tag);
        vm.prank(office);
        registry.approveRegistration(id);

        vm.prank(chiefB);
        vm.expectRevert(EligibilityRegistry.DuplicateHousehold.selector);
        registry.proposeRegistration(disasterId, 2, VILLAGE_B, 222, tag);
    }

    function test_RejectionIsCountedAgainstIssuer() public {
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"));
        vm.prank(office);
        registry.rejectRegistration(id, keccak256("not a resident"));
        (,,, uint64 proposed, uint64 approved, uint64 rejected,,,) = registry.issuers(office);
        assertEq(proposed, 0);
        assertEq(approved, 0);
        assertEq(rejected, 1);
        assertEq(registry.verifiedHouseholds(disasterId), 0);
    }

    function test_AppealLifecycleIsPublic() public {
        // A household in a village left outside the "red zone" appeals.
        uint256 aid = registry.fileAppeal(disasterId, VILLAGE_B, keccak256("photos + chief statement"));
        (, uint32 filed, uint32 pending,,,,,) = registry.villageStats(disasterId, VILLAGE_B);
        assertEq(filed, 1);
        assertEq(pending, 1);

        vm.warp(block.timestamp + 3 days);
        vm.prank(office);
        registry.resolveAppeal(aid, true, keccak256("accepted: flooding confirmed"));
        (, , uint32 pending2, uint32 accepted,, , uint64 secs,) = registry.villageStats(disasterId, VILLAGE_B);
        assertEq(pending2, 0);
        assertEq(accepted, 1);
        assertEq(secs, 3 days);
    }

    function test_OnlyTownshipResolvesAppeals() public {
        uint256 aid = registry.fileAppeal(disasterId, VILLAGE_B, bytes32(0));
        vm.prank(chiefB);
        vm.expectRevert(EligibilityRegistry.NotIssuer.selector);
        registry.resolveAppeal(aid, true, bytes32(0));
    }

    function test_RevokeChecksVillage() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        uint256[] memory siblings;
        vm.prank(office);
        vm.expectRevert(EligibilityRegistry.OutOfJurisdiction.selector);
        registry.revokeMember(disasterId, 0, VILLAGE_B, 111, siblings, bytes32(0));

        vm.prank(office);
        registry.revokeMember(disasterId, 0, VILLAGE_A, 111, siblings, keccak256("registered in error"));
        assertEq(registry.verifiedHouseholds(disasterId), 0);
        assertFalse(sem.isMember(_group(0), 111));
    }

    function test_ReplaceLostCard() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        uint256[] memory siblings;
        vm.prank(office);
        registry.replaceMember(disasterId, 0, VILLAGE_A, 111, 999, siblings, keccak256("card lost in flood"));
        assertTrue(sem.isMember(_group(0), 999));
        assertFalse(sem.isMember(_group(0), 111));
        assertEq(registry.verifiedHouseholds(disasterId), 1);
    }

    function test_CoverageReport() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        _register(chiefA, office, 1, VILLAGE_A, 222);
        vm.prank(office);
        registry.reportCoverage(disasterId, VILLAGE_A, 1);
        (uint32 verified,,,,, uint32 unserved,,) = registry.villageStats(disasterId, VILLAGE_A);
        assertEq(verified, 2);
        assertEq(unserved, 1);
    }

    function test_VerifyMembershipChecksDisaster() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        assertTrue(registry.verifyMembership(disasterId, _group(0), _proof(1, 0, 0, true)));
        assertFalse(registry.verifyMembership(disasterId + 1, _group(0), _proof(1, 0, 0, true)));
        assertFalse(registry.verifyMembership(disasterId, _group(0), _proof(1, 0, 0, false)));
    }
}
