// Keep Hardhat's generated preferences and caches inside the project.
const path=require('node:path');
const modulePath=require.resolve('env-paths',{paths:[require.resolve('hardhat')]});
const original=require(modulePath);
require.cache[modulePath].exports=function(name,options){
  if(!String(name).startsWith('hardhat')) return original(name,options);
  const root=path.join(__dirname,'..','.local-runtime');
  return Object.fromEntries(['data','config','cache','log','temp'].map(k=>[k,path.join(root,k)]));
};
