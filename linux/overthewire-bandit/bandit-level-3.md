---
description: >-
  In Level Three, we’re introduced to changing from one directory to another and
  viewing hidden files.
---

# Bandit - Level 3

[Level Three](https://overthewire.org/wargames/bandit/bandit4.html) states the flag is in a hidden file in the **inhere** directory.

### Hints

<details>

<summary>Hint One</summary>

We begin in the user’s home directory, as evidenced by the `~` character in our prompt or the output of the `pwd` command. Using `ls` to list the contents of this directory, we see it contains another directory – **inhere** (notice that directories may appear as different colors than files in your terminal). The first task is to find the command used to _change directories_ to enter **inhere**. This is one of the six “Commands you may need to solve this level” shown on the level’s web page linked above.

</details>

<details>

<summary>Hint Two</summary>

We know we’re looking for a file in the inhere directory, but `ls` reveals nothing. Is there such a thing as a _hidden file_ in Linux?

</details>

### Full Walkthrough

#### Changing Directories

The command used to change directories is `cd` followed by the name of the directory as a first argument. The directory can be specified absolutely, relatively, or just by name if it is within the current working directory.

* `cd inhere`
* `cd ./inhere`
* `cd /home/bandit3/inhere`

It’s worth noting that we can move back up one directory to its parent with the command `cd ..`.

**Changing into the inhere directory with `cd`:**

```shell-session
bandit3@bandit:~$ ls
inhere
bandit3@bandit:~$ cd inhere
bandit3@bandit:~/inhere$ 
```

Notice our prompt has changed from `~$` (“home directory”) to `~/inhere$` (“home directory / inhere”).

Looking at the contents of this new directory it appears we have an issue. We’re told the flag is in the only human-readable file but the `ls` command doesn’t appear to show any files.

**Listing the contents of `inhere`:**

```shell-session
bandit3@bandit:~/inhere$ ls
bandit3@bandit:~/inhere$ 
```

{% hint style="info" %}
**Hidden Files**

Hidden files, also called **dot files**, are files that are not displayed during a standard directory listing. Their filenames begin with a `.` – e.g. `.htaccess` or `.ssh`, etc. They are often used to store configuration data or execute scripts.

Hidden files can be viewed with the `ls` command, but it requires adding the `-a` option to show _all_ files, including dot files. These files can be read just like any other using the `cat` command.
{% endhint %}

**Viewing the hidden contents of `inhere`:**

```shell-session
bandit3@bandit:~/inhere$ ls -a
.  ..  .hidden
bandit3@bandit:~/inhere$ cat .hidden
pIwr****************************
```

### Key Takeaways

* Changing directories with **cd**.
* **Hidden files** (or "**dot files**").
* Using the ls **-a** option to view hidden files.
