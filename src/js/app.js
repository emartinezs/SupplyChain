App = {
    web3: null,
    contracts: {},

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
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
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
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            let SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchItem();
        });

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
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItem(event);
                break;
            }
    },

    harvestItem: async function(event) {
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
            await supplyChain.harvestItem(
                upc, 
                account, 
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

    processItem: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.processItem(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },
    
    packItem: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.packItem(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    sellItem: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        let priceEth = $("#productPrice").val();
        let priceWei = App.web3.utils.toWei(priceEth, "ether");
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.sellItem(upc, priceWei, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    buyItem: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        let priceEth = $("#productPrice").val();
        let priceWei = App.web3.utils.toWei(priceEth, "ether");
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.buyItem(upc, { from: account, value: priceWei});
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    shipItem: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.shipItem(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    receiveItem: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.receiveItem(upc, { from: account });
            App.fetchItem();
        } catch (error) {
            console.log(error);
        }
    },

    purchaseItem: async function (event) {
        event.preventDefault();

        let upc = $("#upc").val();
        try {
            let account = await App.getMetaskAccountID();
            let supplyChain = await App.contracts.SupplyChain.deployed(); 
            await supplyChain.purchaseItem(upc, { from: account });
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

            $("#sku").val(result1[0]);
            $("#upc").val(result1[1]);
            $("#ownerID").val(result1[2]);
            $("#originFarmerID").val(result1[3]);
            $("#originFarmName").val(result1[4]);
            $("#originFarmInformation").val(result1[5]);
            $("#originFarmLatitude").val(result1[6]);
            $("#originFarmLongitude").val(result1[7]);
            $("#productNotes").val(result2[3]);

            let priceEth = App.web3.utils.fromWei(result2[4], "ether");
            $("#productPrice").val(priceEth);
            
            $("#distributorID").val(result2[6]);
            $("#retailerID").val(result2[7]);
            $("#consumerID").val(result2[8]);

            let state = "";
            let stateID = result2[5].toNumber();
            switch (stateID) {
                case 0:
                    state = "Harvested";
                    break;
                case 1:
                    state = "Processed";
                    break;
                case 2:
                    state = "Packed";
                    break;
                case 3:
                    state = "For Sale";
                    break;
                case 4:
                    state = "Sold";
                    break;
                case 5:
                    state = "Shipped";
                    break;
                case 6:
                    state = "Received";
                    break;
                case 7:
                    state = "Purchased";
                    break;
            }
            $("#state").val(state);

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

        // if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
        //     App.contracts.SupplyChain.currentProvider.sendAsync = function () {
        //         return App.contracts.SupplyChain.currentProvider.send.apply(
        //             App.contracts.SupplyChain.currentProvider,
        //             arguments
        //         );
        //     };
        // }

        // App.contracts.SupplyChain.deployed().then(function(instance) {
        //     let events = instance.allEvents(function(err, log) {
        //         if (!err) {
        //             $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        //         }
        //     });
        // }).catch(function(err) {
        //     console.log(err.message);
        // });

        try {
            let supplyChain = await App.contracts.SupplyChain.deployed();
            let events = await supplyChain.getPastEvents("allEvents", {
                fromBlock: 0,
                toBlock: "latest"
            });
            $("#ftc-events").empty();
            events.filter((event) => {
                return event.args.upc == upc;
            }).forEach((event) => {
                $("#ftc-events").append('<li>' + event.event + ' - ' + event.transactionHash + '</li>');
            });
        } catch(error) {
            console.log(error);
        }
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
