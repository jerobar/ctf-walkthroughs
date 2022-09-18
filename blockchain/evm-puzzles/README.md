---
description: fvictorio’s EVM Puzzles.
---

# EVM puzzles

A collection of low-level EVM puzzles:

[https://github.com/fvictorio/evm-puzzles/](https://github.com/fvictorio/evm-puzzles/)

### Hints - All

* Each of these challenges is solved by ensuring the correct values exist on the stack at the time a `JUMP` or `JUMPI` opcode is executed. It may help to work backwards from there if you get stuck.
* Most puzzles will involve you learning about a new opcode or two. Consult [https://www.evm.codes/](https://www.evm.codes/) and take note of what their arguments are (what they take off the stack and in what order) and what they return. Before beginning puzzle 1, it may be useful to review: `JUMP`, `REVERT`, `JUMPDEST`, and `STOP`.
* It may be helpful to write out the state of the stack as you step through each instruction, using placeholders for values you’re unsure of.
