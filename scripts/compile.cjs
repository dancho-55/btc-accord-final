const fs = require('node:fs');
const path = require('node:path');
const solc = require('solc');
function compile(extra = {}) {
  const root = path.join(__dirname, '..');
  const name = 'MilestoneEscrow.sol';
  const sources = { [name]: {content:fs.readFileSync(path.join(root,'contracts',name),'utf8')}, ...extra };
  const result = JSON.parse(solc.compile(JSON.stringify({language:'Solidity',sources,settings:{evmVersion:'paris',optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}})));
  const errors=(result.errors||[]).filter(e=>e.severity==='error');
  if(errors.length) throw Error(errors.map(e=>e.formattedMessage).join('\n'));
  return result.contracts;
}
function artifact() {const c=compile()['MilestoneEscrow.sol'].MilestoneEscrow;return {abi:c.abi,bytecode:'0x'+c.evm.bytecode.object};}
if(require.main===module){fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/MilestoneEscrow.json',JSON.stringify(artifact(),null,2));console.log('Solidity 0.8.28: compilation passed (Paris EVM).');}
module.exports={compile,artifact};
