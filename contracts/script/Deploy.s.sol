// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {ISemaphoreVerifier} from "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import {Semaphore} from "@semaphore-protocol/contracts/Semaphore.sol";
import {SemaphoreVerifier} from "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol";
import {EligibilityRegistry} from "../src/EligibilityRegistry.sol";
import {KeptFactory} from "../src/KeptFactory.sol";
import {CustodyLedger} from "../src/CustodyLedger.sol";
import {VoiceModule} from "../src/VoiceModule.sol";
import {AidPrograms} from "../src/AidPrograms.sol";
import {MockTWD} from "../src/MockTWD.sol";
import {IEligibilityRegistry, IKeptFactory, ICustodyLedger, IVoiceModule} from "../src/interfaces/IKept.sol";

/// @notice Deploys the Kept protocol. Set SEMAPHORE_ADDRESS to reuse an existing Semaphore v4
/// deployment; otherwise a fresh Semaphore + verifier is deployed (local chains).
contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(pk);
        address semaphoreAddr = vm.envOr("SEMAPHORE_ADDRESS", address(0));
        uint256 merkleTreeDuration = vm.envOr("MERKLE_TREE_DURATION", uint256(30 days));

        vm.startBroadcast(pk);

        if (semaphoreAddr == address(0)) {
            SemaphoreVerifier verifier = new SemaphoreVerifier();
            semaphoreAddr = address(new Semaphore(ISemaphoreVerifier(address(verifier))));
        }

        MockTWD twd = new MockTWD();
        EligibilityRegistry registry = new EligibilityRegistry(ISemaphore(semaphoreAddr), merkleTreeDuration, owner);
        KeptFactory factory = new KeptFactory();
        CustodyLedger ledger = new CustodyLedger(IKeptFactory(address(factory)), owner);
        VoiceModule voice = new VoiceModule(IEligibilityRegistry(address(registry)), IKeptFactory(address(factory)));
        AidPrograms programs =
            new AidPrograms(IEligibilityRegistry(address(registry)), ICustodyLedger(address(ledger)));
        factory.setModules(ICustodyLedger(address(ledger)), IVoiceModule(address(voice)));
        ledger.setAidPrograms(address(programs));

        vm.stopBroadcast();

        string memory obj = "deployment";
        vm.serializeUint(obj, "chainId", block.chainid);
        vm.serializeUint(obj, "deployBlock", block.number);
        vm.serializeAddress(obj, "owner", owner);
        vm.serializeAddress(obj, "semaphore", semaphoreAddr);
        vm.serializeAddress(obj, "token", address(twd));
        vm.serializeAddress(obj, "registry", address(registry));
        vm.serializeAddress(obj, "factory", address(factory));
        vm.serializeAddress(obj, "ledger", address(ledger));
        vm.serializeAddress(obj, "voice", address(voice));
        string memory json = vm.serializeAddress(obj, "programs", address(programs));
        string memory path = string.concat(vm.projectRoot(), "/deployments/", vm.toString(block.chainid), ".json");
        vm.writeJson(json, path);
        console.log("Deployment written to", path);
    }
}
