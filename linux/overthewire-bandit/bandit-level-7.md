---
description: >-
  Level Seven is the first of a series of several challenges dealing mostly with
  string manipulation.
---

# Bandit - Level 7

The [instructions](https://overthewire.org/wargames/bandit/bandit8.html) for Level Seven tell us the password is stored next to the word **millionth** in a file called `data.txt`. Running the `cat` command on the file reveals hundreds of lines of random data. Simply searching through this data manually is not a good solution.

### Hints

<details>

<summary>Hint One</summary>

The solution involves running two commands at once (on one line). You will need to pass the standard output of the first command to the standard input of the second. The first command is `cat data.txt`.

</details>

<details>

<summary>Hint Two</summary>

The output of the `data.txt` file must be _piped_ to a command that can search line-by-line for a specific keyword. This is one of the following commands OverTheWire suggests you may need: “`grep`, `sort`, `uniq`, `strings`, `base64`, `tr`, `tar`, `gzip`, `bzip2`, `xxd`”.

</details>

### Full Walkthrough

#### The Pipe Operator

The pipe operator `|` can be used to redirect (or “pipe”) the standard output of one command into the standard input of another. Commands can be chained in this manner to perform complex operations such as performing a long series of iterative transformations on data. Its basic syntax is:

`<pipe this standard output> | <to this standard input>`

#### Grep

Grep is a very powerful command used to search a body of text for a specified pattern and output each matching line. While you may wonder how useful a feature that really is in practice, it is a command you will find yourself using over and over again as you develop your command line skills. It is well worth becoming familiar with its various uses. Try using grep next time you need to search a man page!

**Using grep to search `data.txt` for the word millionth:**

```shell-session
bandit7@bandit:~$ ls
data.txt
bandit7@bandit:~$ cat data.txt | grep millionth
millionth     cvX2****************************
```

Note the use of the exit command to close the current shell session. This logs us out of the ssh connection to Bandit’s server.

### Key Takeaways

* Using `|` to **pipe** the **standard output** of one command to the **standard input** of another.
* Using the **grep** command to locate lines of output containing a certain keyword.
