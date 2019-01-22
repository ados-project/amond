const path = require('path');
const { getWeb3, mnemonicToPrivateKey, sendTx } = require('@haechi-labs/vvisp-utils');
const web3 = getWeb3();
const fs = require('fs');

const privateKey = mnemonicToPrivateKey(process.env.MNEMONIC, process.env.PRIV_INDEX);

const abi = fs.readFileSync(path.join(__dirname, '../abi/', 'VestingManager.json'), {'encoding': 'utf8'});

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
      owner: function() {
        return contract.methods.owner().call();
      },
      initialUnlockTimeSetted: function() {
        return contract.methods.initialUnlockTimeSetted().call();
      },
      token: function() {
        return contract.methods.token().call();
      },
      getInitialUnlockTime: function(options) {
        const txData = contract.methods.getInitialUnlockTime().encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(contract.options.address, options ? options.value : 0, privateKey, options);
      },
      createVault: function(__beneficiary, __tokenAmounts, __unlockTimes, options) {
        const txData = contract.methods.createVault(__beneficiary, __tokenAmounts, __unlockTimes, ).encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(contract.options.address, options ? options.value : 0, privateKey, options);
      },
      withdraw: function(options) {
        const txData = contract.methods.withdraw().encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(contract.options.address, options ? options.value : 0, privateKey, options);
      },
      renounceOwnership: function(options) {
        const txData = contract.methods.renounceOwnership().encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(contract.options.address, options ? options.value : 0, privateKey, options);
      },
      setInitialUnlockTime: function(__initialUnlockTime, options) {
        const txData = contract.methods.setInitialUnlockTime(__initialUnlockTime, ).encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(contract.options.address, options ? options.value : 0, privateKey, options);
      },
      transferOwnership: function(_newOwner, options) {
        const txData = contract.methods.transferOwnership(_newOwner, ).encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(contract.options.address, options ? options.value : 0, privateKey, options);
      },
    }
  }
};
