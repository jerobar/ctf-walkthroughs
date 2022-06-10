---
description: >-
  In Level One, we learn a bit about absolute and relative file paths and the
  structure of Linux commands.
---

# Bandit - Level 1

To complete [level one](https://overthewire.org/wargames/bandit/bandit2.html), we need to read the contents of a file called `-` located in the home directory. Connect to the host **bandit1@bandit.labs.overthewire.org** using the flag found in the previous level as the password.

<details>

<summary>Hint One</summary>

While `cat` is the right command, the `cat -` syntax won’t work. We need to find another way to refer to the `-` file’s location.

</details>

### Full Walkthrough

We can modify the default behavior of a command by passing it options and arguments with the following syntax:

`command -option argument`

When we attempt to use the command `cat -`, the shell is expecting an option to be passed after the hyphen and if one is not provided the command will simply hang. To fix this, we can provide the full path to the file so the shell recognizes it as our _argument_ to the `cat` command, the file to be read.

{% hint style="info" %}
**Absolute vs. Relative Pathnames**

The location of a file can be specified _absolutely_, that is, relative to the system’s root directory, or _relatively_, relative to the current directory the user is in. Absolute paths begin with `/`, which denotes the root (or “top-most”) directory, while relative paths may begin with `./` to denote the current directory or `../` to specify one directory up from the current. The command `pwd` (“print working directory”) can be used to show the absolute location of the directory currently being browsed.
{% endhint %}

**Showing the current directory with pwd:**

```shell-session
bandit1@bandit:~$ pwd
/home/bandit1
```

The output of the pwd command shows we are in a directory called **bandit1**, which is in a directory called **home**, which itself is in the **root** (/) directory.

The `–` file can be read with **cat** by specifying its location by either the absolute or relative pathname.

**Reading the contents of the `–` file:**

```shell-session
bandit1@bandit:~$ ls
-
bandit1@bandit:~$ cat /home/bandit1/-
CV1D****************************
bandit1@bandit:~$ cat ./-
CV1D****************************
bandit1@bandit:~$ cat ../bandit1/-
CV1D****************************
```

Use this flag as the password for Level 2.

### Key Takeaways

* **Absolute** vs. **relative** pathnames.
* The **pwd** command.
