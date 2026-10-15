// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Base} from "./Base.t.sol";
import {ReliefFund} from "../src/ReliefFund.sol";
import {VoiceModule} from "../src/VoiceModule.sol";
import {CustodyLedger} from "../src/CustodyLedger.sol";
import {ICustodyLedger, IVoiceModule} from "../src/interfaces/IKept.sol";

contract ReliefFundTest is Base {
    function setUp() public override {
        super.setUp();
        _donate(1_000_000);
        // 20 verified households so quorum maths is meaningful (10% => 2 votes).
        for (uint256 i = 1; i <= 20; i++) {
            _register(chiefA, office, uint8(i % 3), VILLAGE_A, i);
        }
    }

    // ---------------- donations & allocations ----------------

    function test_DonationRecorded() public view {
        assertEq(fund.totalRaised(), 1_000_000);
        assertEq(fund.balance(), 1_000_000);
        assertEq(fund.donationCount(), 1);
    }

    function test_AllocationNeedsThresholdAndCreatesHop() public {
        vm.prank(c1);
        uint256 id = fund.proposeAllocation(1, ministry, 200_000, 1, keccak256("housing repair batch 1"));
        assertEq(twd.balanceOf(ministry), 0, "one signature is not enough");

        vm.prank(c2);
        fund.approve(id);
        assertEq(twd.balanceOf(ministry), 200_000);

        ReliefFund.Proposal memory p = fund.proposal(id);
        assertEq(uint8(p.status), uint8(ReliefFund.Status.Executed));
        CustodyLedger.Hop memory h = ledger.hop(p.hopId);
        assertEq(h.fund, address(fund));
        assertEq(h.to, ministry);
        assertEq(h.amount, 200_000);
    }

    function test_CapIsEnforced() public {
        // Housing repair cap is 30% of 1,000,000 = 300,000.
        vm.prank(c1);
        uint256 id = fund.proposeAllocation(1, ministry, 300_001, 1, bytes32(0));
        vm.prank(c2);
        vm.expectRevert(abi.encodeWithSelector(ReliefFund.CapExceeded.selector, uint8(1), uint256(300_000)));
        fund.approve(id);
    }

    function test_PurposeOutsideCharterIsImpossible() public {
        // "General public works" is not in the charter: there is no way to fund it.
        uint8 publicWorks = fund.NOT_IN_CHARTER();
        vm.prank(c1);
        vm.expectRevert(ReliefFund.PurposeNotInCharter.selector);
        fund.proposeAllocation(publicWorks, county, 100_000, 0, keccak256("county public works"));
    }

    function test_NonCommitteeCannotPropose() public {
        vm.prank(custodian);
        vm.expectRevert(ReliefFund.NotCommittee.selector);
        fund.proposeAllocation(0, ministry, 1, 1, bytes32(0));
    }

    function test_NoAllocationAfterDeadlineWithoutExtension() public {
        vm.prank(c1);
        uint256 id = fund.proposeAllocation(0, ministry, 1000, 1, bytes32(0));
        vm.warp(fund.deadline() + 1);
        vm.prank(c2);
        vm.expectRevert(ReliefFund.FundExpired.selector);
        fund.approve(id);
        vm.prank(c1);
        vm.expectRevert(ReliefFund.FundExpired.selector);
        fund.proposeAllocation(0, ministry, 1000, 1, bytes32(0));
    }

    // ---------------- governed changes & household veto ----------------

    function _queueCapChange() internal returns (uint256 id, bytes32 voteKey) {
        vm.prank(c1);
        id = fund.proposeCapChange(2, 1, 500, 3500, false, keccak256("move 5% to housing"));
        vm.prank(c2);
        fund.approve(id);
        ReliefFund.Proposal memory p = fund.proposal(id);
        assertEq(uint8(p.status), uint8(ReliefFund.Status.Queued));
        voteKey = p.voteKey;
    }

    function test_CapChangeWaitsForTimelock() public {
        (uint256 id,) = _queueCapChange();
        vm.expectRevert(ReliefFund.TimelockActive.selector);
        fund.execute(id);
    }

    function test_HouseholdsCanVetoCapChange() public {
        (uint256 id, bytes32 voteKey) = _queueCapChange();
        uint256 scope = voice.scopeOf(voteKey);
        voice.castVote(voteKey, _group(0), _proof(1001, 0, scope, true));
        voice.castVote(voteKey, _group(1), _proof(1002, 0, scope, true));
        voice.castVote(voteKey, _group(2), _proof(1003, 1, scope, true));

        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        assertEq(uint8(fund.proposal(id).status), uint8(ReliefFund.Status.Vetoed));
        assertEq(fund.purpose(1).capBps, 3000, "cap unchanged");
    }

    function test_CapChangePassesWithoutVeto() public {
        (uint256 id, bytes32 voteKey) = _queueCapChange();
        uint256 scope = voice.scopeOf(voteKey);
        voice.castVote(voteKey, _group(0), _proof(1001, 1, scope, true));
        voice.castVote(voteKey, _group(1), _proof(1002, 0, scope, true));

        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        assertEq(fund.purpose(1).capBps, 3500);
        assertEq(fund.purpose(2).capBps, 500);
    }

    function test_VetoNeedsQuorum() public {
        (uint256 id, bytes32 voteKey) = _queueCapChange();
        // Only 1 of 20 households votes (5% < 10% quorum): a lone "no" cannot block.
        voice.castVote(voteKey, _group(0), _proof(1001, 0, voice.scopeOf(voteKey), true));
        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        assertEq(uint8(fund.proposal(id).status), uint8(ReliefFund.Status.Executed));
    }

    function test_OneHouseholdOneVote() public {
        (, bytes32 voteKey) = _queueCapChange();
        uint256 scope = voice.scopeOf(voteKey);
        uint256 g0 = _group(0);
        uint256 g1 = _group(1);
        voice.castVote(voteKey, g0, _proof(1001, 0, scope, true));
        vm.expectRevert(VoiceModule.AlreadyVoted.selector);
        voice.castVote(voteKey, g1, _proof(1001, 0, scope, true));
    }

    function test_VoteRejectsInvalidOrForeignProofs() public {
        (, bytes32 voteKey) = _queueCapChange();
        uint256 scope = voice.scopeOf(voteKey);
        uint256 g0 = _group(0);
        vm.expectRevert(VoiceModule.InvalidProof.selector);
        voice.castVote(voteKey, g0, _proof(1, 0, scope, false));
        vm.expectRevert(VoiceModule.WrongScope.selector);
        voice.castVote(voteKey, g0, _proof(1, 0, scope + 1, true));
        vm.expectRevert(VoiceModule.BadMessage.selector);
        voice.castVote(voteKey, g0, _proof(1, 2, scope, true));
    }

    function test_VoteClosesAtTimelock() public {
        (, bytes32 voteKey) = _queueCapChange();
        uint256 scope = voice.scopeOf(voteKey);
        uint256 g0 = _group(0);
        vm.warp(block.timestamp + 7 days);
        vm.expectRevert(VoiceModule.VoteNotOpen.selector);
        voice.castVote(voteKey, g0, _proof(1, 0, scope, true));
    }

    function test_CapChangeCannotGoBelowAllocated() public {
        vm.prank(c1);
        uint256 a = fund.proposeAllocation(2, ngo, 100_000, 10, bytes32(0)); // full 10%
        vm.prank(c2);
        fund.approve(a);

        (uint256 id,) = _queueCapChange(); // tries to cut purpose 2 to 5%
        vm.warp(block.timestamp + 7 days);
        vm.expectRevert(ReliefFund.CapBelowAllocated.selector);
        fund.execute(id);
    }

    function test_EmergencyChangeIsImmediateButReviewed() public {
        vm.prank(c1);
        uint256 id = fund.proposeCapChange(0, 1, 5000, 4000, true, keccak256("temporary housing needed now"));
        vm.prank(c2);
        fund.approve(id);
        assertEq(uint8(fund.proposal(id).status), uint8(ReliefFund.Status.Pending), "needs 3 of 3");
        vm.prank(c3);
        fund.approve(id);

        ReliefFund.Proposal memory p = fund.proposal(id);
        assertEq(uint8(p.status), uint8(ReliefFund.Status.Executed));
        assertEq(fund.purpose(1).capBps, 4000);
        assertEq(p.movedBps, 1000);
        assertTrue(p.voteKey != bytes32(0), "household review opened");
        assertEq(p.executeAfter, block.timestamp + 7 days, "review closes after the waiting period");
    }

    function _emergencyMove() internal returns (uint256 id, bytes32 voteKey) {
        // Move 10 points of cap from livelihood relief (60%) to housing repair (30%), at once.
        vm.prank(c1);
        id = fund.proposeCapChange(0, 1, 5000, 4000, true, keccak256("temporary housing needed now"));
        vm.prank(c2);
        fund.approve(id);
        vm.prank(c3);
        fund.approve(id);
        voteKey = fund.proposal(id).voteKey;
    }

    function test_EmergencyMustOnlyMoveCap() public {
        vm.startPrank(c1);
        // Raising one cap without lowering another by the same amount is not an emergency move.
        vm.expectRevert(ReliefFund.EmergencyMustMoveCap.selector);
        fund.proposeCapChange(0, 1, 5000, 3500, true, bytes32(0));
        vm.expectRevert(ReliefFund.EmergencyMustMoveCap.selector);
        fund.proposeCapChange(0, 1, 6000, 3000, true, bytes32(0));
        vm.stopPrank();
    }

    function test_EmergencyVetoedOnReviewReturnsUnspentCapAndRevokesPath() public {
        (uint256 id, bytes32 voteKey) = _emergencyMove();
        // Spend part of the extra cap: housing gets 350,000 (cap now 400,000; it was 300,000).
        vm.prank(c1);
        uint256 a = fund.proposeAllocation(1, ministry, 350_000, 10, keccak256("temporary housing"));
        vm.prank(c2);
        fund.approve(a);

        vm.expectRevert(ReliefFund.ReviewNotClosed.selector);
        fund.concludeReview(id);

        uint256 scope = voice.scopeOf(voteKey);
        voice.castVote(voteKey, _group(0), _proof(1001, 0, scope, true));
        voice.castVote(voteKey, _group(1), _proof(1002, 0, scope, true));
        voice.castVote(voteKey, _group(2), _proof(1003, 0, scope, true));
        vm.warp(block.timestamp + 7 days);
        fund.concludeReview(id); // anyone can settle it

        // 5 of the 10 points were spent and stay spent; the other 5 go back.
        assertEq(fund.purpose(1).capBps, 3500);
        assertEq(fund.purpose(0).capBps, 5500);
        assertEq(uint8(fund.proposal(id).status), uint8(ReliefFund.Status.Overturned));
        assertTrue(fund.emergencyRevoked());

        vm.prank(c1);
        vm.expectRevert(ReliefFund.EmergencyPathRevoked.selector);
        fund.proposeCapChange(0, 2, 5000, 1500, true, bytes32(0));
        vm.expectRevert(ReliefFund.InvalidState.selector);
        fund.concludeReview(id);
    }

    function test_EmergencyUpheldWhenNotVetoed() public {
        (uint256 id, bytes32 voteKey) = _emergencyMove();
        voice.castVote(voteKey, _group(0), _proof(1001, 1, voice.scopeOf(voteKey), true));
        vm.warp(block.timestamp + 7 days);
        fund.concludeReview(id);
        ReliefFund.Proposal memory p = fund.proposal(id);
        assertEq(uint8(p.status), uint8(ReliefFund.Status.Executed));
        assertTrue(p.reviewConcluded);
        assertEq(fund.purpose(1).capBps, 4000);
        assertFalse(fund.emergencyRevoked());
    }

    function test_OnlyEmergencyChangesHaveAReview() public {
        (uint256 id,) = _queueCapChange();
        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        vm.expectRevert(ReliefFund.InvalidState.selector);
        fund.concludeReview(id);
    }

    // ---------------- deadline, extension and surplus ----------------

    function _extend(uint64 newDeadline) internal returns (uint256 id, bytes32 voteKey) {
        vm.prank(c1);
        id = fund.proposeExtension(newDeadline, keccak256("rebuilding takes longer: reasons"));
        vm.prank(c2);
        fund.approve(id);
        voteKey = fund.proposal(id).voteKey;
    }

    function test_ExtensionUnlocksSpendingAfterDeadline() public {
        uint64 oldDeadline = fund.deadline();
        uint64 newDeadline = oldDeadline + 180 days;
        (uint256 id,) = _extend(newDeadline);
        vm.warp(block.timestamp + 7 days);
        fund.execute(id); // nobody vetoed
        assertEq(fund.deadline(), newDeadline);

        vm.warp(oldDeadline + 1);
        vm.prank(c1);
        uint256 a = fund.proposeAllocation(0, ministry, 1000, 1, bytes32(0));
        vm.prank(c2);
        fund.approve(a);
        assertEq(uint8(fund.proposal(a).status), uint8(ReliefFund.Status.Executed));
    }

    function test_HouseholdsCanVetoExtension() public {
        uint64 oldDeadline = fund.deadline();
        (uint256 id, bytes32 voteKey) = _extend(oldDeadline + 180 days);
        uint256 scope = voice.scopeOf(voteKey);
        voice.castVote(voteKey, _group(0), _proof(1001, 0, scope, true));
        voice.castVote(voteKey, _group(1), _proof(1002, 0, scope, true));
        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        assertEq(uint8(fund.proposal(id).status), uint8(ReliefFund.Status.Vetoed));
        assertEq(fund.deadline(), oldDeadline);
    }

    function test_ExtensionNeverMovesDeadlineBack() public {
        uint64 d = fund.deadline();
        (uint256 longer,) = _extend(d + 180 days);
        (uint256 shorter,) = _extend(d + 90 days);
        vm.warp(block.timestamp + 7 days);
        fund.execute(longer);
        vm.expectRevert(ReliefFund.BadParams.selector);
        fund.execute(shorter);
        assertEq(fund.deadline(), d + 180 days);
    }

    function test_SurplusOnlyAfterDeadline() public {
        vm.prank(c1);
        vm.expectRevert(ReliefFund.FundStillOpen.selector);
        fund.proposeSurplus(county, 100_000, 50, bytes32(0));
    }

    function _proposeSurplus(uint256 amount) internal returns (uint256 id, bytes32 voteKey) {
        vm.warp(fund.deadline() + 1);
        vm.prank(c1);
        id = fund.proposeSurplus(county, amount, 50, keccak256("rebuild the village hall"));
        vm.prank(c2);
        fund.approve(id);
        ReliefFund.Proposal memory p = fund.proposal(id);
        assertEq(uint8(p.status), uint8(ReliefFund.Status.Queued), "surplus waits for the public period");
        assertEq(p.purposeId, SURPLUS);
        voteKey = p.voteKey;
    }

    function test_SurplusGoesOnlyToTheSurplusPurpose() public {
        (uint256 id,) = _proposeSurplus(500_000);
        // Other purposes are closed after the deadline.
        vm.prank(c1);
        vm.expectRevert(ReliefFund.FundExpired.selector);
        fund.proposeAllocation(0, county, 1, 1, bytes32(0));

        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        assertEq(twd.balanceOf(county), 500_000);
        assertEq(fund.purpose(SURPLUS).allocated, 500_000, "cap no longer limits the surplus purpose");
        CustodyLedger.Hop memory h = ledger.hop(fund.proposal(id).hopId);
        assertEq(h.purposeId, SURPLUS);
        assertEq(h.to, county);
    }

    function test_HouseholdsCanVetoSurplusUse() public {
        (uint256 id, bytes32 voteKey) = _proposeSurplus(500_000);
        uint256 scope = voice.scopeOf(voteKey);
        voice.castVote(voteKey, _group(0), _proof(1001, 0, scope, true));
        voice.castVote(voteKey, _group(1), _proof(1002, 0, scope, true));
        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        assertEq(uint8(fund.proposal(id).status), uint8(ReliefFund.Status.Vetoed));
        assertEq(fund.balance(), 1_000_000, "money stays in the fund");
    }

    function test_SurplusPurposeMustBeInCharter() public {
        ReliefFund.InitParams memory p = _params();
        p.surplusPurposeId = 4;
        vm.expectRevert(ReliefFund.BadParams.selector);
        factory.createFund(p);
    }

    function test_OnlyFactoryFundsCanOpenVotesOrRecordHops() public {
        vm.expectRevert(VoiceModule.OnlyFund.selector);
        voice.openVote(disasterId, 1 days, 1000, bytes32(0));
        vm.expectRevert(CustodyLedger.OnlyFund.selector);
        ledger.recordAllocation(0, 0, ministry, 1, 1, bytes32(0));
    }

    function test_TemplateCannotBeInitializedDirectly() public {
        ReliefFund impl = ReliefFund(factory.implementation());
        vm.expectRevert();
        impl.initialize(_params(), ICustodyLedger(address(ledger)), IVoiceModule(address(voice)));
    }
}
