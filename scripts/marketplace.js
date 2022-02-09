const Web3 = require('web3');
const axios = require('axios');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 8080

require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const web3Eth = new Web3(process.env.RPC_URL_ETH);
const web3Bsc = new Web3(process.env.RPC_URL_BSC);
// const { address: admin } = web3Eth.eth.accounts.wallet.add(process.env.MARKETPLACE_VALIDATOR_PRIVATE_KEY);

let marketplace_contract_abi_eth = JSON.parse(fs.readFileSync('json/marketplace_contract_abi_bsc.json'));
let marketplace_contract_abi_bsc = JSON.parse(fs.readFileSync('json/marketplace_contract_abi_bsc.json'));

const marketplaceEth = new web3Eth.eth.Contract(
    marketplace_contract_abi_eth,
    process.env.MARKETPLACE_CONTRACT_ADDRESS_ETH
);

const marketplaceBsc = new web3Bsc.eth.Contract(
    marketplace_contract_abi_bsc,
    process.env.MARKETPLACE_CONTRACT_ADDRESS_BSC
);

let fromBlock = 0;
web3Eth.eth.getBlockNumber().then((data) => {
    // fromBlock = data;

    marketplaceEth.events.MarketItemCreated(
        {fromBlock: fromBlock, step: 0}
    ).on('data', async event => {
        let chain_id = 4;

        console.log('\nMarket Item Created');

        console.log("\nevent.returnValues:");
        console.log(event.returnValues);

        marketplaceBsc.methods.getMessageHash(chain_id, event.returnValues[0], event.returnValues[1], event.returnValues[2], event.returnValues[3], event.returnValues[4], event.returnValues[5], event.returnValues[6]).call()
            .then(function(messageHash) {
                console.log("\nmessageHash:");
                console.log(messageHash);

                let signatureObject = web3Eth.eth.accounts.sign(messageHash, process.env.MARKETPLACE_VALIDATOR_PRIVATE_KEY);

                console.log("\nsignature:");
                console.log(signatureObject.signature);

                marketplaceBsc.methods.verify(chain_id, event.returnValues[0], event.returnValues[1], event.returnValues[2], event.returnValues[3], event.returnValues[4], event.returnValues[5], event.returnValues[6], signatureObject.signature).call()
                    .then(function(verify) {
                        console.log("\nverify:");
                        console.log(verify);

                        // axios.post("https://ownly.tk/api/store-market-item", {
                        axios.post("http://ownly-api.test/api/store-market-item", {
                            chain_id: chain_id,
                            item_id: event.returnValues[0],
                            message_hash: messageHash,
                            signature: signatureObject.signature,
                            event: JSON.stringify(event)
                        }).then(data => {
                            console.log("\nstore-market-item:");
                            console.log(data.data);
                        }).catch(function(error) {
                            console.log(error)
                        });
                    });
            });

        // const { from, to, amount, date, nonce, signature } = event.returnValues;
        //
        // const tx = bridgeBsc.methods.mint(from, to, amount, nonce, signature);
        // const [gasPrice, gasCost] = await Promise.all([
        //   web3Bsc.eth.getGasPrice(),
        //   tx.estimateGas({from: admin}),
        // ]);
        // const data = tx.encodeABI();
        // const txData = {
        //   from: admin,
        //   to: bridgeBsc.options.address,
        //   data,
        //   gas: gasCost,
        //   gasPrice
        // };
        // const receipt = await web3Bsc.eth.sendTransaction(txData);
    });

    marketplaceEth.events.MarketItemPaidForOtherChain(
        {fromBlock: fromBlock, step: 0}
    ).on('data', async event => {

    });

    // marketplaceEth.events.MarketItemCancelled(
    //     {fromBlock: fromBlock, step: 0}
    // ).on('data', async event => {
    //   console.log('\nMarket Item Cancelled');
    // });

    console.log('Latest Block: ' + fromBlock);
    console.log('Running...');
});