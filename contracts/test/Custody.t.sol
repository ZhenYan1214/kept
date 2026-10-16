// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Base} from "./Base.t.sol";
import {CustodyLedger} from "../src/CustodyLedger.sol";
import {AidPrograms} from "../src/AidPrograms.sol";

contract CustodyTest is Base {
    uint256 rootHop;
    address alice;
    uint256 aliceKey;
    address bob;
    uint256 bobKey;
    address socialWorker;
    uint256 socialWorkerKey;

    function setUp() public override {
        super.setUp();
        (alice, aliceKey) = makeAddrAndKey("alice receipt key");
        (bob, bobKey) = makeAddrAndKey("bob receipt key");
        (socialWorker, socialWorkerKey) = makeAddrAndKey("social worker");
        // Alice lives in village A, Bob in village B. The social worker may sign for village A only.
        _register(chiefA, office, 0, VILLAGE_A, 501, alice);
        _register(chiefB, office, 1, VILLAGE_B, 502, bob);
        vm.prank(office);
        registry.setProxy(disasterId, VILLAGE_A, socialWorker, true);

        _donate(1_000_000);
        vm.prank(c1);
        uint256 id = fund.proposeAllocation(1, ministry, 300_000, 1500, keccak256("pre-allocation"));
        vm.prank(c2);
        fund.approve(id);
        rootHop = fund.proposal(id).hopId;
    }

    function _lines(address a, uint256 amountA, address b, uint256 amountB)
        internal
        pure
        returns (address[] memory receipts, uint256[] memory amounts)
    {
        receipts = new address[](2);
        amounts = new uint256[](2);
        (receipts[0], amounts[0], receipts[1], amounts[1]) = (a, amountA, b, amountB);
    }

    function _sign(uint256 key, uint256 hopId, uint256 batchIndex, address receipt, uint256 amount, bool received)
        internal
        view
        returns (bytes memory)
    {
        bytes32 structHash =
            keccak256(abi.encode(ledger.RECEIPT_TYPEHASH(), hopId, batchIndex, receipt, amount, received));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", ledger.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);
        return abi.encodePacked(r, s, v);
    }

    function test_ChainOfCustody() public {
        // Ministry acknowledges, forwards part to the county.
        vm.prank(ministry);
        ledger.acknowledge(rootHop);
        vm.prank(ministry);
        uint256 countyHop = ledger.forward(rootHop, county, 100_000, 400, keccak256("bank slip"));
        assertEq(ledger.remaining(rootHop), 200_000);

        (address[] memory receipts, uint256[] memory amounts) = _lines(alice, 200, bob, 300);
        // County must acknowledge before it can report payments.
        vm.prank(county);
        vm.expectRevert(CustodyLedger.NotAcknowledged.selector);
        ledger.reconcile(countyHop, receipts, amounts, bytes32(0));

        vm.prank(county);
        ledger.acknowledge(countyHop);
        vm.prank(county);
        ledger.reconcile(countyHop, receipts, amounts, keccak256("roster batch 1"));

        CustodyLedger.Hop memory h = ledger.hop(countyHop);
        assertEq(h.parent, rootHop);
        assertEq(h.reconciled, 500, "total computed from the lines");
        assertEq(h.reconciledHouseholds, 2);
        assertEq(h.unregistered, 0);
    }

    function test_CannotForwardMoreThanHeld() public {
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        vm.expectRevert(abi.encodeWithSelector(CustodyLedger.ExceedsRemaining.selector, uint256(300_000)));
        ledger.forward(rootHop, county, 300_001, 1, bytes32(0));
        vm.stopPrank();
    }

    function test_OnlyHolderCanForward() public {
        vm.prank(ministry);
        ledger.acknowledge(rootHop);
        vm.prank(county);
        vm.expectRevert(CustodyLedger.OnlyRecipient.selector);
        ledger.forward(rootHop, county, 1, 1, bytes32(0));
    }

    function _reconciled() internal {
        (address[] memory receipts, uint256[] memory amounts) = _lines(alice, 200_000, bob, 50_000);
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        ledger.reconcile(rootHop, receipts, amounts, keccak256("roster"));
        vm.stopPrank();
    }

    // ---------------- published lines ----------------

    function test_LinesArePublicAndTotalsComputed() public {
        _reconciled();
        (address[] memory receipts, uint256[] memory amounts) = ledger.batchLines(rootHop, 0);
        assertEq(receipts.length, 2);
        assertEq(receipts[0], alice);
        assertEq(amounts[1], 50_000);
        assertEq(ledger.lineAmount(rootHop, 0, alice), 200_000, "a household finds its own line without asking anyone");
        assertEq(ledger.lineAmount(rootHop, 0, makeAddr("nobody")), 0);
        CustodyLedger.Batch memory b = ledger.batch(rootHop, 0);
        assertEq(b.amount, 250_000);
        assertEq(b.households, 2);
    }

    function test_RosterRulesAreChecked() public {
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        (address[] memory receipts, uint256[] memory amounts) = _lines(alice, 200_000, alice, 1);
        vm.expectRevert(abi.encodeWithSelector(CustodyLedger.DuplicateLine.selector, alice));
        ledger.reconcile(rootHop, receipts, amounts, bytes32(0));

        (receipts, amounts) = _lines(alice, 200_000, bob, 0);
        vm.expectRevert(CustodyLedger.BadRoster.selector);
        ledger.reconcile(rootHop, receipts, amounts, bytes32(0));

        (receipts, amounts) = _lines(alice, 200_000, bob, 100_001); // 300,001 > 300,000 held
        vm.expectRevert(abi.encodeWithSelector(CustodyLedger.ExceedsRemaining.selector, uint256(300_000)));
        ledger.reconcile(rootHop, receipts, amounts, bytes32(0));
        vm.stopPrank();
    }

    function test_UnregisteredLinesArePubliclyCounted() public {
        // A custodian pads the roster with a receipt key that is not a registered household.
        address ghost = makeAddr("ghost receipt key");
        (address[] memory receipts, uint256[] memory amounts) = _lines(alice, 200_000, ghost, 100_000);
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        ledger.reconcile(rootHop, receipts, amounts, keccak256("padded roster"));
        vm.stopPrank();
        assertEq(ledger.batch(rootHop, 0).unregistered, 1);
        assertEq(ledger.hop(rootHop).unregistered, 1);
    }

    function test_HouseholdConfirmsItsOwnLine() public {
        _reconciled();
        bytes memory sig = _sign(aliceKey, rootHop, 0, alice, 200_000, true);
        ledger.confirmLine(rootHop, 0, alice, true, sig); // relayed by anyone
        assertEq(ledger.hop(rootHop).confirmed, 1);

        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, true, sig);
    }

    function test_SignatureCoversTheRecordedAmount() public {
        _reconciled();
        // Alice signs for an amount different from the line: it does not verify.
        bytes memory sig = _sign(aliceKey, rootHop, 0, alice, 999, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        ledger.confirmLine(rootHop, 0, alice, true, sig);
    }

    function test_HouseholdDisputesUndeliveredPayment() public {
        _reconciled();
        bytes memory sig = _sign(bobKey, rootHop, 0, bob, 50_000, false);
        ledger.confirmLine(rootHop, 0, bob, false, sig);
        assertEq(ledger.hop(rootHop).disputed, 1);
    }

    function test_CustodianCannotForgeConfirmations() public {
        _reconciled();
        (, uint256 ministryKey) = makeAddrAndKey("ministry");
        bytes memory forged = _sign(ministryKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        ledger.confirmLine(rootHop, 0, alice, true, forged);
    }

    function test_ProxyConfirmationIsLabelled() public {
        _reconciled();
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        ledger.confirmLine(rootHop, 0, alice, true, sig);
        CustodyLedger.Hop memory h = ledger.hop(rootHop);
        assertEq(h.proxyConfirmed, 1);
        assertEq(h.confirmed, 0);
    }

    function test_CustodianCannotConfirmWithItsOwnReceiptKeys() public {
        // A custodian puts a key it controls into the roster and signs "received" with it.
        (address fake, uint256 fakeKey) = makeAddrAndKey("custodian-made receipt key");
        (address[] memory receipts, uint256[] memory amounts) = _lines(fake, 100_000, alice, 200_000);
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        ledger.reconcile(rootHop, receipts, amounts, keccak256("padded roster"));
        vm.stopPrank();

        bytes memory sig = _sign(fakeKey, rootHop, 0, fake, 100_000, true);
        vm.expectRevert(CustodyLedger.NotRegisteredHousehold.selector);
        ledger.confirmLine(rootHop, 0, fake, true, sig);
        assertEq(ledger.hop(rootHop).confirmed, 0);
    }

    function test_ProxyOnlySignsForItsOwnVillage() public {
        _reconciled();
        // Bob is in village B; the social worker is designated for village A only.
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, bob, 50_000, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        ledger.confirmLine(rootHop, 0, bob, true, sig);
    }

    function test_HouseholdOverridesProxy() public {
        _reconciled();
        // The proxy signs "received" first, before Alice can answer.
        ledger.confirmLine(rootHop, 0, alice, true, _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true));
        assertEq(ledger.hop(rootHop).proxyConfirmed, 1);

        // Alice says she never got it: her own answer replaces the proxy's.
        ledger.confirmLine(rootHop, 0, alice, false, _sign(aliceKey, rootHop, 0, alice, 200_000, false));
        CustodyLedger.Hop memory h = ledger.hop(rootHop);
        assertEq(h.proxyConfirmed, 0);
        assertEq(h.disputed, 1);
        assertEq(ledger.lineState(keccak256(abi.encode(rootHop, uint256(0), alice))), ledger.DISPUTED());

        // Her answer is final: neither she nor the proxy can change it again.
        bytes memory again = _sign(aliceKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, true, again);
        bytes memory proxyAgain = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, true, proxyAgain);
    }

    function test_ProxyCannotOverrideHousehold() public {
        _reconciled();
        ledger.confirmLine(rootHop, 0, alice, false, _sign(aliceKey, rootHop, 0, alice, 200_000, false));
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, true, sig);
    }

    function test_RevokedProxyCannotSign() public {
        _reconciled();
        vm.prank(office);
        registry.setProxy(disasterId, VILLAGE_A, socialWorker, false);
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        ledger.confirmLine(rootHop, 0, alice, true, sig);
    }

    // ---------------- sample audits ----------------

    function test_AuditSampleSize() public view {
        assertEq(ledger.auditSampleSize(1), 1);
        assertEq(ledger.auditSampleSize(5), 5);
        assertEq(ledger.auditSampleSize(12), 5);
        assertEq(ledger.auditSampleSize(100), 20);
        assertEq(ledger.auditSampleSize(500), 59, "capped: 59 confirmed lines bound the undelivered share below 5%");
    }

    function _publishLines(uint256 count) internal returns (address[] memory receipts) {
        receipts = new address[](count);
        uint256[] memory amounts = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            receipts[i] = address(uint160(0x1000 + i));
            amounts[i] = 1_000;
        }
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        ledger.reconcile(rootHop, receipts, amounts, keccak256("roster"));
        vm.stopPrank();
    }

    function test_AuditIsDrawnFromAFixedLaterBlock() public {
        address[] memory lines = _publishLines(12);
        uint256 published = vm.getBlockNumber(); // (block.number is cached under via_ir)
        // The seed block is fixed at publication: nobody can draw before it exists.
        vm.expectRevert(CustodyLedger.AuditTooEarly.selector);
        ledger.drawAudit(rootHop, 0);
        vm.roll(published + ledger.AUDIT_DELAY());
        vm.expectRevert(CustodyLedger.AuditTooEarly.selector);
        ledger.drawAudit(rootHop, 0);

        vm.roll(published + ledger.AUDIT_DELAY() + 1);
        address[] memory picks = ledger.drawAudit(rootHop, 0); // anyone can draw
        assertEq(picks.length, 5);
        for (uint256 i = 0; i < picks.length; i++) {
            assertGt(ledger.lineAmount(rootHop, 0, picks[i]), 0, "every pick is a published line");
            for (uint256 j = 0; j < i; j++) {
                assertTrue(picks[i] != picks[j], "no line is picked twice");
            }
        }
        assertEq(ledger.auditPicks(rootHop, 0).length, 5);
        assertEq(ledger.auditSeedBlockUsed(rootHop, 0), published + ledger.AUDIT_DELAY());
        assertEq(lines.length, 12);

        vm.expectRevert(CustodyLedger.AuditAlreadyDrawn.selector);
        ledger.drawAudit(rootHop, 0);
    }

    function test_LateDrawUsesTheSameGridAndIsVisible() public {
        _publishLines(12);
        uint256 first = vm.getBlockNumber() + ledger.AUDIT_DELAY();
        vm.roll(first + 300); // too late for the first seed block's hash
        assertEq(ledger.auditSeedBlock(rootHop, 0), first + 256);
        vm.roll(first + 256); // still in the first window: the original seed block
        assertEq(ledger.auditSeedBlock(rootHop, 0), first);
    }

    function _signVisit(uint256 key, uint256 batchIndex, address receipt, uint256 amount, bool received, address auditor)
        internal
        view
        returns (bytes memory)
    {
        bytes32 structHash = keccak256(
            abi.encode(ledger.AUDIT_VISIT_TYPEHASH(), rootHop, batchIndex, receipt, amount, received, auditor)
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", ledger.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(key, digest);
        return abi.encodePacked(r, s_, v);
    }

    function test_AuditVisitsNeedAnAuditorAndTheHouseholdsOwnSignature() public {
        address auditor = makeAddr("auditor");
        vm.prank(ledger.owner());
        ledger.setAuditor(auditor, true);
        (address ghost,) = makeAddrAndKey("ghost receipt key");
        // Alice and Bob are real households; the third line is a made-up receipt.
        address[] memory receipts = new address[](3);
        uint256[] memory amounts = new uint256[](3);
        (receipts[0], receipts[1], receipts[2]) = (alice, bob, ghost);
        (amounts[0], amounts[1], amounts[2]) = (200_000, 50_000, 50_000);
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        ledger.reconcile(rootHop, receipts, amounts, keccak256("roster"));
        vm.stopPrank();

        vm.expectRevert(CustodyLedger.NotSampled.selector);
        vm.prank(auditor);
        ledger.recordAuditVisit(rootHop, 0, alice, 3, "");

        vm.roll(block.number + ledger.AUDIT_DELAY() + 1);
        ledger.drawAudit(rootHop, 0); // 3 lines: all are sampled

        bytes memory aliceSays = _signVisit(aliceKey, 0, alice, 200_000, true, auditor);
        vm.expectRevert(CustodyLedger.NotAuditor.selector);
        ledger.recordAuditVisit(rootHop, 0, alice, 1, aliceSays);

        // A remote confirmation signature cannot be reused as an audit visit.
        bytes memory remote = _sign(aliceKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        vm.prank(auditor);
        ledger.recordAuditVisit(rootHop, 0, alice, 1, remote);
        // Nor can the auditor claim an answer the household did not give.
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        vm.prank(auditor);
        ledger.recordAuditVisit(rootHop, 0, alice, 2, aliceSays);

        vm.startPrank(auditor);
        vm.expectRevert(CustodyLedger.BadOutcome.selector);
        ledger.recordAuditVisit(rootHop, 0, alice, 4, "");
        ledger.recordAuditVisit(rootHop, 0, alice, 1, aliceSays);
        ledger.recordAuditVisit(rootHop, 0, bob, 2, _signVisit(bobKey, 0, bob, 50_000, false, auditor));
        ledger.recordAuditVisit(rootHop, 0, ghost, 3, ""); // nobody at the address: the auditor's own word
        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.recordAuditVisit(rootHop, 0, ghost, 3, "");
        vm.stopPrank();

        assertEq(ledger.auditOutcome(keccak256(abi.encode(rootHop, 0, alice))), 1);
        assertEq(ledger.auditOutcome(keccak256(abi.encode(rootHop, 0, bob))), 2);
        assertEq(ledger.auditOutcome(keccak256(abi.encode(rootHop, 0, ghost))), 3);
        assertEq(ledger.auditedBy(keccak256(abi.encode(rootHop, 0, ghost))), auditor);
    }

    function test_AuditNeedsAPublishedBatch() public {
        vm.prank(ministry);
        ledger.acknowledge(rootHop);
        vm.expectRevert(CustodyLedger.UnknownBatch.selector);
        ledger.drawAudit(rootHop, 0);
    }

    function test_NotInRosterCannotConfirm() public {
        _reconciled();
        (address eve, uint256 eveKey) = makeAddrAndKey("eve");
        bytes memory sig = _sign(eveKey, rootHop, 0, eve, 1, false);
        vm.expectRevert(CustodyLedger.NotInRoster.selector);
        ledger.confirmLine(rootHop, 0, eve, false, sig);
    }

    // ---------------- NGO "show your QR" programmes ----------------

    function _ngoHop() internal returns (uint256 ngoHop) {
        vm.prank(c1);
        uint256 id = fund.proposeAllocation(0, ngo, 50_000, 10, keccak256("ngo grant"));
        vm.prank(c2);
        fund.approve(id);
        ngoHop = fund.proposal(id).hopId;
        vm.prank(ngo);
        ledger.acknowledge(ngoHop);
    }

    function test_NgoProgrammeClaimsAreDeliveries() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        uint256 ngoHop = _ngoHop();
        vm.prank(ngo);
        uint256 pid = programs.createProgram(ngoHop, disasterId, 3, 10_000, "Household essentials");
        uint256 scope = programs.scopeOf(pid);
        uint256 g0 = _group(0);

        vm.prank(ngo);
        programs.claim(pid, g0, _proof(77, 0, scope, true));
        CustodyLedger.Hop memory h = ledger.hop(ngoHop);
        assertEq(h.programDelivered, 1);
        assertEq(h.reconciled, 10_000);

        vm.prank(ngo);
        vm.expectRevert(AidPrograms.AlreadyClaimed.selector);
        programs.claim(pid, g0, _proof(77, 0, scope, true));
    }

    function test_ProgrammeRules() public {
        _register(chiefA, office, 2, VILLAGE_A, 111);
        uint256 ngoHop = _ngoHop();
        vm.prank(ngo);
        uint256 pid = programs.createProgram(ngoHop, disasterId, 3, 10_000, "Tier 0-1 only");
        uint256 scope = programs.scopeOf(pid);
        uint256 g0 = _group(0);
        uint256 g2 = _group(2);

        vm.prank(ngo);
        vm.expectRevert(AidPrograms.TierNotEligible.selector);
        programs.claim(pid, g2, _proof(1, 0, scope, true));

        vm.prank(donor);
        vm.expectRevert(AidPrograms.OnlyNgo.selector);
        programs.claim(pid, g0, _proof(1, 0, scope, true));

        vm.prank(ngo);
        vm.expectRevert(AidPrograms.WrongScope.selector);
        programs.claim(pid, g0, _proof(1, 0, scope + 1, true));

        vm.prank(county);
        vm.expectRevert(AidPrograms.NotHopRecipient.selector);
        programs.createProgram(ngoHop, disasterId, 1, 1, "not mine");
    }

    function test_SelfFundedProgrammeNeedsNoHop() public {
        _register(chiefA, office, 0, VILLAGE_A, 111);
        vm.prank(ngo);
        uint256 pid = programs.createProgram(0, disasterId, 1, 0, "Hot meals");
        uint256 g0 = _group(0);
        uint256 scope = programs.scopeOf(pid);
        vm.prank(ngo);
        programs.claim(pid, g0, _proof(5, 0, scope, true));
        assertEq(programs.program(pid).claims, 1);
    }
}
