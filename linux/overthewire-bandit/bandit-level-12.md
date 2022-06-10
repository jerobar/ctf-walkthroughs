---
description: >-
  Level twelve introduces hexdumps and a series data compressions that must be
  reversed to uncover the password.
---

# Bandit - Level 12

The [instructions](https://overthewire.org/wargames/bandit/bandit13.html) for Level Twelve tell us that the password is in the `data.txt` file, which is a hexdump of a file that has been repeatedly compressed. It also advises we create a temporary directory in which to work as we may be generating a series of files in the process and also want to avoid corrupting the original `data.txt`.

### Hints

<details>

<summary>Hint One</summary>

The first step is to make a directory in `/tmp` from which to work and copy the `data.txt` file from the user’s home directory to this new working directory. From there, you’ll need to use the `xxd` command to reverse the hexdump. What do you end up with?

</details>

<details>

<summary>Hint Two</summary>

The command to reverse the hexdump of data.txt is `xxd -r data.txt data`. This results in a file named `data` which the `file` command will reveal to be a “gzip compressed data” file. This compressed file will need to be expanded.

</details>

<details>

<summary>Hint Three</summary>

To expand the “gzip compressed data” file we can use a utility called `gunzip`. First, though, the `data` file will have to be renamed to `data.gz`.

</details>

<details>

<summary>Hint Four</summary>

Files can be renamed using the `mv` command. After successfully expanding the “gzip compressed data” file and running the `file` command on it, you will discover this too is a compressed file of another type. The rest of the level involves using various utilities to expand these compressed files one by one until you’re left with an “ASCII text” file.

</details>

### Full Walkthrough

#### **Hexidecimal**

All data in computers is represented as binary – a way of representing numbers as a series of 0’s and 1’s. Hexadecimal is just another scheme for representing numbers that is slightly easier to read for humans. Instead of 0’s and 1’s, hexadecimal represents numbers using the characters 0-9 and A-F. In this scheme, we count regularly from 0-9 but instead of rolling over to a two-digit number 10, we then start at A and count up to F.

For example, the ASCII string “hello” can be represented numerically (in base 10) as:

`104 101 108 108 111`

Which can be represented as binary:

`01101000 01100101 01101100 01101100 01101111`

Or can be represented in hexadecimal:

`68 65 6C 6C 6F`

A hexdump is a human-readable representation of the underlying binary of a given collection of data, given in hexadecimal. It can be useful for things like debugging, data recovery, or reverse engineering.

We can see an example of how this works by creating a hexdump of our own. First we’ll create a directory in which to work in the `tmp` directory using the `mkdir` (“make directory”) command, then we’ll create a file containing “hello” using the `>` **** redirection operator. This redirection operator works like the pipe operator, but is used to redirect from standard output into a file rather than another command.

**Creating our own hexdump of “hello”:**

```shell-session
bandit12@bandit:~$ ls
data.txt
bandit12@bandit:~$ mkdir /tmp/foobar
bandit12@bandit:~$ cd /tmp/foobar
bandit12@bandit:/tmp/foobar~$ echo hello > hello.txt
bandit12@bandit:/tmp/foobar~$ ls
hello.txt
bandit12@bandit:/tmp/foobar~$ xxd hello.txt hellohex
bandit12@bandit:/tmp/foobar~$ ls
hello  hellohex
bandit12@bandit:/tmp/foobar~$ cat hello.txt
hello
bandit12@bandit:/tmp/foobar~$ cat hellohex
00000000: 6865 6c6c 6f0a     hello.
```

Now that we’ve seen how we can take regular human-readable text, we can understand what happens when we take a hexdump and “reverse” it back to its previous form. We’ll first copy the `data.txt` **** file from the user’s home directory into our working tmp directory using the `cp` command. The syntax for this command is simply `cp <file to copy> <location to copy to>`.

**Copying `data.txt` to our working directory and reversing the hexdump:**

```shell-session
bandit12@bandit:/tmp/foobar~$ cp ~/data.txt /tmp/foobar/data.txt
bandit12@bandit:/tmp/foobar~$ ls
data.txt
bandit12@bandit:/tmp/foobar~$ xxd -r data.txt data
bandit12@bandit:/tmp/foobar~$ ls
data  data.txt
```

If you `cat` the contents of the new data file you’ll get a mess (use `clear` to clean up the terminal). This binary file is not human-readable. So, what is it? Running the `file` command on it reveals it’s a “gzip compressed data” file.

Files compressed with the `gzip` utility can be expanded with `gunzip`. Running `gunzip data` results in an error `gzip: datafinal: unknown suffix -- ignored`. This is because `gunzip` expects files ending in the .gz extension. We’ll need to rename the file before we can successfully expan it.

Files can be renamed by using the `mv` command and simply specifying a new name for the file you’re moving. The syntax is `mv <file> <newfile>`.

**Expanding the (reversed) hexdump data:**

```shell-session
bandit12@bandit:/tmp/foobar~$ file data
data: gzip compressed data, was “data2.bin”, last modified: Thu May 7 18:14:30 2020, max compression, from Unix
bandit12@bandit:/tmp/foobar~$ gunzip data
gzip: datafinal: unknown suffix — ignored
bandit12@bandit:/tmp/foobar~$ mv data data.gz
bandit12@bandit:/tmp/foobar~$ ls
data.gz  data.txt
bandit12@bandit:/tmp/foobar~$ gunzip data.gz
bandit12@bandit:/tmp/foobar~$ ls
data  data.txt
bandit12@bandit:/tmp/foobar~$ file data
data: bzip2 compressed data, block size = 900k
```

We now see that the resulting file is a “bzip2 compressed data” file and the rest of this (very tedious) task is now becoming clear. We’ll have to expand the file with whatever utility is necessary, run the `file` command to see what the resulting file type is, rename the file with `mv` if necessary, expand it again with another utility and so on and so on until finally `file` returns “ASCII text”.

**Expanding the compressed files, one-by-one:**

```shell-session
bandit12@bandit:/tmp/foobar~$ file data
data: bzip2 compressed data, block size = 900k
bandit12@bandit:/tmp/foobar~$ bunzip data
bunzip2: Can’t guess original name for data — using data.out
bandit12@bandit:/tmp/foobar~$ ls
data.out  data.txt
bandit12@bandit:/tmp/foobar~$ file data.out
data.out: gzip compressed data, was “data4.bin”, last modified: Thu May 7 18:14:30 2020, max compression, from Unix
bandit12@bandit:/tmp/foobar~$ mv data.out data.gz
bandit12@bandit:/tmp/foobar~$ gunzip data.gz
bandit12@bandit:/tmp/foobar~$ file data
data: POSIX tar archive (GNU)
bandit12@bandit:/tmp/foobar~$ tar -x -f data
bandit12@bandit:/tmp/foobar~$ ls
data  data5.bin  data.txt
bandit12@bandit:/tmp/foobar~$ file data5.bin
data5.bin: POSIX tar archive (GNU)
bandit12@bandit:/tmp/foobar~$ tar -x -f data5.bin
bandit12@bandit:/tmp/foobar~$ ls
data data5.bin data6.bin data.txt
bandit12@bandit:/tmp/foobar~$ file data6.bin
data6.bin: bzip2 compressed data, block size = 900k
bandit12@bandit:/tmp/foobar~$ bunzip data6.bin
bunzip2: Can’t guess original name for data — using data6.bin.out
bandit12@bandit:/tmp/foobar~$ file data6.bin
data6.bin.out: POSIX tar archive (GNU)
bandit12@bandit:/tmp/foobar~$ tar -x -f data6.bin.out
bandit12@bandit:/tmp/foobar~$ ls
data data5.bin data6.bin.out data8.bin data.txt
bandit12@bandit:/tmp/foobar~$ file data8.bin
data8.bin: gzip compressed data, was “data9.bin”, last modified: Thu May 7 18:14:30 2020, max compression, from Unix
bandit12@bandit:/tmp/foobar~$ mv data8.bin data8.bin.gz
bandit12@bandit:/tmp/foobar~$ gunzip data8.bin.gz
bandit12@bandit:/tmp/foobar~$ ls
data data5.bin data6.bin.out data8.bin data.txt
bandit12@bandit:/tmp/foobar~$ file data8.bin
data8.bin: ASCII text
bandit12@bandit:/tmp/foobar~$ cat data8.bin
The password is 8Zjy****************************
```

### Key Takeaways

* Hexadecimal and hexdumps.
* Making directories with the **mkdir** command.
* Redirecting output into files with the **>** redirection operator.
* Reversing hexdumps using **xxd**.
* Using **cp** to copy files.
* Using **mv** to move and rename files.
* Expanding compressed data with various utilities - gzip, bzip2.
* Unpacking tar archives with the **tar** command.
