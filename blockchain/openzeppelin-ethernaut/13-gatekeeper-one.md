# 13 - Gatekeeper One

### Hints

<details>

<summary>Hint One</summary>

This challenge consists of two main components. The first is determining what to submit as the `_gateKey` to pass the `gateThree` modifier, and the second is determining how much gas to submit along with your transaction to pass the `gateTwo` modifier. At this point, how to pass `gateOne` should not be a mystery. The `gateThree` modifier will be covered in the next hints.

</details>

<details>

<summary>Hint Two</summary>

See below.

</details>

<details>

<summary><strong>Hint Three</strong></summary>

See below.

</details>

<details>

<summary><strong>Hint Four</strong></summary>

Once you have a working `_gateKey`, the remaining challenge is to determine how much gas to send along with the transaction to enter such that the `gateTwo` modifier passes. Note that the `gasLeft()` function returns the gas left at the time the function is called, which means you need to know how much gas has been used from your transaction at that exact point in the code execution. There are really two approaches to solving this problem: brute forcing the gas by calling `enter` in a loop with an incrementing gas amount, or by using e.g. the Remix debugger to have a closer look at how the contract uses its gas. The former approach can be found in a number of tutorials online.

If you choose to use the Remix debugger to determine how much gas to send, keep in mind that what you are looking for is the value returned by the `gasLeft()` function call. This value (in hexadecimal!) can be found on the stack at the time the `MOD` opcode is executed. The other value on the top of the stack at this time will be the hexadecimal representation of 8191.

</details>

#### Hint Two

The `gateThree` modifier requires the `_gateKey` satisfy the following conditions. Note that `_gateKey` is of type **bytes8**:

* The uint32 value of `_gateKey` is equal to the uint16 value of `_gateKey`.
* The uint32 value of `_gateKey` is not equal to the uint64 value of `_gateKey`.
* The uint32 value of `_gateKey` is equal to the uint16 value of `tx.origin`.

Picture `_gateKey` as an array of 8 bytes (64 bits): 0x 00 00 00 00 00 00 00 00. When a larger uint value is converted into a smaller one, we keep the bytes at the end of the value and discard the leftmost bytes:

* **uint64(\_gateKey):** 0x 00 11 22 33 44 55 66 77
* **uint32(\_gateKey):** 0x 44 55 66 77
* **uint16(\_gateKey):** 0x 66 77

As the leading 00 values are ignored, we could satisfy the “uint32 is equal to the uint16” condition by ensuring the 5th and 6th bytes are zeros like this:

* **uint64(\_gateKey):** 0x 00 11 22 33 00 00 66 77
* **uint32(\_gateKey):** 0x 00 00 66 77
* **uint16(\_gateKey):** 0x 66 77

#### Hint Three

You may notice how we could satisfy the “uint32 value of `_gateKey` is equal to the uint16 value of `tx.origin`” condition by simply ensuring the bytes “66 77” above were the last two bytes of `tx.origin`. We’ll label those “TO” for clarity:

* **uint64(\_gateKey):** 0x 00 11 22 33 00 00 **TO TO**
* **uint32(\_gateKey):** 0x 00 00 **TO TO**
* **uint16(tx.origin):** 0x **TO TO**

Note that the last condition of “uint32 value of `_gateKey` is not equal to the uint64 value of `_gateKey`” is also already satisfied in our example because the uint64 value has non-zero bytes that the uint32 doesn’t contain, and is therefore a different number.

You should now see how to construct a `_gateKey` from `tx.origin`. Note that this can be accomplished programmatically in a contract by using a bitmask like so:

`_gateKey = bytes8(uint64(uint160(msg.sender)) & 0xFFFFFFFF0000FFFF);`

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
