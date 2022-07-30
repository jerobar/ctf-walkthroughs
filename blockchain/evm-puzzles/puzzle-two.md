# Puzzle Two

Enter the value to send.

### Bytecode

```
00      34      CALLVALUE
01      38      CODESIZE
02      03      SUB
03      56      JUMP
04      FD      REVERT
05      FD      REVERT
06      5B      JUMPDEST
07      00      STOP
08      FD      REVERT
09      FD      REVERT
```

### Walkthrough

#### Step 00

`CALLVALUE` - Pushes the transaction value in wei onto the stack:

Stack: \[CALLVALUE]

#### Step 01

`CODESIZE` - Pushes the number of instructions in the currently running onto the stack. In the case of a `PUSH` instruction, the bytes that need to be pushed are encoded after that. In the case of this code, the code size is 10.

Stack: \[CODESIZE (10), CALLVALUE]

#### Step 02

`SUB` - Subtract the second value off the top of the stack from the first, pushing the result onto the stack.

Stack: \[CODESIZE (10) - CALLVALUE]

#### Step 03

`JUMP` - Advances the program counter to the location identified by the value at the top of the stack. In this case, that value is determined by the CODESIZE (10) - CALLVALUE.

#### Steps 04 & 05

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions.

#### Steps 06 & 07

`JUMPDEST` - A location a `JUMP` code can advance the program execution to. `STOP` signals the end of the code execution - our goal is to advance to this instruction.

#### Steps 08 & 09

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions.

### Solution

We want to set the program counter to the `JUMPDEST` at location 06. As this value is the CODESIZE (10) - CALLVALUE, we can achieve this by supplying the value 4.
