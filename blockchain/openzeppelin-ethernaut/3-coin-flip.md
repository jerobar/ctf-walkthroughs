---
description: >-
  In Ethernaut's Coin Flip, we're introduced to the problem of randomness on a
  public, deterministic blockchain.
---

# 3 - Coin Flip

The goal of [this level](https://ethernaut.openzeppelin.com/level/0x4dF32584890A0026e56f7535d0f2C6486753624f) is to guess the correct outcome of the contract's "coin flip" 10 times in a row.

### Hints

<details>

<summary>Hint One</summary>

If the contract's `flip` function were truly random, this level would be impossible. How, exactly, does it determine the outcome of the coin flip? How could we use this knowledge to improve our guesses?

</details>

<details>

<summary>Hint Two</summary>

The outcome of each coin flip is purely a function of the hash of the last mined block. The hash is divided by a constant `FACTOR` and whether this quotient `== 1` determines the result. We will need to script the calculation of this value ourselves prior to each "guess" transaction. This may even be implemented in a smart contract of our own!

</details>

### Full Walkthrough

The contract's `flip` function is responsible for simulating the outcome of the coin flip (a boolean) and checking it against the user's `_guess`. The issue with the way this feature has been implemented is that the outcome of the flip is purely a function of the hash of the last mined block, a public variable accessible to any user prior to them making their guess. Comments have been added to the contract snippet below for clarity.

```solidity
function flip(bool _guess) public returns (bool) {
  // This variable is publicly knowable prior to the function being called
  uint256 blockValue = uint256(blockhash(block.number.sub(1)));

  // The rest of the code below is incidental, the coin flip is purely a 
  // function of the (known) 'blockValue' variable above.

  if (lastHash == blockValue) {
    revert();
  }

  lastHash = blockValue;
  uint256 coinFlip = blockValue.div(FACTOR);
  bool side = coinFlip == 1 ? true : false;

  if (side == _guess) {
    consecutiveWins++;
    return true;
  } else {
    consecutiveWins = 0;
    return false;
  }
}
```

As we can determine the `blockValue` before calling the contract's `flip` function, we simply need to implement our own matching flip function to calculate our "guess" in advance of each transaction.

{% hint style="info" %}
**How does the math work?**

Coming soon...
{% endhint %}

### Scripted Solution

```javascript
// Some code
```

### Key Takeaways

* Generating sufficiently random data is a challenge on a _**deterministic**_** blockchain** and is a problem best left to industry standard solutions like the Chainlink oracle's "Verifiable Random Function".
* Smart contracts on public blockchains are auditable by anyone. Any attempts to hide clever tricks in a contract's code are therefor ultimately futile.
