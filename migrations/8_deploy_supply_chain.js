// migrating the appropriate contracts
const FarmerRole = artifacts.require("./FarmerRole.sol");
const MillRole = artifacts.require("./MillRole.sol");
const RefineryRole = artifacts.require("./RefineryRole.sol");
const DistributorRole = artifacts.require("./DistributorRole.sol");
const RetailerRole = artifacts.require("./RetailerRole.sol");
const ConsumerRole = artifacts.require("./ConsumerRole.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = async function(deployer) {
  const farmerRole = await FarmerRole.deployed();
  const millRole = await MillRole.deployed();
  const refineryRole = await RefineryRole.deployed();
  const distributorRole = await DistributorRole.deployed();
  const retailerRole = await RetailerRole.deployed();
  const consumerRole = await ConsumerRole.deployed();
  await deployer.deploy(
      SupplyChain,
      farmerRole.address,
      millRole.address,
      refineryRole.address,
      distributorRole.address,
      retailerRole.address,
      consumerRole.address
    );
};
