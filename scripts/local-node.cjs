require('./local-runtime.cjs');
// The UI is deliberately bound to loopback; use only generated test accounts.
process.argv=['node','hardhat','node','--hostname','127.0.0.1'];
require('hardhat/internal/cli/cli');
