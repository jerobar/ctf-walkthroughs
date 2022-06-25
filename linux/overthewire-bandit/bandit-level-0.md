---
description: >-
  The first level of Bandit covers logging in to the remote game server to read
  the contents of a file containing the password for level one.
---

# Bandit - Level 0

### Hints

<details>

<summary>Hint One</summary>

From your terminal, you’ll need to use the `ssh` command to connect with the details specified in the level description.

</details>

<details>

<summary>Hint Two</summary>

After connecting, you’ll need to list the files in the home directory. If you’re unsure of how to do this, now would be a good time to acquaint yourself with the most useful tool at your disposal for working through CTF challenges, [Google](https://google.com).

</details>

<details>

<summary>Hint Three</summary>

Read the output of the `readme` file to find the flag.

</details>

### Full Walkthrough

SSH or “Secure Shell” is a networking protocol used to interact with a remote host and issue commands over an encrypted channel. This will allow any commands we type into our own shell to be run on the remote machine almost as if we were plugged in directly with a keyboard and monitor.

To run the SSH program from our shell, we will use the command ssh followed by the details of our connection, like the name of the remote host, port number, and our username:

**Connecting to host bandit.labs.overthewire.org on port (`-p`) 2220 with username Bandit0:**

```shell-session
user@localhost:~$ ssh bandit0@bandit.labs.overthewire.org –p 2220
The authenticity of host ‘[bandit.labs.overthewire.org]:2220 ([176.9.9.172]:2220)’ can’t be established.
ECDSA key fingerprint is SHA256:98UL0ZWr85496EtCRkKlo20X3OPnyPSB5tB5RPbhczc.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added ‘[bandit.labs.overthewire.org]:2220,[176.9.9.172]:2220’ (ECDSA) to the list of known hosts.
bandit0@bandit.labs.overthewire.org’s password: 
```

The first time we connect to the remote host, we’re told its authenticity cannot be verified and we’re shown something about an “ECDSA key fingerprint”. For now, the details of exactly what this means aren’t important. Just know that we’re seeing this message because we have not connected to this server before and that it’s safe to proceed by typing in `yes` at the prompt and hitting enter.

After entering the password **bandit0** we are now logged in to the remote host and are greeted with a “Message of the Day” which explains some of Bandit’s rules. At this point we are ready to move on to the first real challenge of the game – locating the password for level one.

#### Home Directory

We’re [told](https://overthewire.org/wargames/bandit/bandit1.html) the password for the next level is located in a file called **readme** in the home directory. From this point on this is generally how the game will work – log in over ssh, find an alphanumeric “flag” and use it as the password to access the next level.

Where is this home directory? We’re in it. How can we tell?

You may notice that the prompt of the shell has changed since we’ve logged in to the Bandit server from whatever it was on your local machine to `bandit0@bandit:~$` . There are a few bits of useful information contained in this prompt:

* **bandit0** is our current username
* **bandit** is the name of the host we’re connected to
* **\~** tells us we are in our user’s home directory
* **$** indicates we are a normal user (more on this in a later level)

So, if we are currently in the home directory where the **readme** file we are searching for is supposedly located, we should be able to see it by listing the contents of the directory. We do so with one of the most frequently used Linux commands, `ls` (list).\
\
**Listing the contents of the current directory with the `ls` command:**

```shell-session
bandit0@bandit:~$ ls
readme
```

Like most operating systems, Linux organizes files into directories, which are nested in a tree structure. Without a GUI to use (like Explorer on Windows), we traverse the directories and list their contents on a remote server using text commands. You’ll become comfortable navigating the file structure in this manner fairly quickly with a bit of practice.

To read the contents of this **readme** file, we use a command called `cat`. Cat is short for _concatenate_ and it’s named so because the command _concatenates_ all the files passed to it as arguments and prints their contents to standard output for us to read. If it’s just passed one file, there is nothing to concatenate and the contents of that single file are simply printed to the screen.

**Reading a file with the `cat` command:**

```shell-session
bandit0@bandit:~$ cat readme
boJ9****************************
```

Copy this first flag somewhere on your computer as it will be used to log in to level one. You may close the current SSH connection to the Bandit server by using the command `exit`.

### Key Takeaways

* Accessing a remote host over **ssh**
* Issuing basic shell **commands**
* Listing files with **ls**
* Reading files with **cat**
