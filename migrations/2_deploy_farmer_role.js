// migrating the appropriate contracts
const FarmerRole = artifacts.require("./FarmerRole.sol");

module.exports = async function(deployer) {
  await deployer.deploy(FarmerRole);
};
