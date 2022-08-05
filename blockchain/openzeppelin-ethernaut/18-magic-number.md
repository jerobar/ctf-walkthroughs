# 18 - Magic Number

### Scripted Solution

```javascript
const ethers = require('ethers')
require('dotenv').config({ path: './.env' })

/**
 * Initialize Ethers objects needed to interact with the blockchain and
 * contract.
 */
async function setup() {
  // Create provider - a read-only abstraction to access blockchain data
  const provider = new ethers.providers.InfuraProvider(process.env.NETWORK)
  // Create player wallet
  const playerWallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  // Create player wallet signer - an abstraction of an Ethereum account
  const playerWalletSigner = await playerWallet.connect(provider)

  return { provider, playerWallet, playerWalletSigner }
}

/**
 * Run contract exploit.
 */
async function main() {
  // Get Ethers objects needed to interact with the blockchain and contract
  const { playerWalletSigner } = await setup()

  console.log('Deploying contract from raw bytecode...')
  const deployContractTx = await playerWalletSigner.sendTransaction({
    data: '0x600a600c600039600a6000f3604260805260206080f3'
  })

  console.log(deployContractTx)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
