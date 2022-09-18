# Puzzle One

Enter the value to send.

### Bytecode

```
00      34      CALLVALUE
01      56      JUMP
02      FD      REVERT
03      FD      REVERT
04      FD      REVERT
05      FD      REVERT
06      FD      REVERT
07      FD      REVERT
08      5B      JUMPDEST
09      00      STOP
```

### Walkthrough

#### Step 00

`CALLVALUE` - Pushes the transaction value in wei onto the stack:

Stack: \[CALLVALUE]

#### Step 01

`JUMP` - Sets the program counter to the current value at the top of the stack (in this case, the value of `CALLVALUE`). This has the effect of making the next step in the program execution the opcode at this location.

Stack: \[CALLVALUE]

#### Steps 02 - 07

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions.

Stack: \[CALLVALUE]

#### Steps 08 & 09

`JUMPDEST` - A location a `JUMP` code can advance the program execution to. `STOP` signals the end of the code execution - our goal is to advance to this instruction.

Stack: \[CALLVALUE]

### Solution

We want to provide a value that will allow the `JUMP` instruction at step 01 to advance the program to step 08. Because `JUMP` uses the value currently at the top of the stack, which is set in step 00 to our call value, we can achieve this goal by providing the value 8.

