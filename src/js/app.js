App = {
    web3: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",

    init: async function () {
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
        }
        App.web3 = new Web3(App.web3Provider);

        return App.initSupplyChain();
    },

    getMetaskAccountID: async function () {
        // Retrieving accounts
        try {
            let accounts = await App.web3.eth.getAccounts();
            return accounts[0];
        } catch (error) {
            console.log(error);
        }
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        let jsonSupplyChain = '../../build/contracts/SupplyChain.json';
        let jsonFarmerRole = '../../build/contracts/FarmerRole.json';
        let jsonMillRole = '../../build/contracts/MillRole.json';
        let jsonRefineryRole = '../../build/contracts/RefineryRole.json';
        let jsonDistributorRole = '../../build/contracts/DistributorRole.json';
        let jsonRetailerRole = '../../build/contracts/RetailerRole.json';
        let jsonConsumerRole = '../../build/contracts/ConsumerRole.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            let SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
        });

        $.getJSON(jsonFarmerRole, function(data) {
            let FarmerRoleArtifact = data;
            App.contracts.FarmerRole = TruffleContract(FarmerRoleArtifact);
            App.contracts.FarmerRole.setProvider(App.web3Provider);
        })

        $.getJSON(jsonMillRole, function(data) {
            let MillRoleArtifact = data;
            App.contracts.MillRole = TruffleContract(MillRoleArtifact);
            App.contracts.MillRole.setProvider(App.web3Provider);
        })

        $.getJSON(jsonRefineryRole, function(data) {
            let RefineryRoleArtifact = data;
            App.contracts.RefineryRole = TruffleContract(RefineryRoleArtifact);
            App.contracts.RefineryRole.setProvider(App.web3Provider);
        })

        $.getJSON(jsonDistributorRole, function(data) {
            let DistributorRoleArtifact = data;
            App.contracts.DistributorRole = TruffleContract(DistributorRoleArtifact);
            App.contracts.DistributorRole.setProvider(App.web3Provider);
        })

        $.getJSON(jsonRetailerRole, function(data) {
            let RetailerRoleArtifact = data;
            App.contracts.RetailerRole = TruffleContract(RetailerRoleArtifact);
            App.contracts.RetailerRole.setProvider(App.web3Provider);
        })

        $.getJSON(jsonConsumerRole, function(data) {
            let ConsumerRoleArtifact = data;
            App.contracts.ConsumerRole = TruffleContract(ConsumerRoleArtifact);
            App.contracts.ConsumerRole.setProvider(App.web3Provider);
        })

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        let processId = parseInt($(event.target).data('id'));
        switch(processId) {
            case 1:
                return await App.fetchItem(event);
                break;
            case 2:
                return await App.harvest(event);
                break;
            case 3:
                return await App.sendToMill(event);
                break;
            case 4:
                return await App.receiveByMill(event);
                break;
            case 5:
                return await App.mill(event);
                break;
            case 6:
                return await App.sendToRefinery(event);
                break;
            case 7:
                return await App.receiveByRefinery(event);
                break;
            case 8:
                return await App.refine(event);
                break;
            case 9:
                return await App.pack(event);
                break;
            case 10:
                return await App.sellToDistributor(event);
                break;
            case 11:
                return await App.buyByDistributor(event);
                break;
            case 12:
                return await App.sendToRetailer(event);
                break;
            case 13:
                return await App.receiveByRetailer(event);
                break;
            case 14:
                return await App.sellToConsumer(event);
                break;
            case 15:
                return await App.buyByConsumer(event);
                break;
            case 16:
                return await App.addFarmer(event);
                break;
            case 17:
                return await App.addMill(event);
                break;
            case 18:
                return await App.addRefinery(event);
                break;
            case 19:
                return await App.addDistributor(event);
                break;
            case 20:
                return await App.addRetailer(event);
                break;
            case 21:
                return await App.addConsumer(event);
                break;
        }
    },

    harvest: async function(event) {
        event.preventDefault();

        let upc = $("#upc").val();
        let originFarmName = $("#originFarmName").val();
        let originFarmInformation = $("#originFarmInformation").val();
        let originFarmLatitude = $("#originFarmLatitude").val();
        let originFarmLongitude = $("#originFarmLongitude").val();
        let productNotes = $("#productNotes").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.harvestSugarcane(
                upc, 
                originFarmName, 
                originFarmInformation, 
                originFarmLatitude, 
                originFarmLongitude, 
                productNotes,
                { from: account }
            );
            App.fetchItem();
        } catch(error) {
            console.log(error.message);
        }
    },

    sendToMill: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.sendToMill(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    receiveByMill: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.receiveByMill(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },
    
    mill: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.millSugarcane(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    sendToRefinery: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.sendToRefinery(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    receiveByRefinery: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.receiveByRefinery(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    refine: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.refineRawSugar(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },
    
    pack: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.packRefinedSugar(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    sellToDistributor: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        let priceEth = $("#priceToDistributor").val();
        let priceWei = App.web3.utils.toWei(priceEth, "ether");
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.sellToDistributor(upc, priceWei, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    buyByDistributor: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        let priceEth = $("#priceToDistributor").val();
        let priceWei = App.web3.utils.toWei(priceEth, "ether");
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.buyByDistributor(upc, { from: account, value: priceWei});
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    sendToRetailer: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.sendToRetailer(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    receiveByRetailer: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.receiveByRetailer(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    sellToConsumer: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        let priceEth = $("#priceToConsumer").val();
        let priceWei = App.web3.utils.toWei(priceEth, "ether");
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.sellToConsumer(upc, priceWei, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    buyByConsumer: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        let priceEth = $("#priceToConsumer").val();
        let priceWei = App.web3.utils.toWei(priceEth, "ether");
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.buyByConsumer(upc, { from: account, value: priceWei});
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    fetchItem: async function () {
        let upc = $('#upc').val();
        if (!upc) {
            return;
        }

        try {
            let supplyChain = await App.contracts.SupplyChain.deployed();
            let result1 = await supplyChain.fetchItemBufferOne(upc);
            let result2 = await supplyChain.fetchItemBufferTwo(upc);

            $("#sku").val("");
            let sku = result1[0];
            if (sku != 0) {
                $("#sku").val(sku);
            }

            let ownerID = result1[2];
            $("#ownerID").val(ownerID);

            $("#originFarmerID").val(result1[3]);
            $("#originFarmName").val(result1[4]);
            $("#originFarmInformation").val(result1[5]);
            $("#originFarmLatitude").val(result1[6]);
            $("#originFarmLongitude").val(result1[7]);
            $("#productNotes").val(result2[2]);

            $("#priceToDistributor").val("");
            let pricetoDistributorEth = App.web3.utils.fromWei(result2[3], "ether");
            if (pricetoDistributorEth != 0) {
                $("#priceToDistributor").val(pricetoDistributorEth);
            }

            $("#priceToConsumer").val("");
            let priceToConsumerEth = App.web3.utils.fromWei(result2[4], "ether");
            if (priceToConsumerEth != 0) {
                $("#priceToConsumer").val(priceToConsumerEth);
            }

            $("#millID").val(result2[6]);
            $("#refineryID").val(result2[7]);
            $("#distributorID").val(result2[8]);
            $("#retailerID").val(result2[9]);
            $("#consumerID").val(result2[10]);

            let state = "";
            let stateID = result2[5].toNumber();
            switch (stateID) {
                case 0:
                    state = "Harvested";
                    break;
                case 1:
                    state = "Sent to Mill";
                    break;
                case 2:
                    state = "Received by Mill";
                    break;
                case 3:
                    state = "Milled";
                    break;
                case 4:
                    state = "Sent to Refinery";
                    break;
                case 5:
                    state = "Received by Refinery";
                    break;
                case 6:
                    state = "Refined";
                    break;
                case 7:
                    state = "Packed";
                    break;
                case 8:
                    state = "For Sale to Distributor";
                    break;
                case 9:
                    state = "Bought by Distributor";
                    break;
                case 10:
                    state = "Sent to Retailer";
                    break;      
                case 11:
                    state = "Received by Retailer";
                    break;  
                case 12:
                    state = "For Sale to Consumer";
                    break;        
                case 13:
                    state = "Bought by Consumer";
                    break;    
            }
            $("#state").val("");
            if (ownerID != App.emptyAddress) {
                $("#state").val(state);
            }

            App.fetchEvents();
        } catch (error) {
            console.log(error);
        }
    },

    fetchEvents: async function () {
        let upc = $('#upc').val();
        if (!upc) {
            return;
        }

        try {
            let supplyChain = await App.contracts.SupplyChain.deployed();
            let events = await supplyChain.getPastEvents("allEvents", {
                fromBlock: 0,
                toBlock: "latest"
            });
            $("#event-list").empty();
            events.filter((event) => {
                return event.args.upc == upc;
            }).forEach((event) => {
                $("#event-list").append('<li>' + event.event + ' - ' + event.transactionHash + '</li>');
            });
        } catch(error) {
            console.log(error);
        }
    },

    addFarmer: async function (event) {
        event.preventDefault();

        let address = $("#address").val();
        try {
            let account = await App.getMetaskAccountID();
            let farmerRole = await App.contracts.FarmerRole.deployed(); 
            await farmerRole.addFarmer(address, { from: account });
        } catch (error) {
            console.log(error);
        }
    },

    addMill: async function (event) {
        event.preventDefault();

        let address = $("#address").val();
        try {
            let account = await App.getMetaskAccountID();
            let millRole = await App.contracts.MillRole.deployed(); 
            await millRole.addMill(address, { from: account });
        } catch (error) {
            console.log(error);
        }
    },

    addRefinery: async function (event) {
        event.preventDefault();

        let address = $("#address").val();
        try {
            let account = await App.getMetaskAccountID();
            let refineryRole = await App.contracts.RefineryRole.deployed(); 
            await refineryRole.addRefinery(address, { from: account });
        } catch (error) {
            console.log(error);
        }
    },

    addDistributor: async function (event) {
        event.preventDefault();

        let address = $("#address").val();
        try {
            let account = await App.getMetaskAccountID();
            let distributorRole = await App.contracts.DistributorRole.deployed(); 
            await distributorRole.addDistributor(address, { from: account });
        } catch (error) {
            console.log(error);
        }
    },

    addRetailer: async function (event) {
        event.preventDefault();

        let address = $("#address").val();
        try {
            let account = await App.getMetaskAccountID();
            let retailerRole = await App.contracts.RetailerRole.deployed(); 
            await retailerRole.addRetailer(address, { from: account });
        } catch (error) {
            console.log(error);
        }
    },

    addConsumer: async function (event) {
        event.preventDefault();

        let address = $("#address").val();
        try {
            let account = await App.getMetaskAccountID();
            let consumerRole = await App.contracts.ConsumerRole.deployed(); 
            await consumerRole.addConsumer(address, { from: account });
        } catch (error) {
            console.log(error);
        }
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
