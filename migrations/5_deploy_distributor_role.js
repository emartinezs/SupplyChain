// migrating the appropriate contracts
const DistributorRole = artifacts.require("./DistributorRole.sol");

module.exports = async function(deployer) {
  await deployer.deploy(DistributorRole);
};
