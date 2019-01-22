require('dotenv').config();
const {MainToken} = require('../contractApis/back');

async function main() {
  const mainToken = MainToken();
  mainToken.at(process.env.TOKEN_ADDRESS);
  const result = await mainToken.methods.unlock();
  console.log(result);
}

main();
