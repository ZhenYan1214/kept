// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {MockSemaphore} from "./mocks/MockSemaphore.sol";
import {EligibilityRegistry} from "../src/EligibilityRegistry.sol";
import {KeptFactory} from "../src/KeptFactory.sol";
import {CustodyLedger} from "../src/CustodyLedger.sol";
import {VoiceModule} from "../src/VoiceModule.sol";
import {AidPrograms} from "../src/AidPrograms.sol";
import {ReliefFund} from "../src/ReliefFund.sol";
import {MockTWD} from "../src/MockTWD.sol";
import {IEligibilityRegistry, IKeptFactory, ICustodyLedger, IVoiceModule} from "../src/interfaces/IKept.sol";

abstract contract Base is Test {
    uint32 constant TOWNSHIP = 1001; // 光復鄉 (simulated)
    uint32 constant VILLAGE_A = 100101; // 大同村 (simulated)
    uint32 constant VILLAGE_B = 100102; // 南富村 (simulated)
    uint32 constant OTHER_TOWNSHIP = 2002;
    uint32 constant VILLAGE_X = 200201;
    uint8 constant SURPLUS = 3; // charter purpose that receives the surplus

    MockSemaphore sem;
    EligibilityRegistry registry;
    KeptFactory factory;
    CustodyLedger ledger;
    VoiceModule voice;
    AidPrograms programs;
    MockTWD twd;
    ReliefFund fund;
    uint256 disasterId;

    address authority = makeAddr("authority"); // e.g. MOHW
    address office = makeAddr("township office"); // 公所
    address chiefA = makeAddr("chief A");
    address chiefB = makeAddr("chief B");
    address otherOffice = makeAddr("other office");
    address custodian = makeAddr("foundation"); // 賑災基金會
    address c1 = makeAddr("committee 1");
    address c2 = makeAddr("committee 2");
    address c3 = makeAddr("committee 3");
    address ministry = makeAddr("ministry"); // 衛福部
    address county = makeAddr("county"); // 縣府
    address ngo = makeAddr("ngo");
    address donor = makeAddr("donor");

    function setUp() public virtual {
        sem = new MockSemaphore();
        registry = new EligibilityRegistry(ISemaphore(address(sem)), 30 days, authority);
        factory = new KeptFactory();
        ledger = new CustodyLedger(IKeptFactory(address(factory)), IEligibilityRegistry(address(registry)), authority);
        voice = new VoiceModule(IEligibilityRegistry(address(registry)), IKeptFactory(address(factory)));
        programs = new AidPrograms(IEligibilityRegistry(address(registry)), ICustodyLedger(address(ledger)));
        factory.setModules(ICustodyLedger(address(ledger)), IVoiceModule(address(voice)));
        twd = new MockTWD();

        vm.startPrank(authority);
        ledger.setAidPrograms(address(programs));
        registry.setVillage(VILLAGE_A, TOWNSHIP);
        registry.setVillage(VILLAGE_B, TOWNSHIP);
        registry.setVillage(VILLAGE_X, OTHER_TOWNSHIP);
        registry.setIssuer(office, EligibilityRegistry.Role.TownshipOffice, TOWNSHIP, true, "Township office");
        registry.setIssuer(chiefA, EligibilityRegistry.Role.VillageChief, VILLAGE_A, true, "Chief A");
        registry.setIssuer(chiefB, EligibilityRegistry.Role.VillageChief, VILLAGE_B, true, "Chief B");
        registry.setIssuer(otherOffice, EligibilityRegistry.Role.TownshipOffice, OTHER_TOWNSHIP, true, "Other");
        string[] memory tiers = new string[](3);
        tiers[0] = "Destroyed";
        tiers[1] = "Severely damaged";
        tiers[2] = "Flooded";
        disasterId = registry.createDisaster("Guangfu barrier lake 2025 (simulated)", tiers);
        vm.stopPrank();

        fund = ReliefFund(factory.createFund(_params()));
    }

    function _params() internal view returns (ReliefFund.InitParams memory p) {
        address[] memory committee = new address[](3);
        committee[0] = c1;
        committee[1] = c2;
        committee[2] = c3;
        string[] memory names = new string[](4);
        names[0] = "Livelihood relief";
        names[1] = "Housing repair";
        names[2] = "Community & mental-health recovery";
        names[3] = "Long-term recovery of the affected villages";
        uint16[] memory caps = new uint16[](4);
        caps[0] = 6000;
        caps[1] = 3000;
        caps[2] = 1000;
        caps[3] = 0; // only receives the surplus after the deadline
        p = ReliefFund.InitParams({
            name: "Guangfu Relief Fund (simulated)",
            surplusRule: "After the deadline, unspent money may only fund long-term recovery of the affected villages.",
            surplusPurposeId: SURPLUS,
            custodian: custodian,
            token: twd,
            disasterId: disasterId,
            deadline: uint64(block.timestamp + 365 days),
            threshold: 2,
            emergencyThreshold: 3,
            timelock: 7 days,
            quorumBps: 1000, // 10% turnout needed for a veto
            committee: committee,
            purposeNames: names,
            purposeCaps: caps
        });
    }

    function _register(address proposer, address approver, uint8 tier, uint32 village, uint256 commitment) internal {
        _register(proposer, approver, tier, village, commitment, _receiptOf(commitment));
    }

    function _register(
        address proposer,
        address approver,
        uint8 tier,
        uint32 village,
        uint256 commitment,
        address receipt
    ) internal {
        bytes32 tag = keccak256(abi.encode(commitment));
        vm.prank(proposer);
        uint256 id = registry.proposeRegistration(disasterId, tier, village, commitment, tag, receipt);
        vm.prank(approver);
        registry.approveRegistration(id);
    }

    function _receiptOf(uint256 commitment) internal pure returns (address) {
        return address(uint160(uint256(keccak256(abi.encode("receipt", commitment)))));
    }

    function _donate(uint256 amount) internal {
        twd.faucet(donor, amount);
        vm.startPrank(donor);
        twd.approve(address(fund), amount);
        fund.donate(amount, bytes32(0));
        vm.stopPrank();
    }

    function _proof(uint256 nullifier, uint256 message, uint256 scope, bool valid)
        internal
        pure
        returns (ISemaphore.SemaphoreProof memory p)
    {
        p.merkleTreeDepth = 10;
        p.merkleTreeRoot = 1;
        p.nullifier = nullifier;
        p.message = message;
        p.scope = scope;
        p.points[0] = valid ? 1 : 0;
    }

    function _group(uint8 tier) internal view returns (uint256) {
        return registry.tierGroup(disasterId, tier);
    }
}
