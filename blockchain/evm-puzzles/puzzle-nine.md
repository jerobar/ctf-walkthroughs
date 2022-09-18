# Puzzle Nine

Enter the value and calldata to send.

### Hints

<details>

<summary>Hint One</summary>

This puzzle requires you submit both a value and a calldata. The first set of instructions from `0x00` - `0x06` will jump to `0x09` if the byte size of your calldata is greater than a specific number. The second set of instructions from `0x0A` - `0X12` check that the value multiplied by the calldata equals another specific number.

</details>

### Bytecode

```
00      36        CALLDATASIZE
01      6003      PUSH1 03
03      10        LT
04      6009      PUSH1 09
06      57        JUMPI
07      FD        REVERT
08      FD        REVERT
09      5B        JUMPDEST
0A      34        CALLVALUE
0B      36        CALLDATASIZE
0C      02        MUL
0D      6008      PUSH1 08
0F      14        EQ
10      6014      PUSH1 14
12      57        JUMPI
13      FD        REVERT
14      5B        JUMPDEST
15      00        STOP
```

### Solution

This puzzle requires we submit both a value and a calldata. The first set of instructions from 00 - 06 will jump to 09 if and only if the byte size of our calldata is > 03. The second set of instructions from 10 (0A) - 17 (12) check that the value multiplied by the calldata equals 08. We can therefor provide the following payload to solve the challenge:

**value:** 2\
**calldata:** 0x00000004
