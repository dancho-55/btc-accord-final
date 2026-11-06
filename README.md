Educational project for the course Introduction to Finance. Not a real product, service or investment offer. Do not use with real funds.

# BTC Accord local prototype

Single-milestone conditional payment for a fictional digital service. This is the Final Project extension of the SE-2528 Endterm concept. No public network, real asset, real customer data or bridge is used. The constructor permits only chain ID 31337; a chain ID check is an accident-prevention measure, not a production security boundary.

## Links to complete before submission

- GitHub repository: https://github.com/dancho-55/btc-accord-final
- Demo video: LEFT FOR THE TEAM TO RECORD AND UPLOAD, at the user's request. Replace this line with the shareable video URL.
- Public testnet: not used. No public contract address is required.

## Install and run

Use Node.js 22 LTS and npm, or pnpm 11. The checked run used Node.js 24.22.1; Hardhat may warn that this version is outside its supported range.

```sh
npm install
npm run compile
npm test
npm run demo
```

Alternatively `pnpm install --frozen-lockfile`, then `pnpm test` and `pnpm demo`. Exact direct dependencies are pinned in package.json and all transitive versions are captured in pnpm-lock.yaml. Compilation uses the installed solc package; no compiler download is needed after dependency installation.

Tests and the demo create an in-process Hardhat network automatically. No separate node, wallet setup, seed phrase, key file or faucet is needed. Each demo starts with a fresh local network. The generated address is local and must not be described as a public deployment. To experiment with a separate local node, `npm run node` binds only to 127.0.0.1. Hardhat's node command prints disposable test account keys: do not include that terminal in the video. The demo and tests do not print keys.

## Implemented flow

1. Customer creates and funds one deal, fixing provider, arbitrator, deadline and a fictional terms hash.
2. Only that provider submits delivery before the deadline.
3. Only that customer accepts submitted delivery. Acceptance allocates a credit, without calling the recipient.
4. Provider withdraws the credit. Credit is cleared before transfer and withdrawal has a reentrancy guard.

Either party can open a dispute while funded or submitted. A party can request resolution after expiry. Expiry never decides who deserves payment. Only the fixed arbitrator may split the amount, and the split cannot exceed that deal's balance. No upgrade, owner withdrawal, role replacement, emergency pause or key recovery is implemented. Arbitrator unavailability can therefore strand a disputed deal; lost recipient keys can strand credits. These are explicit prototype limits.

## Tests and evidence

16 tests cover funding, invalid parameters, role permissions, delivery, acceptance, disputes, expiry, over-allocation, repeated actions, conservation of tracked balances, malicious reentrancy and rejecting recipients. `docs/test-results.txt` contains the checked run; regenerate it after any change. `docs/gas-measurements.json` records measured local gas units. The normal path uses four writes, not the three assumed at Endterm. A local gas count does not establish a Rootstock gas price in tenge.

Contract balance should be at least `lockedTotal + creditTotal`. In the normal tests they are equal; forced transfers can create surplus not tracked by this prototype. No recovery/sweep function is implemented. A failed withdrawal reverts and preserves the recipient's credit, without blocking unrelated deals.

## Design and limitations

This contract demonstrates the proposed application state machine only. It does not emulate Rootstock merged mining, PowPeg, production rBTC settlement, customer identity verification or legally enforceable arbitration. There is no front end, production API or off-chain evidence store. Solidity source is in `contracts/`; tests are in `test/`; deployment and the full workflow are in `scripts/demo.cjs`.

## Attribution and AI disclosure

The project-specific Solidity and test code were generated with OpenAI Codex and require student review. No OpenZeppelin source was copied. The design uses standard checks-effects-interactions, pull withdrawals and a reentrancy lock; consult the Solidity security documentation. Hardhat, ethers and solc are third-party dependencies under their respective licences; see their packages. Project code is MIT licensed. Record the exact AI model identifier displayed in the authoring interface before submission; it is not available in the project files.

Each team member must review and make their own genuine contribution from their own GitHub account. Do not fabricate commits, signatures or percentages. See `docs/demo-script.md` for the unrecorded video plan and `docs/sequence.mmd` for the workflow diagram.

## Financial-model reproduction

From the prototype folder, run `node scripts/finance.cjs`. It independently regenerates and checks all documented scenario, tax, funding, NPV and exit figures. The quoted tax rate and exit multiples remain hypothetical assumptions.

## Balanced team review

Each student has nine report pages and six slides. Bagdaulet reviews funding and delivery (tests 01–05); Amirlan reviews disputes and allocation (tests 06–11); Daryn reviews withdrawals and attack tests (12–16) and reproduces finance. These are proposed review tasks, not claimed completed contributions. See docs/review-allocation.txt. The initial commit is authored by Codex; students should make their own genuine reviewed changes from their own accounts.
