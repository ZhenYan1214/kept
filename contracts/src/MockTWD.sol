// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockTWD
/// @notice TESTNET ONLY. A stand-in for a regulated NTD stablecoin, which Taiwan's Virtual Asset
/// Service Act (passed 2026-06-30) will license once its sub-regulations take effect.
/// Zero decimals: 1 unit = NT$1. Anyone can mint from the faucet for demos.
contract MockTWD is ERC20 {
    uint256 public constant FAUCET_LIMIT = 10_000_000;

    constructor() ERC20("Mock New Taiwan Dollar (testnet)", "mTWD") {}

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function faucet(address to, uint256 amount) external {
        require(amount <= FAUCET_LIMIT, "faucet limit");
        _mint(to, amount);
    }
}
