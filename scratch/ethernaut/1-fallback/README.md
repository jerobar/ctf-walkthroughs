# Ethernaut - Fallback

A full scripted solution is provided in index.js.

## Objectives

The goal of this level is to:

- Claim ownership of the contract.
- Reduce its balance to zero.

## Claiming Ownership

The contract owner is set in the constructor to the deploying address. There are only two sections of the contract in which the owner may be reassigned. The first, within the contribute function, is a dead end. This is because it requires the sender's contributions are greater than the owner's, while the constructor has set the owner's contribution to 1,000 ether (`contributions[msg.sender] = 1000 * (1 ether);`) and the contribute function limits each of the player's contributions to < 0.001 ether.

```solidity
function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if (contributions[msg.sender] > contributions[owner]) {
        owner = msg.sender;
    }
}
```

The second section of the code in which the contract owner may be reassigned is found within the receieve ("Receive Ether") function:

```solidity
receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
}
```

The receive function checks first that the value of the transaction is non-zero, and that the contributions of the sender address are non-zero, before assigning the owner to msg.sender. This means we may pass this require conditional by first sending a small transaction via the contribute function (< 0.001 ether), then by sending a transaction with any non-zero value to the contract address (with empty calldata to trigger the receive function).

## Reducing Balance to Zero

Once the owner address is set to the player's address, we may call the withdraw function directly as the require condition of the onlyOwner modifier is now satisfied.

```solidity
function withdraw() public onlyOwner {
    owner.transfer(address(this).balance);
}
```
