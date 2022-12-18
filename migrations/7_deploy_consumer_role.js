// migrating the appropriate contracts
const ConsumerRole = artifacts.require("./ConsumerRole.sol");

module.exports = async function(deployer) {
  await deployer.deploy(ConsumerRole);
};
