---
description: Level four is a first look at examining simple file properties.
---

# Bandit - Level 4

[Level four](https://overthewire.org/wargames/bandit/bandit5.html) instructs us to look at the only “human-readable” file in the **inhere** directory.

### Hints

<details>

<summary>Hint One</summary>

What is a human-readable file?

Files contain arbitrary data in the form of binary – collections of 0’s and 1’s. What makes files unique is not how the underlying data is represented, but the context in which this data is interpreted. Certain collections of binary bits can be interpreted according to a standard to be rendered as human-readable characters to the user and others cannot. If you attempt to `cat` the contents of a file not intended to be represented as human-readable text, the result will appear to be gibberish.

In most computer systems, text files (intended to be read by humans) are represented using the [ASCII Standard](https://en.wikipedia.org/wiki/ASCII). How do we identify ASCII files using our Linux shell?

</details>

<details>

<summary>Hint Two</summary>

The instructions for the level suggest the following commands may be useful for solving the challenge:

`ls`, `cd`, `cat`, `file`, `du`, `find`

What do each of these commands do?

</details>

### Full Walkthrough

{% hint style="info" %}
**The `whatis` Command**

The `whatis` command can be used to access quick, one-line definitions of the commands it is passed as arguments. In this scenario, we can use it to determine which of the commands the instructions tell us may be needed to solve the level looks most useful.
{% endhint %}

Using the whatis command:

```shell-session
bandit4@bandit:~$ whatis ls
ls (1)               – list directory contents
bandit4@bandit:~$ whatis cd
cd (1p)              - change the working directory
bandit4@bandit:~$ whatis cat
cat (1)              – concatenate files and print on the standard output
bandit4@bandit:~$ whatis file
file (1)             – determine file type
bandit4@bandit:~$ whatis du
du (1)               – estimate file space usage
bandit4@bandit:~$ whatis find
find (1)             – search for files in a directory hierarchy
```

### Reading File Types

The `file` command looks to be what we need to find the human-readable ASCII file in the **inhere** directory.

**Examining file types:**

```shell-session
bandit4@bandit:~$ ls
inhere
bandit4@bandit:~$ cd inhere
bandit4@bandit:~$ ls
-file00 -file01 -file02 -file03 -file04 -file05 -file06 -file07 -file08 -file09
bandit4@bandit:~$ file ./-file00
./-file00: data
bandit4@bandit:~$ file ./-file01
./-file01: data
bandit4@bandit:~$ file ./-file02
./-file02: data
bandit4@bandit:~$ file ./-file03
./-file03: data
bandit4@bandit:~$ file ./-file04
./-file04: data
bandit4@bandit:~$ file ./-file05
./-file05: data
bandit4@bandit:~$ file ./-file06
./-file06: data
bandit4@bandit:~$ file ./-file07
./-file07: ASCII text
```

`-file07` is the only ASCII text file in the directory.

While the above solution works for this specific instance, what if there weren’t 10 of these files in the directory but several hundred? There are many ways to simplify such an operation. We could, for example, use a feature called **brace expansion** to shorten the command.

**Examining file types with brace expansion:**

```shell-session
bandit4@bandit:~$ file ./-file0{0,1,2,3,4,5,6,7,8,9}
./-file00: data
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
bandit4@bandit:~$ cat ./-file07
koRe****************************
```

In the above example, each comma-separated element in the list contained within the curly braces will be looped through to create an argument e.g. `file ./-file00 ./-file01 ./-file002 ./-file03`, etc.

### Key Takeaways

* **Binary** and **text** (human-readable) files.
* Quickly accessing a command definition with **whatis**.
* Examining file properties with the **file** command.
* Using **brace expansion** to simplify redundant commands.
