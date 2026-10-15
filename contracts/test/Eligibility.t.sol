// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Base} from "./Base.t.sol";
import {EligibilityRegistry} from "../src/EligibilityRegistry.sol";
import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract EligibilityTest is Base {
    function test_TwoSignatureRegistration() public {
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"), _receiptOf(111));
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
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"), _receiptOf(111));
        vm.prank(office);
        vm.expectRevert(EligibilityRegistry.SameRoleCannotApprove.selector);
        registry.approveRegistration(id);
    }

    function test_ChiefCannotActOutsideOwnVillage() public {
        vm.prank(chiefA);
        vm.expectRevert(EligibilityRegistry.OutOfJurisdiction.selector);
        registry.proposeRegistration(disasterId, 0, VILLAGE_B, 111, keccak256("B-1"), _receiptOf(111));
    }

    function test_OfficeCannotActOutsideTownship() public {
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"), _receiptOf(111));
        vm.prank(otherOffice);
        vm.expectRevert(EligibilityRegistry.OutOfJurisdiction.selector);
        registry.approveRegistration(id);
    }

    function test_SameHouseholdCannotRegisterTwiceAcrossVillages() public {
        bytes32 tag = keccak256("HMAC(national id)");
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, tag, _receiptOf(111));
        vm.prank(office);
        registry.approveRegistration(id);

        vm.prank(chiefB);
        vm.expectRevert(EligibilityRegistry.DuplicateHousehold.selector);
        registry.proposeRegistration(disasterId, 2, VILLAGE_B, 222, tag, _receiptOf(222));
    }

    function test_RejectionIsCountedAgainstIssuer() public {
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"), _receiptOf(111));
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
        registry.replaceMember(disasterId, 0, VILLAGE_A, 111, 999, _receiptOf(999), siblings, keccak256("card lost in flood"));
        assertTrue(sem.isMember(_group(0), 999));
        assertFalse(sem.isMember(_group(0), 111));
        assertEq(registry.verifiedHouseholds(disasterId), 1);
        assertEq(registry.villageOfReceipt(disasterId, _receiptOf(111)), 0, "old receipt key stops counting");
        assertEq(registry.villageOfReceipt(disasterId, _receiptOf(999)), VILLAGE_A);
    }

    // ---------------- receipt addresses and proxies ----------------

    function test_ReceiptAddressCountsOnlyAfterSecondSignature() public {
        address receipt = _receiptOf(111);
        vm.prank(chiefA);
        uint256 id = registry.proposeRegistration(disasterId, 0, VILLAGE_A, 111, keccak256("A-1"), receipt);
        assertEq(registry.villageOfReceipt(disasterId, receipt), 0);
        vm.prank(office);
        registry.approveRegistration(id);
        assertEq(registry.villageOfReceipt(disasterId, receipt), VILLAGE_A);
        assertEq(registry.villageOfReceipt(disasterId + 1, receipt), 0, "scoped to the disaster");
    }

    function test_ReceiptAddressCannotBeReusedOrZero() public {
        _register(chiefA, office, 0, VILLAGE_A, 111, _receiptOf(111));
        vm.prank(chiefB);
        vm.expectRevert(EligibilityRegistry.DuplicateHousehold.selector);
        registry.proposeRegistration(disasterId, 0, VILLAGE_B, 222, keccak256("B-1"), _receiptOf(111));
        vm.prank(chiefB);
        vm.expectRevert(EligibilityRegistry.ZeroAddress.selector);
        registry.proposeRegistration(disasterId, 0, VILLAGE_B, 222, keccak256("B-1"), address(0));
    }

    function test_RevokedHouseholdReceiptStopsCounting() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        uint256[] memory siblings;
        vm.prank(office);
        registry.revokeMember(disasterId, 0, VILLAGE_A, 111, siblings, keccak256("registered in error"));
        assertEq(registry.villageOfReceipt(disasterId, _receiptOf(111)), 0);
    }

    function test_ProxiesAreDesignatedPerVillageByTheTownshipOffice() public {
        address worker = makeAddr("social worker");
        vm.prank(chiefA);
        vm.expectRevert(EligibilityRegistry.NotIssuer.selector);
        registry.setProxy(disasterId, VILLAGE_A, worker, true);
        vm.prank(otherOffice);
        vm.expectRevert(EligibilityRegistry.OutOfJurisdiction.selector);
        registry.setProxy(disasterId, VILLAGE_A, worker, true);

        vm.prank(office);
        registry.setProxy(disasterId, VILLAGE_A, worker, true);
        assertTrue(registry.isProxy(disasterId, VILLAGE_A, worker));
        assertFalse(registry.isProxy(disasterId, VILLAGE_B, worker), "only for the village designated");

        vm.prank(office);
        registry.setProxy(disasterId, VILLAGE_A, worker, false);
        assertFalse(registry.isProxy(disasterId, VILLAGE_A, worker));
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

    // ---------------- anonymous "still waiting" reports ----------------

    function _waitingProof(uint256 nullifier, uint256 village, uint64 period) internal view returns (ISemaphore.SemaphoreProof memory) {
        return _proof(nullifier, village, registry.waitingScope(disasterId, period), true);
    }

    function test_VerifiedHouseholdReportsWaitingOncePerPeriod() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        uint256 g0 = _group(0);
        registry.reportWaiting(disasterId, g0, _waitingProof(7, VILLAGE_A, 0)); // relayed by anyone
        assertEq(registry.waitingReports(disasterId, 0, VILLAGE_A), 1);

        ISemaphore.SemaphoreProof memory again = _waitingProof(7, VILLAGE_A, 0);
        vm.expectRevert(EligibilityRegistry.AlreadyReported.selector);
        registry.reportWaiting(disasterId, g0, again);

        // A week later the same household can say it is still waiting.
        vm.warp(block.timestamp + 7 days);
        assertEq(registry.currentPeriod(disasterId), 1);
        registry.reportWaiting(disasterId, g0, _waitingProof(8, VILLAGE_A, 1));
        assertEq(registry.waitingReports(disasterId, 1, VILLAGE_A), 1);
    }

    function test_WaitingReportChecksProofScopeAndVillage() public {
        uint256 g0 = _group(0);
        ISemaphore.SemaphoreProof memory p = _waitingProof(1, VILLAGE_A, 0);
        p.points[0] = 0; // not a member
        vm.expectRevert(EligibilityRegistry.InvalidProof.selector);
        registry.reportWaiting(disasterId, g0, p);

        ISemaphore.SemaphoreProof memory stale = _waitingProof(2, VILLAGE_A, 1); // wrong period
        vm.expectRevert(EligibilityRegistry.WrongScope.selector);
        registry.reportWaiting(disasterId, g0, stale);

        ISemaphore.SemaphoreProof memory nowhere = _waitingProof(3, 999, 0);
        vm.expectRevert(EligibilityRegistry.UnknownVillage.selector);
        registry.reportWaiting(disasterId, g0, nowhere);
    }

    // ---------------- enumerable state (no event logs needed) ----------------

    function test_IssuersAndVillagesAreListed() public view {
        assertEq(registry.issuerCount(), 4);
        assertEq(registry.issuerList(0), office);
        assertEq(registry.villageCount(), 3);
        assertEq(registry.villageList(1), VILLAGE_B);
    }

    function test_GroupMembersMirrorTheTree() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        _register(chiefA, office, 0, VILLAGE_A, 222);
        _register(chiefA, office, 0, VILLAGE_A, 333);
        uint256[] memory siblings;
        vm.startPrank(office);
        registry.revokeMember(disasterId, 0, VILLAGE_A, 222, siblings, bytes32(0));
        registry.replaceMember(disasterId, 0, VILLAGE_A, 333, 444, _receiptOf(444), siblings, bytes32(0));
        vm.stopPrank();
        uint256[] memory m = registry.groupMembers(_group(0));
        assertEq(m.length, 3);
        assertEq(m[0], 111);
        assertEq(m[1], 0, "revoked leaf is zero");
        assertEq(m[2], 444, "replaced in place");
    }
}
