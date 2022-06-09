# Ethernaut - Fallout

A full scripted solution is provided in index.js.

## Objectives

The goal of this level is to:

- Claim ownership of the contract

## Claiming Ownership

The owner of this contract is set in its "constructor" function `Fal1out` and not reassigned elsewhere in the contract.

```solidity
/* constructor */
function Fal1out() public payable {
  owner = msg.sender;
  allocations[owner] = msg.value;
}
```

In some versions of Solidity prior to 0.4.21, a constructor could be defined by naming a function the same name as its contract. This contract, however, is being compiled as version 0.6.0 or higher, and therefor this "constructor" will not run when the contract is deployed.

```solidity
pragma solidity ^0.6.0;
```

Note that the function name also does not match the contract exactly as the function's second 'l' is actually the number 1.

The first address to call the Fal1out function will become the contract's owner.
