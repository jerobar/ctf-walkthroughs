# Puzzle Five

Enter the value to send.

### Hints

<details>

<summary>Hint One</summary>

This problem hinges on getting the `EQ` in step `0x06` to evaluate to true.

</details>

### Bytecode

```
00      34          CALLVALUE
01      80          DUP1
02      02          MUL
03      610100      PUSH2 0100
06      14          EQ
07      600C        PUSH1 0C
09      57          JUMPI
0A      FD          REVERT
0B      FD          REVERT
0C      5B          JUMPDEST
0D      00          STOP
0E      FD          REVERT
0F      FD          REVERT
```

### Walkthrough

#### Step 00

`CALLVALUE` - Pushes the transaction value in wei onto the stack:

Stack: \[CALLVALUE]

#### Step 01

`DUP1` - Duplicates first stack item and pushes it onto the stack.

Stack: \[CALLVALUE, CALLVALUE]

#### Step 02

`MUL` - Multiply first two items off the top of the stack and replace them with the product.

Stack: \[CALLVALUE \* CALLVALUE]

#### Step 03

`PUSH2 0100` - Pushes a 2 byte value (in this case `0100` in hexidecimal or 256 in decimal) to the top of the stack.

Stack: \[0x0100, CALLVALUE \* CALLVALUE]

#### Step 06

`EQ` - Equality comparison of first two items off the top of the stack.

Stack: \[(0x0100) == (CALLVALUE \* CALLVALUE)]

#### Step 07

`PUSH1 0C` - Pushes a 1 byte value (in this case `0C` in hexidecimal or 12).

Stack: \[0x0C, (0x0100) == (CALLVALUE \* CALLVALUE)]

#### Step 09

`JUMPI` - Sets the program counter to the first value off the top of the stack if and only if the second value off the top of the stack is a boolean true. In this case, it will advance the program counter to step `0C` iff our CALLVALUE \* CALLVALUE == 0x0100 (256).

Stack: \[0x0C, (0x0100) == (CALLVALUE \* CALLVALUE)]

#### Steps 10 (0A) & 11 (0B)

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions.

#### Steps 12 (0C) & 13 (0D)

`JUMPDEST` - A location a `JUMP` code can advance the program execution to. `STOP` signals the end of the code execution - our goal is to advance to this instruction.

#### Steps 14 (0E) & 15 (0F)

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions.

### Solution

This problem hinges on getting the `EQ` in step 06 to evaluate to true. This means that our calldata times itself must be equal to 256. We can achieve this by supplying the value 16.
