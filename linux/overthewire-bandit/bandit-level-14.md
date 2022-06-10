---
description: >-
  Level Fourteen is the first in a short series of challenges involving some
  basic networking tasks using a new (to us) tool.
---

# Bandit - Level 14

The [instructions](https://overthewire.org/wargames/bandit/bandit15.html) for Level Fourteen simply ask us to submit the password for the current level (the one found in level thirteen) to **port 30000** on **localhost**.

### Hints

<details>

<summary>Hint One</summary>

Use netcat (command `nc`) to send the password. The password will need to be passed to netcat’s standard input.

</details>

### Full Walkthrough

The actual steps to complete this level are very simple – it’s just a single command. We’ll therefore go over a little background information in this walkthrough, but if you’re already familiar with these topics you can skip directly to the terminal window below for the solution.

#### **Hosts and Ports**

In networking parlance, the individual devices that communicate across a network are often called “hosts” or “end systems”. Your computer is a “host” as is the Bandit game server as is the server that delivered the website you’re currently reading. Each host is identified by an IP address. The domain names we see – bandit.labs.overthewire.org or jerobar.com are an abstraction to make things easier to remember for humans. Those domains are each mapped on to an IP address (through a protocol called DNS), which is how the computers are identifying one another for communication.

While each host on a system is identified by a single IP, each host may also have a number of ports. A port is just a number between 0 and 65535 that is used to specify which process or network service on the host machine is to receive the incoming data.

When we ssh into bandit.labs.overthewire.org we always specify port 2220, which is where the host is listening for connections to the Bandit game. That same host may, however, be listening on port 80 and 443 HTTP requests to serve web pages, or on port 23 to allow FTP connections, etc. If we imagine an IP address as corresponding to a large commercial buildings’ physical address, the port number may correspond to a specific office or storefront within that same building.

The name **localhost** (IP 127.0.0.1) is used to refer to the local machine. This means that when we’re asked to submit the password to **localhost**, we’re sending a packet from the Bandit game server to _itself_ on another port.

#### **Port Numbers**

While port numbers can be any number within the range of 0 – 65535, there are certain ports that are typically reserved for common services like HTTP, SMTP, FTP, etc. These port numbers fall in the range of 0 – 1023 and are known as the “well-known” port numbers.

#### **Netcat**

Netcat (command **nc**) is a popular networking utility that allows us to send data to a remote host and also listen for incoming data on a local port. If you’re interested in learning about hacking, you’ll be seeing a lot of this tool. Below we’re simply telling netcat to send the data we’ve piped to it via the **echo** command to localhost on port 30000. The machine responds with the password to level fifteen.

Sending our password to localhost:30000:

```shell-session
bandit14@bandit:~$ echo 4wcY**************************** | nc localhost 30000
Correct!
BfMY****************************
```

### Key Takeaways

* Some basics on IP addresses, hosts, ports, and localhost.
* Using the Netcat (**nc**) tool to send data.
