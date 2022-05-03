const Web3 = require('web3');
const express = require('express')
const fs = require('fs');
const axios = require('axios');
const app = express()
const port = 8080

require('dotenv').config();

let web3 = new Web3(process.env.RPC_URL_ETH);

const web3Bsc = new Web3(process.env.RPC_URL_BSC);
const web3Eth = new Web3(process.env.RPC_URL_ETH);

let mainBridgeContractAbi = JSON.parse(fs.readFileSync('json/MainBridge.json'));
let wrappedOwnlyContractAbi = JSON.parse(fs.readFileSync('json/WrappedOwnly.json'));

const mainBridge = new web3Bsc.eth.Contract(
    mainBridgeContractAbi,
    process.env.MAIN_BRIDGE
);

const wrappedOwnly = new web3Eth.eth.Contract(
    wrappedOwnlyContractAbi,
    process.env.WRAPPED_OWNLY
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/web3/getSigningAddress/:signature/:message', async (req, res) => {
    let signing_address = await web3Bsc.eth.accounts.recover(req.params.message, req.params.signature);
    res.send(signing_address);
});

app.get('/web3/bridge/getSignature/:chainId/:address', (req, res) => {
    if(req.params.chainId === "97") {
        mainBridge.methods.fetchBridgeItems(req.params.address).call()
            .then(async function(bridgeItems) {
                let hasResult = false;
                for(let i = 0; i < bridgeItems.length; i++) {
                    await wrappedOwnly.methods.getItemIdIsClaimed(bridgeItems[i][0]).call()
                        .then(async function(itemIdIsClaimed) {
                            if(!itemIdIsClaimed) {
                                await wrappedOwnly.methods.getMessageHash(process.env.MAIN_BRIDGE, bridgeItems[i][0], bridgeItems[i][1], bridgeItems[i][2]).call()
                                    .then(function(messageHash) {
                                        let signatureObject = web3Eth.eth.accounts.sign(messageHash, process.env.BRIDGE_VALIDATOR);

                                        let response = [
                                            bridgeItems[i][0],
                                            bridgeItems[i][1],
                                            bridgeItems[i][2],
                                            signatureObject.signature
                                        ];

                                        hasResult = true;
                                        res.send(response);
                                    });
                            }
                        });

                    if(i === bridgeItems.length - 1 && !hasResult) {
                        res.send([]);
                    }
                }
            });
    } else if(req.params.chainId === "4") {
        wrappedOwnly.methods.fetchBridgeItems(req.params.address).call()
            .then(async function(bridgeItems) {
                let hasResult = false;
                for(let i = 0; i < bridgeItems.length; i++) {
                    await mainBridge.methods.getItemIdIsClaimed(req.params.chainId, bridgeItems[i][0]).call()
                        .then(async function(itemIdIsClaimed) {
                            if(!itemIdIsClaimed) {
                                await mainBridge.methods.getMessageHash(req.params.chainId, process.env.WRAPPED_OWNLY, bridgeItems[i][0], bridgeItems[i][1], bridgeItems[i][2]).call()
                                    .then(function(messageHash) {
                                        let signatureObject = web3Eth.eth.accounts.sign(messageHash, process.env.BRIDGE_VALIDATOR);

                                        let response = [
                                            bridgeItems[i][0],
                                            bridgeItems[i][1],
                                            bridgeItems[i][2],
                                            signatureObject.signature
                                        ];

                                        hasResult = true;
                                        res.send(response);
                                    });
                            }
                        });

                    if(i === bridgeItems.length - 1 && !hasResult) {
                        res.send([]);
                    }
                }
            });
    }
});

app.get('/web3/isAddress/:address', (req, res) => {
    let data = {
        isAddress: web3.utils.isAddress(req.params.address)
    };

    res.send(data);
});

app.get('/web3/getTokenURI/:chainId/:contractAddress/:tokenId', (req, res) => {
    let explorers = {
        '1': {
            endpoint: 'https://api.etherscan.io',
            key: process.env.EXPLORER_API_KEY_ETH,
            rpc: process.env.RPC_URL_ETH,
        },
        '56': {
            endpoint: 'https://api.bscscan.com',
            key: process.env.EXPLORER_API_KEY_BSC,
            rpc: process.env.RPC_URL_BSC,
        },
        '136': {
            endpoint: 'https://api.polygonscan.com',
            key: process.env.EXPLORER_API_KEY_MATIC,
            rpc: process.env.RPC_URL_MATIC,
        }
    };

    try {
        axios.get(explorers[req.params.chainId].endpoint + '/api?module=contract&action=getabi&address=' + req.params.contractAddress + '&apikey=' + explorers[req.params.chainId].key)
            .then(data => {
                let contractAbi = data.data.result;
                let web3 = new Web3(explorers[req.params.chainId].rpc);
                let contract = new web3.eth.Contract(JSON.parse(contractAbi), req.params.contractAddress);

                contract.methods.tokenURI(req.params.tokenId).call()
                    .then(function(data) {
                        data = data.replace('ipfs.io', 'gateway.pinata.cloud');

                        axios.get(data)
                            .then(data => {
                                if(data.data) {
                                    axios.post(process.env.OWNLY_URL + "/api/store-token", {
                                        chainId: req.params.chainId,
                                        contractAddress: req.params.contractAddress,
                                        tokenId: req.params.tokenId,
                                        metadata: JSON.stringify(data.data),
                                        apiKey: process.env.OWNLY_API_KEY
                                    }).then(data => {
                                        res.send(data.data);
                                    }).catch(err => res.send(err));
                                }
                            }).catch(err => res.send(err));
                    }).catch(err => res.send(err));
            })
            .catch(err => res.send(err));
    } catch(err){
        console.error(err);
    }
});