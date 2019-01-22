require('dotenv').config();
const {VestingVault} = require('../contractApis/back');

async function main() {
    const vestingVault = VestingVault(process.argv[2]);

    const result = await vestingVault.methods.release();
    console.log(result);
}

main()
