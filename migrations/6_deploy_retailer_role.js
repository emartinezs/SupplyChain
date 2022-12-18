// migrating the appropriate contracts
const RetailerRole = artifacts.require("./RetailerRole.sol");

module.exports = async function(deployer) {
  await deployer.deploy(RetailerRole);
};
