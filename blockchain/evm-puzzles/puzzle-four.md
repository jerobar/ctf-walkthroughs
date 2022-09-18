# Puzzle Four

Enter the value to send.

### Bytecode

```
00      34      CALLVALUE
01      38      CODESIZE
02      18      XOR
03      56      JUMP
04      FD      REVERT
05      FD      REVERT
06      FD      REVERT
07      FD      REVERT
08      FD      REVERT
09      FD      REVERT
0A      5B      JUMPDEST
0B      00      STOP
```

### Walkthrough

#### Step 00

`CALLVALUE` - Pushes the transaction value in wei onto the stack:

Stack: \[CALLVALUE]

#### Step 01

`CODESIZE` - Pushes the number of instructions in the currently running onto the stack. In the case of a `PUSH` instruction, the bytes that need to be pushed are encoded after that. In the case of this code, the code size is 12.

Stack: \[CODESIZE (12), CALLVALUE]

#### Step 02

`XOR` - Performs a bitwise Exclusive OR operation on the first two values on the top of the stack, replacing them with the result.

Stack: \[CODESIZE (12) ^ CALLVALUE]

#### Step 03

`JUMP` - Advances the program counter to the location identified by the value at the top of the stack. In this case, that value is determined by the XOR of CODESIZE (12) and CALLVALUE.

#### Steps 04 - 09

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions.

#### Steps 10 (0A) & 11 (0B)

`JUMPDEST` - A location a `JUMP` code can advance the program execution to. `STOP` signals the end of the code execution - our goal is to advance to this instruction.

### Solution

We want the `JUMP` at location 03 to set the program counter to 10. This means the result of the XOR between CODESIZE (12 or `1100`) and CALLVALUE must be 10 (or `1010`).

Note that an XOR operation results in 1 if and only if exactly 1 of the two inputs is a 1, otherwise will result in 0.

`1100` ^ ???? = `1010`

The answer is `0110` or 6.
