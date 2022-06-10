---
description: In Level Eleven we’re challenged to decode a simple substitution cipher.
---

# Bandit - Level 11

Were [told](https://overthewire.org/wargames/bandit/bandit12.html) that all lowercase and uppercase letters in `data.txt` have been “rotated” by 13 positions and also given a link to the Wikipedia page for the [Rot13 cipher](https://en.wikipedia.org/wiki/Rot13). While this level is a bit tricky compared to some of the previous string manipulation challenges, it is not as complicated as it first seems.

### Hints

<details>

<summary>Hint One</summary>

Try to implement the Rot13 cipher on your own in a text editor. Practice by encoding and decoding a message a few times. The first half of this challenge is figuring out what it is we’re actually being asked to do with the jumbled text provided.

</details>

<details>

<summary>Hint Two</summary>

Use `cat` to pipe the contents of `data.txt` to the `tr` command. This command is used to translate a given input according to a mapping provided (between two sets of characters). Ensure you have a proper 1-to-1 mapping between characters in SET1 and SET2:

`cat data.txt | tr [SET1] [SET2]`

</details>

### Full Walkthrough

#### Rot13

Rot13 is an example of a substitution cipher, that is a type of code in which the original message is obfuscated by mapping each character onto a different character. This message can be decoded by simply running the substitution in reverse. In Rot13 specifically, each letter in the alphabet is mapped onto the letter that comes 13 places after it. You can picture this by opening up a text editor and doing the following.

Begin with two rows containing each letter of the alphabet (twice on the second row for reasons that will be apparent in a moment):

```
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz
```

Then shift the top row over 13 spaces. The key is now the mapping between the top and bottom rows (a to n, b to o, etc.):

```
             abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz
```

#### Solving the Cipher

As always, OverTheWire provides a list of commands that may be useful in solving the challenge. To begin, it may be helpful to take a look at each and quickly rule out those that don’t appear relevant. We can look at that output of the `whatis` command for each:

* **grep** – print lines that match patterns
* **sort** – sort lines of text files
* **uniq** – report or omit repeated lines
* **strings** – print the sequences of printable characters in files
* **base64** – base64 encode/decode data and print to standard output
* **tr** – translate or delete characters
* **tar** – an archiving utility
* **gzip** – compress or expand files
* **bzip2** – a block-sorting file compressor
* **xxd** – creates a hex dump of a given file or standard input

Of these commands, `tr` looks like it may be most relevant to undoing a cipher (by translating, that is in the “shifting” sense, characters). A look at its man page doesn’t reveal much but we do get an example of its use:

`tr [OPTION]… SET1 [SET2]`

If that’s not terribly helpful to you, you’re not alone. This is a case where I recommend googling to find some more information. We’ll look at a few examples of its use below but essentially it takes a set of characters as an input and transforms them by mapping the characters in SET1 to the characters in SET2.

We’re also going to use a new command in this example – `echo`. The `echo` command simply writes the argument provided to standard output. This is useful, for example, for piping text into another command’s standard input.

**Basic usage of the `tr` command:**

```shell-session
bandit11@bandit:~$ echo abc
abc
bandit11@bandit:~$ echo abc | tr [abc] [ABC]
ABC
bandit11@bandit:~$ echo abc | tr [abc] [def]
def
```

For convenience, instead of writing out each letter of the alphabet we can use a shorthand like “a-z” which includes a, z, and all letters in between to represent a section of the alphabet that occurs in sequence. We’ve seen above that in Rot13, a-z is mapped onto n-m, so in reverse n-m is mapped back on to a-z:

```
nopqrstuvwxyzabcdefghijklm
abcdefghijklmnopqrstuvwxyz
```

Collapsing only the characters that occur in sequence with our “-” syntax, we get:

```
n-za-m
a-z
```

We’ll do the same for capital letters as well as the ciphertext contains both.

**Using `tr` to crack the Rot13 cipher:**

```shell-session
bandit11@bandit:~$ ls
data.txt
bandit11@bandit:~$ cat data.txt
Gur cnffjbeq vf 5Gr8L4qetPEsPk8htqjhRK8XSP6x2RHh
bandit11@bandit:~$ echo data.txt | tr [n-za-mN-ZA-M] [a-zA-Z]
The password is 5Te8****************************
```

### Key Takeaways

* The **Rot13** substitution cipher.
* Using **echo** to write text to standard output.
* Using **tr** to translate a set of characters according to a given mapping.
