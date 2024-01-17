const axios = require("axios");
const fs = require("fs");
const { scanStart, scanEnd, flux_exclude_list } = require("./config.json");

let flux_tx_data = [];
let total = 0;

async function getFluxTX(address, filename) {
  flux_tx_data = [];
  try {
    const response = await axios.get(`https://api.runonflux.io/explorer/transactions?address=${address}`, {
      timeout: 2500,
    });
    response.data.data.forEach((entry) => {
      flux_tx_data.push(entry.txid);
    });
    await fluxTX(address, filename);
    return total;
  } catch (error) {
    console.log(error.message);
    return 0;
  }
}

async function fluxTX(address, fluxFileName) {
  let flux_year_pricing = await getFluxPrice();
  let flux_tx_price = 0;
  let flux_total = 0;
  let flux_yield = 0;
  const stream = fs.createWriteStream(fluxFileName);
  stream.write(`Date Block Mined, Coin Yield, USD Mined, USD Mined Total\n`);
  for (let i = 0; i < flux_tx_data.length; i++) {
    const tx_response = await axios.get(`https://explorer.runonflux.io/api/tx/${flux_tx_data[i]}`, {
      timeout: 5000,
    });
    vouts = tx_response?.data?.vout;
    vin = tx_response?.data?.vin;
    if (!flux_exclude_list?.includes(vin[0]?.addr) ?? true) {
      for (let j = 0; j < vouts.length; j++) {
        try {
          if (vouts[j]?.scriptPubKey?.addresses.includes(address) && vouts[j]?.value < 7500) {
            flux_tx_price = await findTxPrice(flux_year_pricing, tx_response?.data?.blocktime * 1000);
            if (flux_tx_price != 1000000) {
              const date = new Date(tx_response.data.blocktime * 1000);
              flux_total += vouts[j].value * flux_tx_price;
              flux_yield += parseFloat(vouts[j].value);
              console.log(`Processing Transactions ... ${i + 1} of ${flux_tx_data.length}`);
              stream.write(`${date.toLocaleString()}, ${vouts[j].value}, ${(vouts[j].value * flux_tx_price).toFixed(2)}, ${flux_total.toFixed(2)}\n`);
              console.log(`Flux Mined - ${vouts[j].value} - USD Value ${(vouts[j].value * flux_tx_price).toFixed(2)} - on ${date.toLocaleDateString()}`);
            } else {
              console.log(`Skipping Transaction ... ${i + 1} of ${flux_tx_data.length}`);
            }
            break;
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    } else {
      console.log(`vin address: ${vin[0].addr} part of exclude list`);
    }
  }
  console.log(`Total Flux Yield - ${flux_yield.toFixed(2)}`);
  console.log(`Total Flux USD - ${flux_total.toFixed(2)}`);
}

async function getFluxPrice() {
  const flux_price = await axios.get(`https://api.coingecko.com/api/v3/coins/zelcash/market_chart/range?vs_currency=usd&from=${scanStart}&to=${scanEnd}}&precision=10`);
  return flux_price?.data?.prices;
}

function findTxPrice(priceList, block) {
  if (block > priceList[priceList.length - 1][0] || block < priceList[0][0]) return 1000000;
  for (let index = 0; index < priceList.length; index++) {
    if (priceList[index][0] >= block) {
      return priceList[index][1];
    }
  }
  return 1000000;
}

module.exports = {
  getFluxTX,
};
