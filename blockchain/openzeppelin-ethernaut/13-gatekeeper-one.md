# 13 - Gatekeeper One

### Notes

In order to pass this level, we must meet the require conditions of each of three "gates". These conditions are:

#### **gateOne**

Requires `msg.sender` != `tx.origin`. This means we need to call the GatekeeperOne contract through a proxy contract.

#### **gateTwo**

Requires `gasLeft()` at the time of this instruction % 8191 == 0. This means we need to call the GatekeeperOne contract's `enter` function with an _exact_ gas amount.

We can determine how much gas has been used at this point in the program execution by using Remix's debugger to step through the code and counting the gas used by the various opcodes. We then need to supply this much gas, _plus_ enough gas such that the total is a factor of 8191. We'll need to deploy our own version of `GatekeeperOne` through Remix, making sure we use the same compiler version specified in the Ethernaut contract's `pragma` directive.

This means calling the contract with the gas value XX.

#### **gateThree**

Requires the following. Note that `_gateKey` is of type bytes8.

* The uint32 value of `_gateKey` is equal to the uint16 value of `_gateKey`.
* The uint32 value of `_gateKey` is not equal to the uint64 value of `_gateKey`.
* The uint32 value of `_gateKey` is equal to the uint16 value of `tx.origin`.

Let's look at how to meet these requirements.&#x20;

As `_gateKey` is of type bytes8, let's start with an array of eight bytes of 00:

**\_gateKey:** `0x 00 00 00 00 00 00 00 00`

First, let's consider how to ensure the uint32 value matches the uint16 of `tx.origin`. When we convert a uint value from a larger value, such as uint32, to a smaller value, such as uint16, we keep the bits on the _right_ side and lose the bits on the left. For example:

uint16(`0x 01 02 03 04`) == `0x 03 04`

So if the last 2 bytes (16 bits) of `_gateKey` were the last 2 bytes of `tx.origin` (represented as TT below), then we would have:

**\_gateKey:** `0x 00 00 00 00 00 00 TT TT`\
**uint32(\_gateKey):** `0x 00 00 TT TT`\
**uint16(tx.origin):** `0x TT TT`

And the uint32 and uint16 values are equal as the leading 0's are ignored.

We can satisfy the other two necessary conditions (uint32 **=**= uint16 of `_gateKey`and uint32 != uint64) by keeping some additional bits from `tx.origin` at the beginning:

**\_gateKey:** `0x TT TT TT TT 00 00 TT TT`\
**uint64(\_gateKey):** `0x TT TT TT TT 00 00 TT TT`\
**uint32(\_gateKey):** `0x 00 00 TT TT`\
**uint16(\_gateKey):** `0x TT TT`\
**uint16(tx.origin):** `0x TT TT`

The uint32 and uint64 values are not equal as there are non-zero bits at the beginning of the uint64 value that will not be included in the uint32 value.

We can calculate the `_gateKey` we've identified above from our `tx.origin` by using a bitmask, which is a value we can use in a bitwise AND operation with `tx.origin` to retain only those bits we want to keep and use 0 for the others:

**\_gateKey:** `tx.origin` ^ `0x FF FF FF FF 00 00 FF FF`

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IGatekeeperOne {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperOneExploit {
    IGatekeeperOne private _gatekeeperOneContract;
    bytes8 private _key;

    /**
     * Constructor sets the 'GatekeeperOne' contract address and calculates the
     * `_key` needed to pass its 'gateThree' modifier by running `msg.sender`
     * through bitmask '0xFFFFFFFF0000FFFF' to retain only the necessary bits.
     */
    constructor(address gatekeeperOneContractAddress) {
        _gatekeeperOneContract = IGatekeeperOne(gatekeeperOneContractAddress);
        _key = bytes8(uint64(uint160(msg.sender)) & 0xFFFFFFFF0000FFFF);
    }

    /**
     * Calls `enter` function on 'GatekeeperOne' contract with calculated
     * `_key`. Note that this function must be called with the appropriate gas
     * for the exploit to succeed.
     */
    function enter() external {
        _gatekeeperOneContract.enter(_key);
    }
}

```
