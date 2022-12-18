// migrating the appropriate contracts
const RefineryRole = artifacts.require("./RefineryRole.sol");

module.exports = async function(deployer) {
  await deployer.deploy(RefineryRole);
};
