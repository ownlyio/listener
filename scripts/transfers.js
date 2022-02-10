const Web3 = require('web3');
const axios = require('axios');
const ethers = require('ethers');

require('dotenv').config();

let web3Eth = new Web3(process.env.RPC_URL_ETH);
web3Eth = new Web3("wss://eth-mainnet.alchemyapi.io/v2/n60TiXLxyxLjDkrPnw_mzx4GahkWWkSN");
let web3Bsc = new Web3(process.env.RPC_URL_BSC);
web3Bsc = new Web3("wss://apis.ankr.com/wss/0407faa2327343cdaab0119f931d0774/3fbdcb07f9c77acb75faaa0ac3cae996/binance/full/main");
let web3Matic = new Web3(process.env.RPC_URL_MATIC);

const webSocketProvider = new ethers.providers.WebSocketProvider("wss://speedy-nodes-nyc.moralis.io/66aa4c60304ba7f399f9eedd/bsc/mainnet/ws");

axios.get(process.env.OWNLY_URL + "/api/get-collections").then(data => {
    let collections = data.data.collections;
    let collectionContracts = [];

    for(let i = 0; i < collections.length; i++) {
        let processBlockchainData = function(collection, event, currency) {
            axios.get("https://api.covalenthq.com/v1/" + collections[i].chain_id + "/transaction_v2/" + event.transactionHash + "/?quote-currency=USD&format=JSON&no-logs=false&key=ckey_994c8fdd549f44fa9b2b27f59a0").then(data => {
                let value = data.data.items[0].value;

                axios.post(process.env.OWNLY_URL + "/api/store-token-transaction", {
                    chain_id: collections[i].chain_id,
                    contract_address: collections[i].contract_address,
                    token_id: event.returnValues.tokenId,
                    from: event.returnValues.from,
                    to: event.returnValues.to,
                    value: value,
                    currency: currency,
                    transaction_hash: event.transactionHash,
                    signed_at: data.data.items[0].block_signed_at,
                }).then(data => {
                    console.log("\nstore-market-item:");
                    console.log(data.data);
                }).catch(function (error) {
                    console.log(error)
                });
            }).catch(function (error) {
                console.log(error)
            });
        };

        if (collections[i].chain_id === 1) {
            // collectionContracts[i] = new web3Eth.eth.Contract(
            //     JSON.parse(collections[i].abi),
            //     collections[i].contract_address
            // );
            //
            // collectionContracts[i].getPastEvents('Transfer', {
            //     fromBlock: 0,
            //     toBlock: 'latest'
            // }).then(results => console.log(results))
            //     .catch(err => {
            //
            // });

            // web3Eth.eth.getBlockNumber().then((data) => {
            //     // let fromBlock = data;
            //     let fromBlock = 0;
            //
            //     console.log("\nContract Address");
            //     console.log(collectionContracts[i].events);
            //
            //     collectionContracts[i].events.Transfer(
            //         {fromBlock: fromBlock, step: 0}
            //     ).on('data', async event => {
            //         console.log(event.returnValues);
            //
            //         // processBlockchainData(collections[i], event, "ETH");
            //     });
            // });
        } else if(collections[i].chain_id === 56) {
            const contract = new ethers.Contract(collections[i].contract_address, JSON.parse(collections[i].abi), webSocketProvider)

            contract.on("Transfer", (from, to, value, event) => {
                console.log({
                    from: from,
                    to: to,
                    value: value.toNumber(),
                    data: event
                });
            });

            // collectionContracts[i] = new web3Bsc.eth.Contract(
            //     JSON.parse(collections[i].abi),
            //     collections[i].contract_address
            // );
            //
            // console.log("\nContract Address");
            // console.log(collections[i].contract_address);
            //
            // web3Bsc.eth.getBlockNumber().then((data) => {
            //     // let fromBlock = data;
            //     let fromBlock = 0;
            //
            //     console.log(fromBlock);
            //
            //     collectionContracts[i].events.Transfer(
            //         {fromBlock: fromBlock, step: 0}
            //     ).on('data', async event => {
            //         console.log(event);
            //         // processBlockchainData(collections[i], event, "BNB");
            //     });
            // });
        } else if(collections[i].chain_id === 136) {

        }
    }
}).catch(function(error) {
    console.log(error)
});