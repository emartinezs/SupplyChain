// migrating the appropriate contracts
const MillRole = artifacts.require("./MillRole.sol");

module.exports = async function(deployer) {
  await deployer.deploy(MillRole);
};
