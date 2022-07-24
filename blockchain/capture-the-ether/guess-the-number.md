---
description: >-
  In Capture the Ether's "Guess the number", we're tasked with a very simple
  exercise in reading and transacting with a smart contract.
---

# Guess the number

The goal of [this level](https://capturetheether.com/challenges/lotteries/guess-the-number/) is to correctly "guess" a number held in a state variable of the smart contract.

This level is somewhat of a warm up exercise, as the answer is plainly visible on line 4 of the contract:

```solidity
uint8 answer = 42;
```

We simply need to submit `42` via the contract's `guess` function and the level is complete. Note that the `guess` function also contains a `require(msg.value == 1 ether);` modifier, meaning we must also include a value of 1 ether in the transaction for the function to execute without reverting. When the answer is guessed correctly, the contract transfers its balance of 2 ether to the player's wallet.

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

  return { provider, playerWallet, playerWalletSigner, contract }
}

/**
 * Run contract exploit.
 */
async function main() {
  // Get Ethers objects needed to interact with the blockchain and contract
  const { contract: guessTheNumberChallengeContract } = await setup(
    'GuessTheNumberChallenge'
  )

  // Guess the number '42' by calling `guess` with 1 ether
  console.log('Guessing number 42...')
  const guess42 = await guessTheNumberChallengeContract.guess(42, {
    value: ethers.utils.parseEther('1.0')
  })
  await guess42.wait(1)

  // Confirm challenge completion
  console.log('Confirming challenge completion...')
  const challengeComplete = await guessTheNumberChallengeContract.isComplete()

  if (challengeComplete) {
    console.log('Challenge is complete!')
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
