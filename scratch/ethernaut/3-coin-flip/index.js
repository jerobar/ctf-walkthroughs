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
  const contractAbi = fs.readFileSync("./CoinFlip.abi", "utf8");
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractAbi,
    walletSigner
  );

  // Wrap all in a for loop

  // Get hash of most recently mined block
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber); // maybe blockNumber - 1
  const blockHash = block.hash;
  console.log(`Hash of most recently mined block: ${blockHash}`);

  // Determine outcome of coin flip
  const FACTOR = BigInt(
    // 2^255
    57896044618658097711785492504343953926634992332820282019728792003956564819968
  );
  // console.log(Number(FACTOR / BigInt(blockHash)));
  const coinFlip = Number(FACTOR / BigInt(blockHash)) === 1 ? true : false;
  console.log(`Coin flip: ${coinFlip}`);

  // Guess coin flip

  // Check consecutive wins
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
