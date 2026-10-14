// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {ReliefFund} from "./ReliefFund.sol";
import {ICustodyLedger, IVoiceModule} from "./interfaces/IKept.sol";

/// @title KeptFactory
/// @notice Every Kept fund is a clone of one audited template. The ledger, the vote module and the
/// public dashboard only recognise funds created here, so a custodian cannot quietly deploy a
/// look-alike contract without the commitments.
contract KeptFactory {
    address public immutable implementation;
    address public immutable deployer;
    ICustodyLedger public ledger;
    IVoiceModule public voice;

    address[] public funds;
    mapping(address => bool) public isFund;

    event ModulesSet(address ledger, address voice);
    event FundCreated(address indexed fund, address indexed custodian, uint256 indexed disasterId, string name);

    error AlreadySet();
    error NotDeployer();
    error ModulesNotSet();

    constructor() {
        implementation = address(new ReliefFund());
        deployer = msg.sender;
    }

    /// @notice One-time wiring (the ledger and vote module need the factory address first).
    function setModules(ICustodyLedger _ledger, IVoiceModule _voice) external {
        if (msg.sender != deployer) revert NotDeployer();
        if (address(ledger) != address(0)) revert AlreadySet();
        ledger = _ledger;
        voice = _voice;
        emit ModulesSet(address(_ledger), address(_voice));
    }

    function createFund(ReliefFund.InitParams calldata p) external returns (address fund) {
        if (address(ledger) == address(0)) revert ModulesNotSet();
        fund = Clones.clone(implementation);
        isFund[fund] = true;
        funds.push(fund);
        ReliefFund(fund).initialize(p, ledger, voice);
        emit FundCreated(fund, p.custodian, p.disasterId, p.name);
    }

    function fundCount() external view returns (uint256) {
        return funds.length;
    }

    function allFunds() external view returns (address[] memory) {
        return funds;
    }
}
