# CORS

Cross-Origin Resource Sharing (CORS) vulnerabilities arise when misconfigurations in CORS headers allow potentially malicious websites to access sensitive information from an application. Often these issues arise when developers use dynamic generation of the Access-Control-Allow-Origin header, such as generating it from the client-supplied Origin header, parsing the Origin header in an insecure way, or whitelisting the null Origin value.

OWASP Top 10 - A5 - Security Misconfiguration.
