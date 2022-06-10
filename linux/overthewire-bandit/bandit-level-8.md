---
description: In Level Eight we look at identifying one unique string among many.
---

# Bandit - Level 8

[Level Eight](https://overthewire.org/wargames/bandit/bandit9.html) asks us to locate the only line in `data.txt` that occurs **once**.

### Hints

<details>

<summary>Hint One</summary>

This level can be solved with a single three-step chain command. The solution will take the form: `cat data.txt | <second step> | <third step>`.

</details>

<details>

<summary>Hint Two</summary>

The last step in this chain is the `uniq` command, but piping data directly from `cat` to `uniq` will not work. This is because in order to identify unique lines, the data passed to `uniq` must be in a certain form. This is explained in the man page.

</details>

### Full Walkthrough

We may be tempted to just pipe the contents of the `data.txt` file to `uniq`, which is one of the commands suggested by OverTheWire to solve the level. A quick peek at its man page shows that the `-u` flag can be used to only print unique lines. It’s a reasonable first attempt, but we get back an unexpected result.

**Piping `data.txt` to the `uniq` command:**

```shell-session
bandit8@bandit:~$ cat data.txt | uniq -u
337o85y4OymIh99WPUtotkb114evfAkC
07KC3ukwX7kswl8Le9ebb3H3sOoNTsR2
Hq6uxRAkKPNLnH6eRSFDzXtvVt0CSsee
hA6Ofhj75FPgqnCKEJ9g6pLSKapxxmGC
DxxLvJl6cGHXLT7OW4xqS7Qrfny1K01l
wjNwumEX58RUQTrufHMciWz5Yx10GtTC
LfrBHfAh0pP9bgGAZP4QrVkut3pysAYC
kUbOkhsIw6GSp0WI2YUo1Q3hDxFU0iQn
…
```

**Note:** The previous step resulted in a lot of text being written to the standard output, cluttering up our terminal. When you would like to wipe the slate clean, the `clear` command can be used to reset the terminal to its original, pristine condition.

The man page for **uniq** explains that:

`'uniq' does not detect repeated lines unless they are adjacent. You may want to sort the input first...'`

#### Sorting Our Data

We can use the `sort` **** command to format the data we to pass to `uniq`. This will result in an output in which any duplicate lines will appear next to one another.

**Piping our sorted data to the `uniq` command:**

```shell-session
bandit8@bandit:~$ cat data.txt | sort | uniq -u
UsvV****************************
```

### Key Takeaways

* Sorting string data with the **sort** command.
* Clearing the terminal output with **clear**.
* Using **uniq** to identify unique lines in a body of text.
