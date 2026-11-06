# Unrecorded demo plan, maximum 3 minutes

The user will record the video. This file is a script, not a video or evidence of a recording.

0:00–0:15: Show README educational notice. Say: “BTC Accord is an educational local-chain demonstration. No real money or cryptocurrency is used.”
0:15–0:35: Run `npm run compile`. Show successful compilation and explain the customer, provider and arbitrator roles.
0:35–1:35: Run `npm run demo`. Show the local chain ID 31337, deployment address, creation and funding, delivery submission, acceptance and withdrawal. Say that acceptance creates a credit and withdrawal transfers it; there are four writes. Show the final zero contract balance.
1:35–2:35: Run `npm test`. Explain the unauthorized-access, double-payment, expiry, dispute, reentrancy and failed-recipient tests. Show all 16 passing.
2:35–2:55: Say: “The prototype verifies local contract behavior. It does not test Rootstock consensus or PowPeg. Arbitrator and key availability remain risks.”
2:55–3:00: Finish. Upload with anyone-with-the-link access; paste the verified URL on the report cover, title slide and README.

Keep private keys, .env, wallet recovery information and real personal data outside the recording. Do not run `npm run node` on camera because the Hardhat node command displays generated test keys. The demo and test commands do not display keys.

## Balanced team narration

Bagdaulet: first 60 seconds, local-only notice, deployment and funding/delivery. Amirlan: next 60 seconds, acceptance, allocation and dispute roles. Daryn: last 60 seconds, withdrawal, final balance and test results. Practice commands first so the complete recording stays within three minutes. The video remains unrecorded.
