---
description: >-
  Level ten continues the string manipulation with an introduction to base64
  encoding data.
---

# Bandit - Level 10

The [instructions](https://overthewire.org/wargames/bandit/bandit11.html) for Level Ten indicate that the contents of the **data.txt** file have been base64 encoded.

### Hints

<details>

<summary>Hint One</summary>

The `base64` command is all you need to solve this. Check the man page if you’re having trouble.

</details>

### Full Walkthrough

#### Base64 Encoding

Base64 is a method for encoding arbitrary binary data into ASCII text. It can be recognized as a string containing the characters “A-Z”, “a-z”, “0-9”, “+” and “/”, and “=” as a padding character at the end. It will look something like this:

`WW91IGRlY29kZWQgdGhpcz8gSSBhcHBsYXVkIHlvdXIgY3VyaW91c2l0eS4=`

Base64 was devised as a safe and convenient way to store and transmit information over media that is specifically designed for textual data. It is still used in a wide variety of contexts today and you should be able to recognize it when you see it.

**Decoding the Base64-encoded `data.txt`:**

```shell-session
bandit10@bandit:~$ cat data.txt
VGhlIHBhc3N3b3JkIGlzIElGdWt3S0dzRlc4TU9xM0lSRnFyeEUxaHhUTkViVVBSCg==
bandit10@bandit:~$ base64 -d data.txt
The password is IFuk****************************
```

### Key Takeaways

* Recognizing **base64** encoding.
* Using the **base64** command to decode encoded text data.
