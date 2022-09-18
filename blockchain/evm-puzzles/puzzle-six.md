# Puzzle Six

Enter the calldata.

### Hints

<details>

<summary>Hint One</summary>

Your calldata needs to contain a specific value at offset `0x00`.

</details>

### Bytecode

```
00      6000      PUSH1 00
02      35        CALLDATALOAD
03      56        JUMP
04      FD        REVERT
05      FD        REVERT
06      FD        REVERT
07      FD        REVERT
08      FD        REVERT
09      FD        REVERT
0A      5B        JUMPDEST
0B      00        STOP
```

### Walkthrough

#### Step 00

`PUSH1 00` - Pushes a 1 byte value (in this case `00` in hexidecimal).

Stack: \[0x00]

#### Step 02

`CALLDATALOAD` - Loads the calldata of the current environment at the byte offset given by the first number off the top of the stack.

Stack: \[CALLDATA at offset 0x00]

#### Step 03

`JUMP` - Advances the program counter to the location identified by the value at the top of the stack.

Stack: \[CALLDATA at offset 0x00]

#### Steps 04 - 09

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions

#### Steps 10 (0A) & 11 (0B)

`JUMPDEST` - A location a `JUMP` code can advance the program execution to. `STOP` signals the end of the code execution - our goal is to advance to this instruction.

### Solution

We want to `JUMP` to 0A from step 03, so we need the calldata to contain 0A at offset 0x00 (0 bytes from the right). We can achieve this by supplying: `0x000000000000000000000000000000000000000000000000000000000000000A`.
