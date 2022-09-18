---
description: Capture the Ether's "Token sale" is the first of a series of math challenges.
---

# Token sale

In [this level](https://capturetheether.com/challenges/math/token-sale/), we are tasked with finding a way to sell more tokens than we can actually buy.

### Hints

<details>

<summary>Hint One</summary>

The vulnerability is an integer overflow in the contract’s buy function. The `numTokens` argument and transaction value are all you need to successfully exploit it.

</details>

<details>

<summary>Hint Two</summary>

Since the contract multiples `numTokens` \* 1 ether, you will need to submit a value for `numTokens` such that `numTokens` \* 10^18 is greater than the maximum value of a uint: (MAX\_UINT / 10^18) + 1. You will then need to determine by how much this value overflows and include the appropriate transaction value to “pay” for the tokens.

</details>

### Full Walkthrough

Coming soon...

### Scripted Solution

```
// Coming soon...
```
