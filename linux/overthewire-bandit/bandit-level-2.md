---
description: >-
  Level two covers another example of working with the cat command and special
  characters.
---

# Bandit - Level 2

[Level two](https://overthewire.org/wargames/bandit/bandit3.html) tells us the flag is in a file called **spaces in this filename**.

### Hints

<details>

<summary>Hint One</summary>

When we attempt to `cat spaces in this filename`, the command fails because spaces are recognized as special characters by the shell. How do we _escape_ these special characters so that “spaces in this filename” is recognized as a single argument to the `cat` command?

</details>

### Full Walkthrough

#### Reading The File

The shell uses space characters in our input to recognize a separation between commands, options and arguments. The command `cat spaces in this filename` recognizes each word following the command as a separate argument (i.e. **cat** “spaces” + “in” + “this” + “filename”) and attempts to _concatenate_ each of these files and write the result to the standard output. As none of these files exist in the current directory, this command will fail.

#### Escaping Special Characters

We need to signal to the shell that these space characters should be treated simply as characters and not inputs with special meaning. In programming, this is usually referred to as “escaping” the characters. We will look at three ways of accomplishing this:

* **With backslashes:** any character prefaced by a backslash `\` will be escaped (with the exception of the _newline_ character – )
* **With single quotes:** all characters between `'single quotes'` will be escaped (provided, of course, there isn’t another single quote between the enclosing quotes)
* **With double quotes:** all characters between `"double quotes"` will be escaped (save for backticks, dollar signs and backslashes)

**Reading `spaces in this filename` with the `cat` command:**

```shell-session
bandit2@bandit:~$ ls
spaces in this filename
bandit2@bandit:~$ cat spaces\ in\ this\ filename
UmHa****************************
bandit2@bandit:~$ cat ‘spaces in this filename’
UmHa****************************
bandit2@bandit:~$ cat “spaces in this filename”
UmHa****************************
```

Use this flag as the password for Level 3.

### Key Takeaways

* Escaping characters with **backslashes**, **single quotes** and **double quotes**.
