// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
const SupplyChain = artifacts.require('SupplyChain')
const FarmerRole = artifacts.require('FarmerRole')
const DistributorRole = artifacts.require('DistributorRole')
const RetailerRole = artifacts.require('RetailerRole')
const ConsumerRole = artifacts.require('ConsumerRole')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    let sku = 1
    let upc = 1
    // const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    const productID = sku
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei("1", "ether")
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        const farmerRole = await FarmerRole.deployed()
        await farmerRole.addFarmer(originFarmerID);

        // Declare and Initialize a variable for event
        let eventEmitted = false

        // Watch the emitted event Harvested()
        supplyChain.Harvested({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestItem(
            upc,
            originFarmerID,
            originFarmName,
            originFarmInformation,
            originFarmLatitude,
            originFarmLongitude,
            productNotes,
            { from: originFarmerID }
        )

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], 0, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let eventEmitted = false
        
        // Watch the emitted event Processed()
        supplyChain.Processed({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as Processed by calling function processItem()
        await supplyChain.processItem(upc, { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], 0, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')   
    })    

    // // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let eventEmitted = false
        
        // Watch the emitted event Packed()
        supplyChain.Packed({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], 0, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')   
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let eventEmitted = false
        
        // Watch the emitted event ForSale()
        supplyChain.ForSale({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, { from: originFarmerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')     
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        const distributorRole = await DistributorRole.deployed()
        await distributorRole.addDistributor(distributorID);

        // Declare and Initialize a variable for event
        let eventEmitted = false
        
        // Watch the emitted event Sold()
        supplyChain.Sold({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, { from: distributorID, value: productPrice })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')   
    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let eventEmitted = false
        
        // Watch the emitted event Shipped()
        supplyChain.Shipped({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as Shipped by calling function shipItem()
        await supplyChain.shipItem(upc, { from: distributorID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')         
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        const retailerRole = await RetailerRole.deployed()
        await retailerRole.addRetailer(retailerID);

        // Declare and Initialize a variable for event
        let eventEmitted = false
        
        // Watch the emitted event Received()
        supplyChain.Received({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as Received by calling function receiveItem()
        await supplyChain.receiveItem(upc, { from: retailerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        const consumerRole = await ConsumerRole.deployed()
        await consumerRole.addConsumer(consumerID);
        
        // Declare and Initialize a variable for event
        let eventEmitted = false
        
        // Watch the emitted event Purchased()
        supplyChain.Purchased({
            filter: {upc: upc}
        }, (err, res) => {
            if (err) {
                console.log(err)
            } else if (res) {
                eventEmitted = true
            }
        })

        // Mark an item as Purchased by calling function purchaseItem()
        await supplyChain.purchaseItem(upc, { from: consumerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')     
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid itemState')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid consumerID')
    })

});

