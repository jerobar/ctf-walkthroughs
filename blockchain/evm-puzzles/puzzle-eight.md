# Puzzle Eight

Enter the calldata.

### Hints

<details>

<summary>Hint One</summary>

You need the `EQ` operation at step `0x16` to evaluate to true, which means the result of the `CALL` at `0x13` is equal to the `0x00` pushed by step `0x14`. `CALL` will return 0 if and only if the contract being called reverts. The bytecode from the previous puzzle can almost be used to solve this level, you will just need to tweak it slightly…

</details>

<details>

<summary>Hint Two</summary>

The REVERT opcode is `0xFD`.&#x20;

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
0B      6000      PUSH1 00
0D      80        DUP1
0E      80        DUP1
0F      80        DUP1
10      80        DUP1
11      94        SWAP5
12      5A        GAS
13      F1        CALL
14      6000      PUSH1 00
16      14        EQ
17      601B      PUSH1 1B
19      57        JUMPI
1A      FD        REVERT
1B      5B        JUMPDEST
1C      00        STOP
```

### Solution

We need the `EQ` operation at 16 to evaluate as true, which means we need the result of the `CALL` at 13 to equal the `00` pushed by 14. `CALL` will return `0` if and only if the contract being called reverts.

The first 10 steps deploy the contract initialization code we supply as the calldata. We only want this code to revert (opcode `FD`), so we can use the following payload:

`0x60FD6000526001601ff3`

This code is similar to the previous solution, with only the second byte changed from an `01` to the REVERT opcode `FD`. This will deploy a contract that reverts when it is called.
