# Server-Side Request Forgery (SSRF)

Server-Side Request Forgery (SSRF) is a vulnerability that exploits trust relationships between servers to gain access to protected data and functionality. An attacker may induce an application server to make malicious requests to third parties that the attacker would not have the requisite permissions to query directly (such as a service behind a firewall).

OWASP Top 10 - A10 - Server-Side Request Forgery (SSRF).

### Types of SSRF

- Regular/In-Band - Response is returned directly by the application.
- Blind/Out-of-Band - Response is not returned by the application.

### Impact

Impact is highly contextual and depends on the application.

- Confidentiality: Can be None / Partial (Low) / High
- Integrity: Can be None / Partial (Low) / High
- Availability: Can be None / Partial (Low) / High

## Locating SSRF

### Black Box

- Map the application, identifying any request parameters that contain hostnames, IP addresses, or full URLs.
- For each identified parameter, modify its value to specify an alternative resource and observe how the application responds. If a defense is in place, attempt to circumvent it using known techniques.
- In the case of a Blind SSRF, you will need to monitor requests to a server you control. If no incoming connections are receieved, monitor the time taken for the application to respond.

### White Box

- Review source code and identify all request parameters that accept URLs.
- Determine which URL Parser is being used and if it can be bypassed. Ditto for any defenses.

## Exploiting SSRF

### Regular/In-Band

- If the application allows for user-supplied arbitrary URLs, determine if a port number can be specified. If so, scan the internal network. Attempt to connect to other services on the loopback address.
- If the application does not allow for user-supplied arbitrary URLs, try different encoding schemes e.g. 127.0.0.1 -> 2130706433 (decimal-encoded), etc. You may also try registering a domain name that resolves to an internal IP address (DNS Rebinding), using a server that redirects to an internal IP address (HTTP Redirection), or exploiting inconsistencies in URL parsing libraries.

### Blind/Out-of-Band

- Attempt to trigger an HTTP request to an external server you control (e.g. using Burp Collaborator) and monitor the system for network connections for the vulnerable server.
- If controls have been implemented, the same evasion techniques for Regular/In-Band SSRF apply.

## Preventing SSRF

- Sanitize and validate all client-supplied input data.
- Enforce the URL schema, port, and destination with a whitelist.
- Do not return raw responses to the client.
- Disable HTTP redirections (avoid HTTP Redirection bypass attacks).
- Segment remote resource access functionality in separate networks to reduce the impact of SSRF.
- Enforce "deny by default" firewall policies or network access control rules.

Note: Do not attempt to mitigate SSRF vulnerabilities using blacklists or regular expressions.

## Resources

- OWASP – SSRF: https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
- Server-Side Request Forgery Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- SSRF Bible Cheat Sheet: https://cheatsheetseries.owasp.org/assets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet_SSRF_Bible.pdf
- Preventing Server-Side Request Forgery Attacks: https://seclab.nu/static/publications/sac21-prevent-ssrf.pdf
- A New Era of SSRF - Exploiting URL Parser in Trending Programming Languages!: https://www.blackhat.com/docs/us-17/thursday/us-17-Tsai-A-New-Era-Of-SSRF-Exploiting-URL-Parser-In-Trending-Programming-Languages.pdf
