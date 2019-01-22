require('dotenv').config();
const {VestingManager} = require('../contractApis/back');

async function main() {

  console.log('manager address', process.env.MANAGER_ADDRESS);
  const vestingManager = VestingManager(process.env.MANAGER_ADDRESS);
  console.log('token amounts', process.env.TOKEN_AMOUNTS);
  const tokenAmounts = JSON.parse(process.env.TOKEN_AMOUNTS).map(x => `${x}`);
  console.log('unlock times(should be utc)', process.env.UNLOCK_TIMES);
  const unlockTimes = JSON.parse(process.env.UNLOCK_TIMES).map(x => `${x}`);
  const beneficiary = process.env.BENEFICIARY_ADDRESS;
  console.log('beneficiary', beneficiary);

  const result = await vestingManager.methods.createVault(beneficiary,
tokenAmounts, unlockTimes);
  console.log(result);
  console.log(`vault address for ${process.env.BENEFICIARY_ADDRESS}is:`);
  console.log(`0x${parseVaultAddress(result)}`);

  function parseVaultAddress(res){
    const {logs} = res;
    const data = logs[1].data;
    return data.slice(26,66)
  }
}

main();
