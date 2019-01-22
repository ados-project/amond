const path = require('path');
const { getWeb3, mnemonicToPrivateKey, sendTx } = require('@haechi-labs/vvisp-utils');
const web3 = getWeb3();
const fs = require('fs');

const privateKey = mnemonicToPrivateKey(process.env.MNEMONIC, process.env.PRIV_INDEX);

const abi = fs.readFileSync(path.join(__dirname, '../abi/', 'VestingVault.json'), {'encoding': 'utf8'});

module.exports = function(_contractAddr = '') {
  const contract = new web3.eth.Contract(JSON.parse(abi));
  contract.options.address = _contractAddr;
  return {
    at: function(_addr) {
      contract.options.address = _addr;
    },
    getAddress: function() {
      return contract.options.address;
    },
    methods: {
      beneficiary: function() {
        return contract.methods.beneficiary().call();
      },
      vestedAmount: function() {
        return contract.methods.vestedAmount().call();
      },
      releasableAmount: function() {
        return contract.methods.releasableAmount().call();
      },
      unlockTimes: function(_input1, ) {
        return contract.methods.unlockTimes(_input1, ).call();
      },
      released: function() {
        return contract.methods.released().call();
      },
      tokenAmounts: function(_input1, ) {
        return contract.methods.tokenAmounts(_input1, ).call();
      },
      vestingManager: function() {
        return contract.methods.vestingManager().call();
      },
      token: function() {
        return contract.methods.token().call();
      },
      release: function(options) {
        const txData = contract.methods.release().encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(contract.options.address, options ? options.value : 0, privateKey, options);
      },
    }
  }
};
