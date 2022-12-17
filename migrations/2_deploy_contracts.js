// migrating the appropriate contracts
var FarmerRole = artifacts.require("./FarmerRole.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var RetailerRole = artifacts.require("./RetailerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = async function(deployer) {
  await deployer.deploy(FarmerRole);
  await deployer.deploy(DistributorRole);
  await deployer.deploy(RetailerRole);
  await deployer.deploy(ConsumerRole);

  const farmerRole = await FarmerRole.deployed();
  const distributorRole = await DistributorRole.deployed();
  const retailerRole = await RetailerRole.deployed();
  const consumerRole = await ConsumerRole.deployed();
  await deployer.deploy(SupplyChain, farmerRole.address, distributorRole.address, retailerRole.address, consumerRole.address);
};
