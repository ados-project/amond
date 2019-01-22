require('dotenv').config();
const {MainToken} = require('../contractApis/back');

async function main() {
  const mainToken = MainToken();
  mainToken.at(process.env.TOKEN_ADDRESS);
  console.log(process.argv[2],process.argv[3]);
  const result = await mainToken.methods.transfer(
    process.argv[2], process.argv[3],
  );
  console.log(result);
}

main();
