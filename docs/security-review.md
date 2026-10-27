# Security review: automated checks

What has been checked automatically, what the tools reported, and what we did about each finding. This is not an external audit; it is what a reviewer can reproduce in a few minutes.

## 1. Invariant tests (Foundry)

`contracts/test/Invariants.t.sol` drives the fund and the custody ledger through random sequences of donations, allocations, acknowledgements, transfers between custodians, published payment batches (with registered households and made-up receipts) and households' signed answers. After every call, four properties must hold:

| Invariant | What it means |
|---|---|
| `FundConservesMoney` | The fund's token balance always equals total raised minus total allocated: no unit leaves the fund except through an executed allocation. |
| `AllocationsWithinCharter` | No purpose ever exceeds its cap, and the purposes add up to the total allocated, which never exceeds what was raised. |
| `CustodyTreeBalances` | Root tranches add up to the total allocated; a tranche never passes on or reports paid more than it received; each tranche's children add up to what it forwarded. |
| `PublishedLinesAddUp` | Each batch total is the sum of its lines; every made-up receipt is counted as unregistered; households never answer more lines than were published. |

Configuration: 256 runs of 50 calls each (`foundry.toml`, `[invariant]`), `fail_on_revert = true`, so a handler call that reverts also fails the run. The handler counts the calls that did real work (run with `-vv`).

```bash
cd contracts && forge test --match-contract InvariantsTest -vv
```

## 2. Static analysis (Slither 0.11.6)

```bash
cd contracts && slither . --filter-paths "lib/|node_modules/|test/|script/" --exclude-dependencies
```

First run: 48 results across 102 detectors. After the fixes below: 44 (the remaining ones are assessed here). Every High and Medium result, and what we did:

| Impact | Detector | Where | Assessment | Action |
|---|---|---|---|---|
| High | weak-prng | `CustodyLedger.drawAudit` | The audit sample is seeded by the hash of the block `AUDIT_DELAY` blocks after publication, if anyone draws within 256 blocks. A later draw uses a later block on the same 256-block grid, recorded in `auditSeedBlockUsed`, so a custodian that delays the draw could choose among later seeds; the relayer should draw right after publication and the dashboard should flag late draws. A block producer can also in principle influence a block hash. The modulo bias over a 256-bit hash is negligible. | Accepted for the pilot and documented in the contract. Production: a public randomness beacon (drand) or a VRF. |
| High | uninitialized-state | `_lineReceipts`, `_auditPicks` | False positive: mappings of arrays are written through storage references (`list.push`, `out.push`). | None |
| Medium | divide-before-multiply | `CustodyLedger.auditSeedBlock` | Intended: rounds down to the 256-block grid so a late draw still uses a fixed, readable block hash. | None |
| Medium | reentrancy-no-eth | `ReliefFund._approve` / `_apply` | External calls go to the fund's own ledger and voice modules and to its ERC-20 token, all fixed at creation. State is updated before the token transfer. | Defence in depth: `nonReentrant` added to every proposal, approval and review entry point (it was already on `donate` and `execute`). Slither still lists the internal function, which every external path now guards. |
| Medium | reentrancy-no-eth | `EligibilityRegistry.revokeMember` | The callee is the Semaphore contract, immutable and fixed at construction. | Accepted (trusted dependency). |
| Medium | uninitialized-local | several | False positives: locals intentionally start at zero / false. | None |

Low and informational results (accepted unless noted):

- **missing-zero-check** on `CustodyLedger.setAidPrograms`: fixed, the address can no longer be zero.
- **calls-loop**: `reconcile` asks the registry whether each line is a registered household (bounded by `MAX_LINES = 500`); `createDisaster` creates one Semaphore group per damage tier.
- **reentrancy-benign / reentrancy-events**: state or events after calls to Semaphore, the fund's modules or its token, all trusted.
- **timestamp**: deadlines, waiting periods and review windows are meant to be time-based; a few seconds of block-time drift do not matter at the scale of days.
- **naming-convention, cyclomatic-complexity, missing-inheritance, unindexed-event-address, cache-array-length**: style.

## 3. What these checks do not cover

- Off-chain parts: the demo server that signs for institutions, the relayer, and the households' key storage.
- Economic and social attacks: collusion between a custodian and both registering officials, or a corrupt auditor. Kept makes these attributable; the sample audit and its limits are quantified in the simulation (`web/scripts/fraud-sim.mjs`, shown on the Why Kept page).
- Zero-knowledge circuits: Kept uses Semaphore v4 as published by PSE and does not modify it.
- A professional audit has not been done. It is a precondition for holding real funds (phase 3).
