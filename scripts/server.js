const Web3 = require('web3');
const express = require('express')
const app = express()
const port = 8080

require('dotenv').config();

const web3 = new Web3(process.env.RPC_URL_ETH);

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
