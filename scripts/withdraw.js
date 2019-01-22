require('dotenv').config();
const {VestingManager} = require('../contractApis/back');

async function main() {

  console.log('manager address', process.env.MANAGER_ADDRESS);
  const vestingManager = VestingManager(process.env.MANAGER_ADDRESS);
  const result = await vestingManager.methods.withdraw();
  console.log(result);
}

main();
