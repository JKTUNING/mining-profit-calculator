const axios = require("axios");
const fs = require("fs");

let tx_data = [];
let pricing = [];
let total = 0;

async function getKaspaTX(address,outFile) {
    tx_data = [];
    try {
        const response = await axios.get(
            `https://api.kaspa.org/addresses/${address}/full-transactions?limit=100&offset=0&fields=outputs%2Cblock_time&resolve_previous_outpoints=no`
        );
        response.data.forEach((entry) => {
            entry.outputs.forEach((tx) => {
                if (tx.script_public_key_address === `${address}`) {
                    tx_data.push([
                        entry?.block_time,
                        (tx?.amount / 100000000).toFixed(2),
                    ]);
                }
            });
        });
        await getKaspaPricing(outFile);
        return total;
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

async function getKaspaPricing(filename) {
    pricing = [];
    total = 0;
    try {
        const response = await axios.get(
            "https://www.coingecko.com/price_charts/25751/usd/max.json"
        );
        pricing = response?.data?.stats;
        let count = 0;
        const stream = fs.createWriteStream(filename);
        stream.write(`Date Block Mined,Coin Yield,Price Mined,USD Total\n`);
        for (let i = 0; i < tx_data.length; i++) {
            for (let j = 0; j < pricing.length; j++) {
                if (pricing[j][0] >= tx_data[i][0]) {
                    const date = new Date(tx_data[i][0]);
                    tx_data[i].push(pricing[j][1] * tx_data[i][1]);
                    total += pricing[j][1] * tx_data[i][1];
                    stream.write(
                        `${date.toLocaleString()},${tx_data[i][1]},${
                            pricing[j][1] * tx_data[i][1]
                        },${total}\n`
                    );
                    count++;
                    break;
                }
            }
        }
        console.log(`Number of TX - ${count}`);
        console.log(`Total in USD - ${total}`);
        return pricing;
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

module.exports = {
    getKaspaTX,
    getKaspaPricing
}
