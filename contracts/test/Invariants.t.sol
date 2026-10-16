// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Base} from "./Base.t.sol";
import {ReliefFund} from "../src/ReliefFund.sol";
import {CustodyLedger} from "../src/CustodyLedger.sol";
import {MockTWD} from "../src/MockTWD.sol";

/// @dev Drives the fund and the custody ledger through random sequences of donations, allocations,
/// acknowledgements, transfers between custodians, published payment batches and household answers.
contract Handler is Test {
    ReliefFund fund;
    CustodyLedger ledger;
    MockTWD twd;
    address donor;
    address c1;
    address c2;
    address[3] custodians;
    address[] public households; // registered receipt addresses
    uint256[] keys;
    uint256 nonce;

    // ghost bookkeeping, checked against the contracts
    mapping(uint256 hopId => uint256) public childrenTotal;
    mapping(uint256 hopId => uint256) public unregisteredLines;
    uint256 public rootTotal;
    // how many calls did real work (not an early return), to make sure the invariants are exercised
    mapping(bytes4 => uint256) public done;

    constructor(
        ReliefFund _fund,
        CustodyLedger _ledger,
        MockTWD _twd,
        address _donor,
        address _c1,
        address _c2,
        address[3] memory _custodians,
        address[] memory _households,
        uint256[] memory _keys
    ) {
        (fund, ledger, twd, donor, c1, c2, custodians) = (_fund, _ledger, _twd, _donor, _c1, _c2, _custodians);
        households = _households;
        keys = _keys;
    }

    function donate(uint256 amount) external {
        amount = bound(amount, 1, twd.FAUCET_LIMIT());
        twd.faucet(donor, amount);
        vm.startPrank(donor);
        twd.approve(address(fund), amount);
        fund.donate(amount, bytes32(0));
        vm.stopPrank();
        done[this.donate.selector]++;
    }

    function allocate(uint8 purpose, uint8 to, uint256 amount) external {
        purpose = uint8(bound(purpose, 0, 2));
        uint256 avail = fund.available(purpose);
        if (avail == 0) return;
        amount = bound(amount, 1, avail);
        vm.prank(c1);
        uint256 id = fund.proposeAllocation(purpose, custodians[to % 3], amount, 10, bytes32(0));
        vm.prank(c2);
        fund.approve(id);
        rootTotal += amount;
        done[this.allocate.selector]++;
    }

    function _pickHop(uint256 seed) internal view returns (uint256 hopId, CustodyLedger.Hop memory h) {
        uint256 count = ledger.hopCount();
        if (count == 0) return (0, h);
        hopId = bound(seed, 1, count);
        h = ledger.hop(hopId);
    }

    function acknowledge(uint256 seed) external {
        (uint256 hopId, CustodyLedger.Hop memory h) = _pickHop(seed);
        if (hopId == 0 || h.ackAt != 0) return;
        vm.prank(h.to);
        ledger.acknowledge(hopId);
        done[this.acknowledge.selector]++;
    }

    function _ackIfNeeded(uint256 hopId, CustodyLedger.Hop memory h) internal {
        if (h.ackAt != 0) return;
        vm.prank(h.to);
        ledger.acknowledge(hopId);
    }

    function forward(uint256 seed, uint8 to, uint256 amount) external {
        (uint256 hopId, CustodyLedger.Hop memory h) = _pickHop(seed);
        if (hopId == 0) return;
        _ackIfNeeded(hopId, h);
        uint256 rem = ledger.remaining(hopId);
        if (rem == 0) return;
        amount = bound(amount, 1, rem);
        vm.prank(h.to);
        ledger.forward(hopId, custodians[to % 3], amount, 5, bytes32(0));
        childrenTotal[hopId] += amount;
        done[this.forward.selector]++;
    }

    /// Publish a batch of up to 6 lines: some registered households, some made-up receipts.
    function reconcile(uint256 seed, uint8 mask, uint8 ghosts, uint256 amount) external {
        (uint256 hopId, CustodyLedger.Hop memory h) = _pickHop(seed);
        if (hopId == 0) return;
        _ackIfNeeded(hopId, h);
        ghosts = uint8(bound(ghosts, 0, 3));
        uint256 n;
        address[] memory receipts = new address[](households.length + ghosts);
        for (uint256 i = 0; i < households.length; i++) {
            if (mask & (1 << i) != 0) receipts[n++] = households[i];
        }
        for (uint256 i = 0; i < ghosts; i++) {
            receipts[n++] = address(uint160(uint256(keccak256(abi.encode("ghost", nonce++)))));
        }
        if (n == 0) return;
        uint256 rem = ledger.remaining(hopId);
        if (rem < n) return;
        amount = bound(amount, 1, rem / n);
        address[] memory lines = new address[](n);
        uint256[] memory amounts = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            (lines[i], amounts[i]) = (receipts[i], amount);
        }
        vm.prank(h.to);
        ledger.reconcile(hopId, lines, amounts, bytes32(0));
        unregisteredLines[hopId] += ghosts;
        done[this.reconcile.selector]++;
    }

    function answer(uint256 seed, uint256 batchSeed, uint8 who, bool received) external {
        uint256 count = ledger.hopCount();
        if (count == 0) return;
        uint256 hopId = bound(seed, 1, count);
        for (uint256 k = 0; k < count && ledger.batchCount(hopId) == 0; k++) {
            hopId = hopId % count + 1;
        }
        uint256 batches = ledger.batchCount(hopId);
        if (batches == 0) return;
        uint256 b = bound(batchSeed, 0, batches - 1);
        uint256 i = who % households.length;
        address receipt = households[i];
        uint256 amount = ledger.lineAmount(hopId, b, receipt);
        if (amount == 0) return;
        if (ledger.lineState(keccak256(abi.encode(hopId, b, receipt))) != 0) return;
        bytes32 structHash = keccak256(abi.encode(ledger.RECEIPT_TYPEHASH(), hopId, b, receipt, amount, received));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", ledger.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(keys[i], digest);
        ledger.confirmLine(hopId, b, receipt, received, abi.encodePacked(r, s, v));
        done[this.answer.selector]++;
    }
}

