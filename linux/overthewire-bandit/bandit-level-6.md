---
description: Level six is another challenge involving the find command.
---

# Bandit - Level 6

In [Level Six](https://overthewire.org/wargames/bandit/bandit7.html), we’re asked to find the password “somewhere on the server” and told it is owned by **user bandit7**, owned by **group bandit6**, and **33 bytes** in size.

Hints

<details>

<summary>Hint One</summary>

All you need to solve this level can be found in the man page of the find command.

</details>

<details>

<summary>Hint Two</summary>

“Somewhere on the server” means we begin our search from the **root directory** – `/`.

</details>

### Full Walkthrough

There are only a few differences between this challenge and the previous in Level Five. The location of the file has changed from the **inhere** directory to “somewhere on the server”, and we’re given information about its ownership. Our task is to learn how to pass these new parameters as arguments to the **find** command.

#### Somewhere on the Server

To search every directory on the server, we simply need to begin the search from the **root directory** – `/`. Find can then search through all child directories recursively.

* `find /` **** – search from the root directory.

#### Users and Groups

We’ve seen users in our Linux environment – they’re the handle that prefaces the @ in our command prompt. For example, our current user in level six is **bandit6**. There may be multiple users with different usernames (each with a unique user id – or UID) sharing the same server environment.

**Users** may have _ownership_ over files or directories, meaning they have the ability to set permissions which control the access granted to other users. These access permissions govern the ability to read, to write, and to execute.

**Groups** are a method of granting various groups of users the same permissions over a given file or directory. Users within a special group may, for example, be able to read certain files that users outside of the group cannot. Groups have a unique group id or GID and name.

You can examine your user id, group id, and the various groups you may belong to with the `id` command.

**Examining our user and group id’s:**

```shell-session
bandit6@bandit:~$ id
uid=11006(bandit6) gid=11006(bandit6) groups=11006(bandit6)
```

At the end of this walkthrough, we’ll look at how to read file attributes to examine permissions granted to groups and users.

#### Finding the File

The file can be located with the command `find / -type f -size 33c -user bandit7 -group bandit6`. However, we notice that the output also includes a many lines of “Permission denied” errors, making it difficult to spot the location of our file, `/var/lib/dpkg/info/bandit7.password`.

**Finding the 33 byte file owned by user bandit7 and group bandit6:**

```shell-session
bandit6@bandit:~$ find / -type f -size 33c -user bandit7 -group bandit6
find: ‘/root’: Permission denied
find: ‘/home/bandit28-git’: Permission denied
find: ‘/home/bandit30-git’: Permission denied
find: ‘/home/bandit5/inhere’: Permission denied
find: ‘/home/bandit27-git’: Permission denied
find: ‘/home/bandit29-git’: Permission denied
find: ‘/home/bandit31-git’: Permission denied
…
/var/lib/dpkg/info/bandit7.password
…
find: ‘/var/cache/ldconfig’: Permission denied
```

When `find` attempts to search a directory our user doesn’t have permission to read, it returns an ugly “Permission denied” error. As we’re searching from the root directory, the output gets fairly messy. An easy trick for avoiding this is to send all errors to `/dev/null` using the `2>` syntax.

Redirecting errors from find to /dev/null:

```shell-session
bandit6@bandit:~$ find / -type f -size 33c -user bandit7 -group bandit6 2> /dev/null
/var/lib/dpkg/info/bandit7.password
bandit6@bandit:~$ cat /var/lib/dpkg/info/bandit7.password
HKBP****************************
```

Essentially, we are telling the system to send everything that would be sent to “standard error” (and output to our terminal) to a special file /dev/null which is a sort of black hole that discards everything that is written to it. The 2 in this case is a file descriptor denoting “standard error” and 0 and 1 denote “standard input” and “standard output”, respectively.

### Key Takeaways

* Searching for files from the root directory.
* **Users** and **groups** in Linux.
* Redirecting standard error to **/dev/null** with **2>**.
