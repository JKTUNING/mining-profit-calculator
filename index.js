try {
  const { kaspa, flux, scanStart, scanEnd } = require("./config.json");
  const { getKaspaTX } = require("./kaspa");
  const { getFluxTX } = require("./flux");

  async function parseFlux() {
    try {
      for (let index = 0; index < flux.length; index++) {
        console.log(`Processing Flux Address ${flux[index]?.fluxAddress}  ... ${index + 1} of ${flux.length}`);
        try {
          const response = await getFluxTX(flux[index]?.fluxAddress, `FluxMining-${flux[index]?.fluxAddress}.csv`);
          console.log(`Total Flux: ${response}`);
        } catch (error) {
          console.log(`Error Processing Flux TX`);
        }
      }
    } catch (error) {
      console.log(`Error Processing Flux Address`);
      console.error(error.message);
    }
  }

  async function parseKaspa() {
    try {
      for (let index = 0; index < kaspa.length; index++) {
        console.log(`Processing Kaspa Address ${kaspa[index]?.kaspaAddress}  ... ${index + 1} of ${kaspa.length}`);
        try {
          const response = await getKaspaTX(kaspa[index]?.kaspaAddress, `KaspaMining-${kaspa[index]?.kaspaAddress}.csv`);
          console.log(`Total Flux: ${response}`);
        } catch (error) {
          console.log(`Error Processing Kaspa TX`);
        }
      }
    } catch (error) {
      console.log(`Error Processing Kaspa Address`);
    }
  }

  async function parseMining() {
    await parseKaspa();
    await parseFlux();
  }
  if (scanEnd && scanStart) {
    parseMining();
  } else {
    console.log("Please define scanStart and scanEnd timestamp in msec");
    console.log(`Please ensure to follow the config file guidelines in the README`);
    process.exit(1);
  }
} catch (err) {
  console.error("There was an error while reading the config file:", err.message);
  console.log(`Please ensure to follow the config file guidelines in the README`);
  process.exit(1); // gracefully exit the application
}
