# Puzzle Seven

Enter the calldata.

### Hints

<details>

<summary>Hint One</summary>

This puzzle involves submitting the initialization code of your own contract. It is a significant step up in difficulty from the first six puzzles.

You need the `EQ` comparison in step `0x0E` to evaluate to true, which means you need the `BYTECODESIZE` of the deployed contract to be equal to `0x01`. You must therefore send in the calldata the initialization code for a contract that will return a code of this byte size.

</details>

<details>

<summary>Hint Two</summary>

The following is an incomplete implementation of the bytecode needed to solve this puzzle:

`6001 PUSH1 0x01` (0x01 is the value we ultimately want to return)&#x20;

`60?? PUSH1 ????` (first argument of the MSTORE opcode below)&#x20;

`52 MSTORE`

`60?? PUSH1 ????` (size argument of RETURN opcode below)&#x20;

`601F PUSH1 0x1F` (offset argument of RETURN opcode below) F3 RETURN

</details>

### Bytecode

```
00      36        CALLDATASIZE
01      6000      PUSH1 00
03      80        DUP1
04      37        CALLDATACOPY
05      36        CALLDATASIZE
06      6000      PUSH1 00
08      6000      PUSH1 00
0A      F0        CREATE
0B      3B        EXTCODESIZE
0C      6001      PUSH1 01
0E      14        EQ
0F      6013      PUSH1 13
11      57        JUMPI
12      FD        REVERT
13      5B        JUMPDEST
14      00        STOP
```

### Walkthrough

#### Step 00

`CALLDATASIZE` - The size in bytes of the calldata.

Stack: \[CALLDATASIZE]

#### Step 01

`PUSH1 00` - Pushes a 1 byte value (in this case `00` in hexidecimal).

Stack: \[0x00, CALLDATASIZE]

#### Step 03

`DUP1` - Duplicate the first item off the top of the stack.

Stack: \[0x00, 0x00, CALLDATASIZE]

#### Step 04

`CALLDATACOPY` - Copy the calldata to memory. Takes the first three items off the top of the stack as arguments in the following order:

1. `destOffest` - Byte offset in memory where the result will be copied.
2. `offset` - Byte offset in the calldata to copy.
3. `size` - yte size to copy.

In this case, we are copying the entire calldata into memory at byte offset `00`.

Stack: \[]

#### Steps 05 - 08

`CALLDATASIZE`, `PUSH1 00`, `PUSH1 00` - Essentially reproduces the stack as it was at step 03.

Stack: \[0x00, 0x00, CALLDATASIZE]

#### Step 10 (0A)

`CREATE` - Creates a new contract. Enters a new sub context of the calculated destination address and executes the provided initialization code, then resumes the current context. Should deployment succeed, the new account's code is set to the return data resulting from executing the initialization code.

Takes the first three items off the top of the stack as arguments:

1. `value` - Value in wei to send to the new account.
2. `offset` - Byte offset in memory of the initialization code of the new account.
3. `size` - Byte size of the initialization code to copy from memory.

Stack: \[DEPLOYED\_CONTRACT\_ADDRESS]

#### Step 11 (0B)

`EXTCODESIZE` - Gets the size in bytes of the code at the address off the top of the stack.

Stack: \[CODE\_SIZE\_AT\_DEPLOYED\_CONTRACT\_ADDRESS]

#### Step 12 (0C)

`PUSH1 01` - Pushes 1 byte to the top of the stack (in this case `01` in hexidecimal).

Stack: \[0x01, CODE\_SIZE\_AT\_DEPLOYED\_CONTRACT\_ADDRESS]

#### Step 14 (0E)

`EQ` - Equality comparison of first two items off the top of the stack. Pushes 1 if true or 0 if false.

Stack: \[0x01 == CODE\_SIZE\_AT\_DEPLOYED\_CONTRACT\_ADDRESS]

#### Step 15 (0F)

`PUSH1 13` - Pushes 1 byte to the top of the stack (in this case `13` in hexidecimal).

Stack: \[0x13, 0x01 == CODE\_SIZE\_AT\_DEPLOYED\_CONTRACT\_ADDRESS]

#### Step 17 (11)

`JUMP1` - Conditionally alter program counter. Takes the first two items off the top of the stack as arguments:

1. `counter` - Byte offset where execution will continue.
2. `b` - Whether the counter will be altered (no if 0, otherwise yes).

Stack: \[0x13, 0x01 == CODE\_SIZE\_AT\_DEPLOYED\_CONTRACT\_ADDRESS]

#### Step 18 (12)

`REVERT` - Halts the program execution, reverting any state changes. Our goal is to avoid the program reaching any of these instructions

#### Steps 19 (13) & 20 (14)&#x20;

`JUMPDEST` - A location a `JUMP` code can advance the program execution to. `STOP` signals the end of the code execution - our goal is to advance to this instruction.

### Solution

We need the `EQ` comparison in step 14 (0E) to evaluate to true, which means we need the `BYTECODESIZE` of the deployed contract to be equal to `0x01`. We must therefor send in the calldata the initialization code for a contract that will return a code of this byte size. The following payload will solve the challenge:

`0x600160006001601ff3`

This code will accomplish the following:

* The `6001` and `6000` instructions will push (`PUSH1`) `01` and `00` onto the stack. Stack: \[0x00, 0x01]
* The `52` instruction, `MSTORE`, will push the second value off the top of the stack (0x01) into memory at the byte offset of the first value off the top of the stack (0x00). This will result in a memory like the following: `0x0000000000000000000000000000000000000000 000000000000000000000001`.
* The `6001` and `601F` instructions will push `01` and `1F` onto the stack. Stack: \[0x01, 0x1F]
* The `f3` instruction, `RETURN`, will take the first two items off the top of the stack as arguments (`offset`, and `size`, respectively) and return the value from this location in memory. In this case, we take 1 byte from an offset of 31 bytes (`1F`), which is the value `01`.

This means that our supplied initialization code essentially just stores the hexidecimal value `01` in memory then returns it.

