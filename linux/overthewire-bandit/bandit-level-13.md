---
description: >-
  Level Thirteen is unique in that the challenge doesn’t just involve collecting
  a password. This level introduces using public key authentication to connect
  to a remote server.
---

# Bandit - Level 13

We’re told that the password for level 14 is located in `/etc/bandit_pass/bandit14` but can only be read by user `bandit14` (if we attempt to `cat` this file we can confirm we get a permission denied error). Instead, a “private SSH key” is located in the home directory which we will need to use to log in as `bandit14`.

### Hints

<details>

<summary>Hint One</summary>

How you solve this challenge will vary depending on whether you’re connecting from a bash terminal on your local machine or using a program such as PuTTY on Windows. Google how to connect using an SSH key with whatever setup you’re using.

</details>

### Full Walkthrough

#### **Public Key Authentication**

Public key authentication is a method of logging in to a remote system using a cryptographic key rather than a simple password. The scheme relies on two “keys” (a “key pair”), which are just files containing long strings of text – one “public” key, which is on the remote server and one “private” key, which the user possesses.

This form of authentication is more secure than the traditional password-based approach. For example:

* The keys can’t be brute forced or guessed like passwords
* A compromised server will not expose login credentials
* Private keys can themselves be password protected

To solve this level, all we need to do is include the private key found on the Bandit server in our ssh command. As my local operating system is Linux, I’m going to demonstrate how I do this but you may need to google how to handle this challenge in your own environment. I’ll use `scp` **** (“secure file copy”) to copy the key from the game server to my local machine. I’ll then attempt to make the connection, but there will be an error.

**Copying the SSH key from Bandit’s server and attempting to connect:**

```shell-session
user@local:~$ scp -P 2220 bandit13@bandit.labs.overthewire.org:~/sshkey.private .
This is a OverTheWire game server. More information on http://www.overthewire.org/wargames

bandit13@bandit.labs.overthewire.org’s password: 
sshkey.private
user@local:~$ ls
sshkey.private
user@local:~$ ssh bandit14@bandit.labs.overthewire.org -p 2220 -i ./sshkey.private
load pubkey “./sshkey.private”: invalid format
This is a OverTheWire game server. More information on http://www.overthewire.org/wargames

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@ WARNING: UNPROTECTED PRIVATE KEY FILE! @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0640 for ‘./sshkey.private’ are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key “./sshkey.private”: bad permissions
bandit14@bandit.labs.overthewire.org’s password: 
```

I’ll hit `ctrl+c` to escape the input prompt and return to my shell. What are these permissions being referred to? And how are they too open? What does “0640” mean?

#### **Permissions**

We saw the concepts of users and groups in a previous level and I mentioned groups can be used to share permissions among users. There are three basic types of permissions in Unix-like operating systems like Linux: read, write, and execute. Every file and directory (and directories are, somewhat confusingly, a type of file) has read, write, and execute permissions defined for the file’s owner, the file’s group owner, and “world” or “everyone else”.

We’ll take a look at the permissions on the **sshkey.private** file we just downloaded by using the **ls** command with a new flag – **-l**. The **-l** flag specifies we want a “long listing” format which contains additional details.

**Checking the permissions on the `sshkey.private` file:**

```shell-session
user@local:~$ ls -l
total 4
–rw–r––––– . 1 user user 1679 Sep 12 08:30 sshkey.private
```

The part of the above output we’re interested in is the `–rw–r–––––`. These are the file’s permissions. There are ten characters here – each with a special meaning depending on its place.

* The first character denotes the **file type** (in this case “-” means a regular file)
* The next three characters are the **owner’s permissions**. Here we see “rw-” meaning read and write. Execute permissions are “x” and no permissions are “-“.
* The next three are the **group’s permissions**. Here the group has read permissions and no others.
* The last three are the **world permissions**. Here we see “–––” meaning everyone else has no permissions.

Permissions may also be represented in a three-digit numeric shorthand, with each digit representing one of owner, group, and world permissions. In this scheme, we assign the following values to each _type_ **** of permission:

* **Read** (r) is 4
* **Write** (w) is 2
* **Execute** (x) is 1

And we then add them together to get a single digit to represent all three. For example – full permissions (rwx) become 7, read and write (rw-) become 6, etc.

Looking at our file we see that it has 640 permissions (`–rw–r–––––`). The error mentioned 0640, but we’re going to ignore the first 0 for now and come to it in a later level. Googling the issue, we see that the permissions on a private key should be 600. Fortunately, we can change a file’s permissions using the command `chmod`.

**Changing permissions on sshkey.private and connecting:**

```shell-session
user@local:~$ chmod 600 sshkey.private
user@local:~$ ls -l
–rw–––––––. 1 user user 1679 Sep 12 08:45 sshkey.private
user@local:~$ ssh bandit14@bandit.labs.overthewire.org -p 2220 -i ./sshkey.private
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
4wcY****************************
```

### Key Takeaways

* Public key authentication.
* Securely copying files from a remote host using **scp.**
* **R**eading file permissions with **ls -l**.
* Reading numeric file permissions.
* Changing file permissions with **chmod**.
* Connecting over ssh to a remote host with a private key.
