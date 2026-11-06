require('./local-runtime.cjs');
const fs=require('node:fs');
const hre=require('hardhat');
const {ethers}=require('ethers');
const {artifact}=require('./compile.cjs');
async function main(){
 const p=new ethers.BrowserProvider(hre.network.provider,undefined,{cacheTimeout:-1});p.pollingInterval=10;
 const [buyer,seller,arb]=await Promise.all([0,1,2].map(i=>p.getSigner(i)));
 const a=artifact();const c=await new ethers.ContractFactory(a.abi,a.bytecode,buyer).deploy();await c.waitForDeployment();
 console.log('EDUCATIONAL LOCAL DEMO. No real funds or private keys.');console.log('Chain ID:',String((await p.getNetwork()).chainId));console.log('Deployed MilestoneEscrow:',await c.getAddress());
 const deadline=(await p.getBlock('latest')).timestamp+3600;const gas={};
 async function step(label,tx){const receipt=await (await tx).wait();gas[label]=Number(receipt.gasUsed);console.log(label+' | gas used: '+receipt.gasUsed);}
 await step('createDeal',c.createDeal(seller.address,arb.address,deadline,ethers.id('FICTIONAL milestone specification'),{value:ethers.parseEther('1')}));
 await step('submitDelivery',c.connect(seller).submitDelivery(0));
 await step('accept',c.accept(0));console.log('Provider credit:',ethers.formatEther(await c.credits(seller.address)),'test units');
 await step('withdraw',c.connect(seller).withdraw());console.log('Contract balance:',ethers.formatEther(await p.getBalance(await c.getAddress())),'test units');
 const data={network:'Hardhat in-process, chainId 31337',compiler:'solc 0.8.28, Paris EVM, optimizer 200',gas,totalGas:Object.values(gas).reduce((a,b)=>a+b,0),note:'Gas units are local measurements, not Rootstock KZT prices.'};
 fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/gas-measurements.json',JSON.stringify(data,null,2));console.log('Normal path complete. Run npm test to show the tests.');await p.destroy();
}
main().catch(e=>{console.error(e);process.exitCode=1;});
