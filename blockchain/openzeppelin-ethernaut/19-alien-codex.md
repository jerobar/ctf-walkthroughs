# 19 - Alien Codex

### Hints

<details>

<summary>Hint One</summary>

How does one claim ownership of this contract, exactly? Where is the “owner” variable?

</details>

<details>

<summary>Hint Two</summary>

Does it seem like the contract author expects the functions record and retract to be called in a specific order?

</details>

<details>

<summary>Hint Three</summary>

After underflowing `codex.length` to its maximum value, what have you accomplished? Specifically, look at the `revise` function and make sure you understand exactly how it works. What would happen if you called `revise` with an index >= `codex.length` before performing the underflow? After? How are dynamic arrays laid out in storage?

</details>

<details>

<summary>Hint Four</summary>

The `contact` boolean and `_owner` address both fit in the same storage slot. How can you update this value via the `bytes32 _content` argument of the revise function?

</details>
