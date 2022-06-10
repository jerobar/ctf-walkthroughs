---
description: >-
  Level Five involves searching a directory for a file with a specific set of
  properties.
---

# Bandit - Level 5

The [instructions](https://overthewire.org/wargames/bandit/bandit6.html) for Level Five explain we’re trying to find a file that is **human-readable**, **1033 bytes** in size, is **not executable**, and is located somewhere in the **inhere** directory.

You may find this level a step up in difficulty from the previous tasks, but it is solvable with the information provided and the skills learned so far.

### Hints

<details>

<summary>Hint One</summary>

Use the `man` command to learn how to use `find` to search for the file that meets the criteria specified in the instructions in the **inhere** directory.

</details>

### Full Walkthrough

It will be helpful to first go over a very useful feature when solving problems in Linux – `man` pages (short for “manual”).

#### Man Pages

The command `man` can be used to access detailed documentation for other commands on the system. These manuals contain information on which options are available and often contain examples of the command’s use.

**Note:** Press `q` to quit the man pages and return to the regular command prompt.

**Accessing the man page for the ls command:**

```shell-session
bandit5@bandit:~$ man ls
```

Becoming comfortable reading the man pages will pay off as you work to develop Linux proficiency. This documentation should be the first resource you consult before Googling how a command works.

#### Using the find Command

There are a number of ways this search can be performed. Below is just one example:

`find /home/bandit5/inhere -type f -size 1033c ! -executable -exec file {} \;`

* **find /home/bandit5/inhere** – the first argument to the `find` command specifies the directory in which to search. We have provided the absolute path to `inhere`.
* **-type f** – this option specifies the type of file we are searching for – in this case “f” for “regular file” (as opposed to, say, “d” for “directory”).
* **-size 1033c** – the size of the file we are searching for. We learn that “c” denotes bytes in the man page for file.
* **! -executable** – the file is _not_ executable. The option `-executable` without the `!` would mean the file we are searching for _is_ executable. In programming, an exclamation mark almost always means “not”.
* **-exec file {} \\;** – for each file the find command returns, execute the `file` command on it to determine its file type. Here the `{}` serve as a placeholder for the file and the escaped semicolon `\;` signals the end of our executable command. The semicolon is escaped so it will not be interpreted by the shell, where it has a special meaning, but will be used only by the `find` command. We’ve included this option in case multiple files are returned by the find command and we need to see which is human-readable (ASCII text).

**Finding a 1033 byte, non-executable, human-readable file in `inhere`:**

```shell-session
bandit5@bandit:~$ find ./inhere -type f -size 1033c -exec file {} \;
./inhere/maybehere07/.file2: ASCII text, with very long lines
DXjZ****************************
```

### Key Takeaways

* Accessing the **man** (manual) pages to learn about commands.
* Using the **find** command with specific search parameters.
