# Puzzle Ten

Enter the value and calldata to send.

### Bytecode

```
00      38          CODESIZE
01      34          CALLVALUE
02      90          SWAP1
03      11          GT
04      6008        PUSH1 08
06      57          JUMPI
07      FD          REVERT
08      5B          JUMPDEST
09      36          CALLDATASIZE
0A      610003      PUSH2 0003
0D      90          SWAP1
0E      06          MOD
0F      15          ISZERO
10      34          CALLVALUE
11      600A        PUSH1 0A
13      01          ADD
14      57          JUMPI
15      FD          REVERT
16      FD          REVERT
17      FD          REVERT
18      FD          REVERT
19      5B          JUMPDEST
1A      00          STOP
```

### Solution

The first section of the bytecode, steps 00-06, will jump our program to 08 if and only if the value we supply is less than 0x1A (26). The second section, steps 09-14 (20), require both that our value plus 10 equals 25 (so our value will be 15) and that our calldata size in bytes is a factor of 3.

**value:** 15\
**calldata:** 0x0000FF