contract InvariantsTest is Base {
    Handler handler;

    function setUp() public override {
        super.setUp();
        address[] memory hs = new address[](3);
        uint256[] memory ks = new uint256[](3);
        for (uint256 i = 0; i < 3; i++) {
            (hs[i], ks[i]) = makeAddrAndKey(string(abi.encode("household", i)));
            _register(chiefA, office, 0, VILLAGE_A, 900 + i, hs[i]);
        }
        handler = new Handler(fund, ledger, twd, donor, c1, c2, [ministry, county, ngo], hs, ks);
        targetContract(address(handler));
    }

    /// Every token the fund received is either still in it or was allocated (and transferred) out.
    function invariant_FundConservesMoney() public view {
        assertEq(twd.balanceOf(address(fund)), fund.totalRaised() - fund.totalAllocated());
    }

    /// No purpose ever exceeds its cap, and the purposes add up to the total allocated.
    function invariant_AllocationsWithinCharter() public view {
        uint256 sum;
        for (uint8 p = 0; p < fund.purposeCount(); p++) {
            ReliefFund.Purpose memory pu = fund.purpose(p);
            assertLe(pu.allocated * 10_000, fund.totalRaised() * pu.capBps, "purpose over its cap");
            sum += pu.allocated;
        }
        assertEq(sum, fund.totalAllocated());
        assertLe(fund.totalAllocated(), fund.totalRaised());
    }

    /// The custody tree accounts for every unit: allocations open root tranches, a tranche never passes
    /// on or reports paid more than it received, and children add up to what was forwarded.
    function invariant_CustodyTreeBalances() public view {
        uint256 roots;
        for (uint256 id = 1; id <= ledger.hopCount(); id++) {
            CustodyLedger.Hop memory h = ledger.hop(id);
            if (h.parent == 0) roots += h.amount;
            assertLe(h.forwarded + h.reconciled, h.amount, "tranche overspent");
            assertEq(h.forwarded, handler.childrenTotal(id), "children do not add up");
        }
        assertEq(roots, fund.totalAllocated());
        assertEq(roots, handler.rootTotal());
    }

    /// Published batches: totals are the sum of their lines, every made-up receipt is counted, and
    /// households never answer more lines than were published.
    function invariant_PublishedLinesAddUp() public view {
        for (uint256 id = 1; id <= ledger.hopCount(); id++) {
            CustodyLedger.Hop memory h = ledger.hop(id);
            uint256 total;
            uint256 lines;
            for (uint256 b = 0; b < ledger.batchCount(id); b++) {
                CustodyLedger.Batch memory batch = ledger.batch(id, b);
                (address[] memory receipts, uint256[] memory amounts) = ledger.batchLines(id, b);
                uint256 sum;
                for (uint256 i = 0; i < amounts.length; i++) {
                    sum += amounts[i];
                }
                assertEq(batch.amount, sum, "batch total is not the sum of its lines");
                assertEq(batch.households, receipts.length);
                total += sum;
                lines += receipts.length;
            }
            assertEq(h.reconciled - _programAmount(h), total);
            assertEq(h.reconciledHouseholds - h.programDelivered, lines);
            assertEq(h.unregistered, handler.unregisteredLines(id), "made-up receipts not all counted");
            assertLe(uint256(h.confirmed) + h.proxyConfirmed + h.disputed, lines, "more answers than lines");
        }
    }

    /// Not an invariant: shows how much real work the random sequences did (run with -vv).
    function afterInvariant() public view {
        console.log("allocations", handler.done(Handler.allocate.selector), "forwards", handler.done(Handler.forward.selector));
        console.log("batches", handler.done(Handler.reconcile.selector), "answers", handler.done(Handler.answer.selector));
    }

    function _programAmount(CustodyLedger.Hop memory) internal pure returns (uint256) {
        return 0; // the handler does not run NGO programmes
    }
}
