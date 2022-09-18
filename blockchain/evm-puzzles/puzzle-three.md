# Puzzle Three

Enter the calldata.

### Hints

<details>

<summary>Hint One</summary>

You want to set the program counter to `0x04`, which means you need to supply a calldata with a total size of 4 bytes.

</details>

### Bytecode

```
00      36      CALLDATASIZE
01      56      JUMP
02      FD      REVERT
03      FD      REVERT
04      5B      JUMPDEST
05      00      STOP
```

### Walkthrough

#### Step 00

`CALLDATASIZE` - The size in bytes of the calldata.

Stack: \[CALLDATASIZE]

#### Step 01

`JUMP` - Advances the program counter to the location identified by the value at the top of the stack. In this case, that value is the size of the calldata in bytes.

Stack: \[CALLDATASIZE]

#### Steps 02 & 03

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions.

#### Steps 04 & 05

`JUMPDEST` - A location a `JUMP` code can advance the program execution to. `STOP` signals the end of the code execution - our goal is to advance to this instruction.

### Solution

We want to set the program counter to 04, which means we need to supply a calldata with a size of 4 bytes. We could supply e.g.: `0xffffffff`.
