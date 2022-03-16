const Web3 = require('web3');
const express = require('express')
const axios = require('axios');
const app = express()
const port = 8080

require('dotenv').config();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/web3/isAddress/:address', (req, res) => {
    let data = {
        isAddress: web3.utils.isAddress(req.params.address)
    };

    res.send(data);
});

app.get('/web3/getTokenURI/:chainId/:contractAddress/:tokenId', async (req, res) => {
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
        let contractAbi;

        await axios.get(explorers[req.params.chainId].endpoint + '/api?module=contract&action=getabi&address=' + req.params.contractAddress + '&apikey=' + explorers[req.params.chainId].key)
            .then(data => {
                contractAbi = data.data.result;
            })
            .catch(err => res.send(err));

        let web3 = new Web3(explorers[req.params.chainId].rpc);
        let contract = new web3.eth.Contract(JSON.parse(contractAbi), req.params.contractAddress);

        contract.methods.tokenURI(1).call()
            .then(async function(data) {

                await axios.get(data)
                    .then(async data => {
                        res.send(data.data);
                        await axios.post(explorers[req.params.chainId].endpoint + '/api?module=contract&action=getabi&address=' + req.params.contractAddress + '&apikey=' + explorers[req.params.chainId].key)
                            .then(data => {
                                contractAbi = data.data.result;
                            })
                            .catch(err => res.send(err));
                    })
                    .catch(err => res.send(err));
            });
    } catch(err){
        console.error(err);
    }
});