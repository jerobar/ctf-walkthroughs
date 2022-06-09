# Ethernaut - Coin Flip

A full scripted solution is provided in index.js.

## Objectives

The goal of this level is to:

- Guess the correct outcome of the coin flip 10 times in a row

## Guessing the Outcome

The contract's `flip` function is responsible for simulating the outcome of the coin flip (as a boolean) and checking it against the user's `_guess`. The issue with the way this feature has been implemented is that the outcome of the flip is purely a function of the hash of the last mined block, a public variable accessible to any user prior to them making their guess. Comments added to the snippet below for clarification.

```solidity
function flip(bool _guess) public returns (bool) {
  // This variable is publicly known prior to the contract being called
  uint256 blockValue = uint256(blockhash(block.number.sub(1)));

  // The rest of the math below doesn't really matter, the coin flip is
  // purely a function of the blockValue variable above.

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

It is trivial to calculate the results of the flip above from the most recently mined block hash prior to making a guess and therefor win every round.
