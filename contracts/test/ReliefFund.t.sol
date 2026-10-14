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
        vm.warp(fund.deadline() + 1);
        vm.prank(c1);
        uint256 id = fund.proposeAllocation(0, ministry, 1000, 1, bytes32(0));
        vm.prank(c2);
        vm.expectRevert(ReliefFund.FundExpired.selector);
        fund.approve(id);
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
        assertTrue(p.voteKey != bytes32(0), "retroactive household review opened");
    }

    function test_ExtensionUnlocksSpendingAfterDeadline() public {
        uint64 newDeadline = fund.deadline() + 180 days;
        vm.prank(c1);
        uint256 id = fund.proposeExtension(newDeadline, keccak256("rebuilding takes longer: reasons"));
        vm.prank(c2);
        fund.approve(id);
        vm.warp(block.timestamp + 7 days);
        fund.execute(id);
        assertEq(fund.deadline(), newDeadline);
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
