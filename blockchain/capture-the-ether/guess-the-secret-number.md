---
description: >-
  In Capture the Ether's "Guess the secret number" we learn that just because
  something has been hashed doesn't mean it will remain a secret.
---

# Guess the secret number

Once again, [this level](https://capturetheether.com/challenges/lotteries/guess-the-secret-number/) asks us to guess the value of a "hidden" variable to complete the challenge.

### Hints

<details>

<summary>Hint One</summary>

The hash itself can't be reversed, but is it possible to work in the opposite direction? How many possible values of a `uint8` could there really be, anyway?

</details>

### Full Walkthrough

We see in reviewing the contract that we are provided with the keccak256 hash of the answer, and asked to submit our guess as a `uint8` (that is the type of the argument of the `guess` function). This may seem like a perfectly secure way to obfuscate data, as the keccak256 hash cannot be reversed. However, the fault lies in the very property that gives hashing functions their value. While they're impossible to reverse, hash functions are easy to run _forwards_. That is, if we could narrow the space of possibilities down enough for our input, it would be trivial to brute force the matching hash.

Luckily, as the answer is of type `uint8`, there are only 256 possible solutions (0 - 255). We can brute force the correct answer by looping through each possibility and taking its keccak256 hash, then submitting the result. Ethers.js provides a utility function for just this purpose.

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

// Brute force answer from hash
function getAnswer(hash) {
  for (let i = 0; i < 256; i++) {
    if (ethers.utils.keccak256(i) == hash) return i
  }
}

/**
 * Run contract exploit.
 */
async function main() {
  // Get Ethers objects needed to interact with the blockchain and contract
  const { contract: guessTheSecretNumberChallengeContract } = await setup(
    'GuessTheSecretNumberChallenge'
  )
  const ANSWER_HASH =
    '0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365'

  // Brute force the uint8 value that matches the answer hash
  const answer = getAnswer(ANSWER_HASH)

  // Guess the answer by calling the contract with 1 ether
  console.log(`Guessing number: ${answer}`)
  const guessAnswer = await guessTheSecretNumberChallengeContract.guess(
    answer,
    {
      gasPrice: 20000000000,
      value: ethers.utils.parseEther('1.0')
    }
  )
  await guessAnswer.wait(1)

  // Confirm challenge completion
  console.log('Confirming challenge completion...')
  const challengeComplete =
    await guessTheSecretNumberChallengeContract.isComplete()

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
