try {
	const { kaspa, flux } = require("./config.json");
	const fs = require("fs");
	const { getKaspaTX } = require("./kaspa");
	const { getFluxTX } = require("./Flux");
	
	async function parseFlux(){
		try {
			for (let index = 0; index < flux.length; index++) {
				console.log(`Processing Flux Address ${flux[index]?.fluxAddress}  ... ${index+1} of ${flux.length}`)
				try {
					const response = await getFluxTX(flux[index]?.fluxAddress,`FluxMining-${flux[index]?.fluxAddress}.csv`);
				} catch (error) {
					console.log(`Error Processing Flux TX`);
				}
			}		
		} catch (error) {
			console.log(`Error Processing Flux Address`);
			console.error(error.message);
		}	
	}
	
	async function parseKaspa(){
		try {
			for (let index = 0; index < kaspa.length; index++) {
				console.log(`Processing Kaspa Address ${kaspa[index]?.kaspaAddress}  ... ${index+1} of ${kaspa.length}`)
				try {
					const response = await getKaspaTX(kaspa[index]?.kaspaAddress,`KaspaMining-${kaspa[index]?.kaspaAddress}.csv`);
				} catch (error) {
					console.log(`Error Processing Kaspa TX`);
				}
			}		
		} catch (error) {
			console.log(`Error Processing Kaspa Address`);
		}	
	}
	
	async function parseMining(){
		await parseKaspa();
		await parseFlux();
	}
	
	parseMining();
	
  } catch (err) {
	console.error('There was an error while reading the config file:', err.message);
	console.log(`Please ensure to follow the config file guidelines in the README`);
	process.exit(1); // gracefully exit the application
}