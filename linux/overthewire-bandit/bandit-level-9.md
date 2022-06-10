---
description: >-
  Level Nine involves more string manipulation and filtering non-ASCII
  characters.
---

# Bandit - Level 9

In [Level Nine](https://overthewire.org/wargames/bandit/bandit10.html), the password is one of the only human-readable strings in the `data.txt` file, and we’re told it is preceded by several “=” characters.

**Note:** After `cat`‘ing `data.txt` to look at its contents, you may need to use the `clear` command to clean up the shell.

### Hints

<details>

<summary>Hint One</summary>

This can be solved by piping the output of a single command run with `data.txt` as its sole argument into `grep` to check for the presence of the “=” character.

</details>

### Full Walkthrough

This is a fairly straightforward task that can be broken down into two steps:

* 1 – Identify the human-readable strings in `data.txt`
* 2 – `grep` these human-readable strings for the “=” character

These steps can become two chained commands:

`<identify human-readable strings> | grep =`

The `strings` command is used to print to standard output the strings of printable (human-readable) characters in files.

**Grepping the only human-readable strings for “=” characters:**

```shell-session
bandit9@bandit:~$ whatis strings
strings (1)     – print the strings of printable characters in files.
bandit9@bandit:~$ strings data.txt | grep =
========== the*2i”4
=:G e
========== password
<I=zsGi
Z)========== is
A=|t&E
Zdb=
c^ LAh=3G
*SF=s
&========== truK****************************
S=A.H&^
```

{% hint style="info" %}
**History and Auto-Complete**

Typing and re-typing all of these commands can get tedious. You can cycle through previous commands you have entered by hitting the up and down arrow keys. Some commands can also be auto-completed by pressing the **tab** key. For example, in this exercise you could type `cat d`, followed by **tab**, and it would auto-complete to `cat data.txt` because that is the only file in the directory beginning with a d.
{% endhint %}

### Key Takeaways

* Using the **strings** command to identify human-readable strings in a file.
* Using the **arrow keys** and **tab** for command history and auto-complete.
