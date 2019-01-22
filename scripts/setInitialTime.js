require('dotenv').config();
const {VestingManager} = require('../contractApis/back');

async function main() {

  const vestingManager = VestingManager(process.env.MANAGER_ADDRESS);
  const result = await vestingManager.methods.setInitialUnlockTime(process.argv[2]);
  console.log(result);

}

main();
