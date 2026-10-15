// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Base} from "./Base.t.sol";
import {CustodyLedger} from "../src/CustodyLedger.sol";
import {AidPrograms} from "../src/AidPrograms.sol";
import {Hashes} from "@openzeppelin/contracts/utils/cryptography/Hashes.sol";

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

    function _twoLeafRoster(uint256 a, uint256 b) internal view returns (bytes32 root, bytes32 la, bytes32 lb) {
        la = ledger.leaf(alice, a);
        lb = ledger.leaf(bob, b);
        root = Hashes.commutativeKeccak256(la, lb);
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

        // County must acknowledge before it can report payments.
        vm.prank(county);
        vm.expectRevert(CustodyLedger.NotAcknowledged.selector);
        ledger.reconcile(countyHop, bytes32(uint256(1)), 1, 1, bytes32(0));

        vm.prank(county);
        ledger.acknowledge(countyHop);
        (bytes32 root,,) = _twoLeafRoster(200, 300);
        vm.prank(county);
        ledger.reconcile(countyHop, root, 500, 2, keccak256("roster batch 1"));

        CustodyLedger.Hop memory h = ledger.hop(countyHop);
        assertEq(h.parent, rootHop);
        assertEq(h.reconciled, 500);
        assertEq(h.reconciledHouseholds, 2);
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

    function _reconciled() internal returns (bytes32 la, bytes32 lb) {
        bytes32 root;
        (root, la, lb) = _twoLeafRoster(200_000, 50_000);
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        ledger.reconcile(rootHop, root, 250_000, 2, keccak256("roster"));
        vm.stopPrank();
    }

    function test_HouseholdVerifiesInclusionAndConfirms() public {
        (, bytes32 lb) = _reconciled();
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = lb;
        assertTrue(ledger.verifyInclusion(rootHop, 0, alice, 200_000, proof));
        assertFalse(ledger.verifyInclusion(rootHop, 0, alice, 999, proof));

        bytes memory sig = _sign(aliceKey, rootHop, 0, alice, 200_000, true);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, sig); // relayed by anyone
        assertEq(ledger.hop(rootHop).confirmed, 1);

        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, sig);
    }

    function test_HouseholdDisputesUndeliveredPayment() public {
        (bytes32 la,) = _reconciled();
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = la;
        bytes memory sig = _sign(bobKey, rootHop, 0, bob, 50_000, false);
        ledger.confirmLine(rootHop, 0, bob, 50_000, false, proof, sig);
        assertEq(ledger.hop(rootHop).disputed, 1);
    }

    function test_CustodianCannotForgeConfirmations() public {
        (, bytes32 lb) = _reconciled();
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = lb;
        (, uint256 ministryKey) = makeAddrAndKey("ministry");
        bytes memory forged = _sign(ministryKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, forged);
    }

    function test_ProxyConfirmationIsLabelled() public {
        (, bytes32 lb) = _reconciled();
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = lb;
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, sig);
        CustodyLedger.Hop memory h = ledger.hop(rootHop);
        assertEq(h.proxyConfirmed, 1);
        assertEq(h.confirmed, 0);
    }

    function test_CustodianCannotConfirmWithItsOwnReceiptKeys() public {
        // A custodian puts a key it controls into the roster and signs "received" with it.
        (address fake, uint256 fakeKey) = makeAddrAndKey("custodian-made receipt key");
        bytes32 lf = ledger.leaf(fake, 100_000);
        bytes32 la = ledger.leaf(alice, 200_000);
        bytes32 root = Hashes.commutativeKeccak256(lf, la);
        vm.startPrank(ministry);
        ledger.acknowledge(rootHop);
        ledger.reconcile(rootHop, root, 300_000, 2, keccak256("padded roster"));
        vm.stopPrank();

        bytes32[] memory proof = new bytes32[](1);
        proof[0] = la;
        bytes memory sig = _sign(fakeKey, rootHop, 0, fake, 100_000, true);
        vm.expectRevert(CustodyLedger.NotRegisteredHousehold.selector);
        ledger.confirmLine(rootHop, 0, fake, 100_000, true, proof, sig);
        assertEq(ledger.hop(rootHop).confirmed, 0);
    }

    function test_ProxyOnlySignsForItsOwnVillage() public {
        (bytes32 la,) = _reconciled();
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = la;
        // Bob is in village B; the social worker is designated for village A only.
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, bob, 50_000, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        ledger.confirmLine(rootHop, 0, bob, 50_000, true, proof, sig);
    }

    function test_HouseholdOverridesProxy() public {
        (, bytes32 lb) = _reconciled();
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = lb;
        // The proxy signs "received" first, before Alice can answer.
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true));
        assertEq(ledger.hop(rootHop).proxyConfirmed, 1);

        // Alice says she never got it: her own answer replaces the proxy's.
        ledger.confirmLine(rootHop, 0, alice, 200_000, false, proof, _sign(aliceKey, rootHop, 0, alice, 200_000, false));
        CustodyLedger.Hop memory h = ledger.hop(rootHop);
        assertEq(h.proxyConfirmed, 0);
        assertEq(h.disputed, 1);
        assertEq(ledger.lineState(keccak256(abi.encode(rootHop, uint256(0), alice))), ledger.DISPUTED());

        // Her answer is final: neither she nor the proxy can change it again.
        bytes memory again = _sign(aliceKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, again);
        bytes memory proxyAgain = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, proxyAgain);
    }

    function test_ProxyCannotOverrideHousehold() public {
        (, bytes32 lb) = _reconciled();
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = lb;
        ledger.confirmLine(rootHop, 0, alice, 200_000, false, proof, _sign(aliceKey, rootHop, 0, alice, 200_000, false));
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.AlreadyRecorded.selector);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, sig);
    }

    function test_RevokedProxyCannotSign() public {
        (, bytes32 lb) = _reconciled();
        vm.prank(office);
        registry.setProxy(disasterId, VILLAGE_A, socialWorker, false);
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = lb;
        bytes memory sig = _sign(socialWorkerKey, rootHop, 0, alice, 200_000, true);
        vm.expectRevert(CustodyLedger.BadSignature.selector);
        ledger.confirmLine(rootHop, 0, alice, 200_000, true, proof, sig);
    }

    function test_NotInRosterCannotConfirm() public {
        _reconciled();
        (address eve, uint256 eveKey) = makeAddrAndKey("eve");
        bytes32[] memory proof = new bytes32[](0);
        bytes memory sig = _sign(eveKey, rootHop, 0, eve, 1, false);
        vm.expectRevert(CustodyLedger.NotInRoster.selector);
        ledger.confirmLine(rootHop, 0, eve, 1, false, proof, sig);
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
