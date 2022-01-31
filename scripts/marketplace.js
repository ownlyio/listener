const Web3 = require('web3');
const axios = require('axios');
require('dotenv').config();

const web3Eth = new Web3('wss://eth-rinkeby.alchemyapi.io/v2/LIs_rn4wGgjNHSGr9OV6ElmdpCqHDxJ2');
// const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
// const { address: admin } = web3Eth.eth.accounts.wallet.add(process.env.MARKETPLACE_VALIDATOR_PRIVATE_KEY);

const marketplaceEth = new web3Eth.eth.Contract(
    [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"MarketItemCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":true,"internalType":"address","name":"nftContract","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"string","name":"currency","type":"string"},{"indexed":false,"internalType":"uint256","name":"listingPrice","type":"uint256"}],"name":"MarketItemCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"MarketItemSold","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[{"internalType":"address","name":"_contractAddress","type":"address"},{"internalType":"address","name":"_owner","type":"address"}],"name":"addNftFirstOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"cancelMarketItem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"a","type":"string"},{"internalType":"string","name":"b","type":"string"}],"name":"compareStrings","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"nftContractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"currency","type":"string"}],"name":"createMarketItem","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"string","name":"currency","type":"string"}],"name":"createMarketSale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"nftContractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"fetchMarketItem","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"owner","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"currency","type":"string"},{"internalType":"uint256","name":"listingPrice","type":"uint256"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct MarketplaceEth.MarketItem","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fetchMarketItems","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"owner","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"currency","type":"string"},{"internalType":"uint256","name":"listingPrice","type":"uint256"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct MarketplaceEth.MarketItem[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fetchMyNFTs","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"owner","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"currency","type":"string"},{"internalType":"uint256","name":"listingPrice","type":"uint256"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct MarketplaceEth.MarketItem[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getListingPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketItemId","type":"uint256"}],"name":"getMarketItem","outputs":[{"components":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"owner","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"currency","type":"string"},{"internalType":"uint256","name":"listingPrice","type":"uint256"},{"internalType":"bool","name":"cancelled","type":"bool"}],"internalType":"struct MarketplaceEth.MarketItem","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contractAddress","type":"address"}],"name":"getNftFirstOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_listingPrice","type":"uint256"}],"name":"setListingPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}],
    process.env.MARKETPLACE_CONTRACT_ADDRESS_ETH
);

let fromBlock = 0;
web3Eth.eth.getBlockNumber().then((data) => {
  // fromBlock = data;

  marketplaceEth.events.MarketItemCreated(
      {fromBlock: fromBlock, step: 0}
  ).on('data', async event => {
    console.log(event);

    console.log('\nMarket Item Created');

    console.log("\nevent:");
    console.log(event);

    let message = event.returnValues[0] + " " + event.returnValues[1] + " " + event.returnValues[2] + " " + event.returnValues[3] + " " + event.returnValues[4] + " " + event.returnValues[5] + " " + event.returnValues[6];

    let signatureObject = web3Eth.eth.accounts.sign(message, process.env.MARKETPLACE_VALIDATOR_PRIVATE_KEY);

    console.log("\nsignature:");
    console.log(signatureObject.signature);

    let recovered = web3Eth.eth.accounts.recover(message, signatureObject.signature);

    console.log("\nrecovered:");
    console.log(recovered);

    axios.post("https://ownly.tk/api/store-market-item", {
      item_id: event.returnValues[0],
      message: message,
      signature: signatureObject.signature
    }).then(data => {
      console.log("\nstore-market-item:");
      console.log(data);
    }).catch(function(error) {
      console.log(error)
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

  marketplaceEth.events.MarketItemCancelled(
      {fromBlock: fromBlock, step: 0}
  ).on('data', async event => {
    console.log('\nMarket Item Cancelled');
  });

  console.log('Latest Block: ' + fromBlock);
  console.log('Running...');
});