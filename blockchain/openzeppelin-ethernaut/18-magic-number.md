# 18 - Magic Number

### Hints

<details>

<summary>Hint One</summary>

This challenge is solved by deploying a contract written in raw bytecode and you will not be able to use Remix to do so. Hints two and three are about this bytecode and hint four is about how to deploy it.

</details>

<details>

<summary>Hint Two</summary>

Your contract’s runtime bytecode will need to accomplish the following:

* Store 0x2A (hexadecimal value of 42) in a memory slot. Return 0x2A from this memory slot.

<!---->

* Useful opcodes: `PUSH1`, `MSTORE`, `RETURN`.

Your initialization bytecode, that is, the contract bytecode you will actually deploy in a transaction, will need to replicate these runtime opcodes in memory before returning them to the EVM. The EVM then saves these runtime opcodes to the blockchain.

</details>

<details>

<summary>Hint Three</summary>

The bytecode you deploy should look something like this:

`0x600a600c600039600a6000f3604260805260206080f3`

**Initialization**

`600A PUSH1 0x0A` - Push 10 (Size of runtime opcodes in bytes) 600C

`PUSH1 0x0C` - Push 12 (Byte offset of runtime opcodes - **after** these initialization opcodes)

`6000 PUSH1 0x00` - Push (memory slot) 0x00&#x20;

`39 CODECOPY` - Copy to 0x00 opcodes starting at 0xCA (10 bytes)

`600A PUSH1 0x0A` - Push 10 (Size of runtime opcodes in bytes) 6000

`PUSH1 0x00` - Push (memory slot) 0x00 f3&#x20;

`RETURN` - Return from memory slot 0x00 10 bytes (runtime opcodes)

**Runtime**

`602A PUSH1 0x2A` - Push 42&#x20;

`6080 PUSH1 0x80` - Push (memory slot)&#x20;

`0x80 52 MSTORE` - Store 42 at memory slot 0x80

`6020 PUSH1 0x20` - Push 32&#x20;

`6080 PUSH1 0x80` - Push (memory slot) 0x80&#x20;

`F3 RETURN` - Return from memory slot 0x80 32 bytes (value 42)

</details>

<details>

<summary>Hint Four</summary>

You will need to deploy your contract bytecode using a library such as Ethers or Web3. How does an Ethereum node know when a given transaction is deploying a contract?

</details>

### Scripted Solution

```javascript
const ethers = require('ethers')
require('dotenv').config({ path: './.env' })

/**
 * Initialize Ethers objects needed to interact with the blockchain and
 * contract.
 */
async function setup() {
  // Create provider - a read-only abstraction to access blockchain data
  const provider = new ethers.providers.InfuraProvider(process.env.NETWORK)
  // Create player wallet
  const playerWallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  // Create player wallet signer - an abstraction of an Ethereum account
  const playerWalletSigner = await playerWallet.connect(provider)

  return { provider, playerWallet, playerWalletSigner }
}

/**
 * Run contract exploit.
 */
async function main() {
  // Get Ethers objects needed to interact with the blockchain and contract
  const { playerWalletSigner } = await setup()

  console.log('Deploying contract from raw bytecode...')
  const deployContractTx = await playerWalletSigner.sendTransaction({
    data: '0x600a600c600039600a6000f3602A60805260206080f3'
  })

  console.log(deployContractTx)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
