# Cross-Origin Resource Sharing

Cross-Origin Resource Sharing (CORS) vulnerabilities arise when misconfigurations in CORS headers allow potentially malicious websites to access sensitive information from an application. Often these issues arise when developers use dynamic generation of the Access-Control-Allow-Origin header, such as generating it from the client-supplied Origin header, parsing the Origin header in an insecure way, or whitelisting the null Origin value.

OWASP Top 10 - A5 - Security Misconfiguration.

### Same-Origin Policy

The Same-Origin Policy (SOP) is a security mechanism enforced by browsers to control access to data between applications. This does not prevent _writing_ between applications, it prevents _reading_. Access is determined based on the _origin_.

Origin is defined as the same scheme (protocol), hostname (domain), and port.

### Cross-Origin Resource Sharing

Cross-Origin Resource Sharing (CORS) is a mechanism that uses HTTP headers to define origins that the browser permits to load resources.

The Access-Control-Allow-Origin header indicates whether the response can be shared with requesting code from a given origin. The header can be set to `*`, `<origin>`, or `null`.

The Access-Control-Allow-Credentials header allows cookies to be included in cross-origin requests. This may be set to `true` or `false`.

### Impact

- Confidentiality: Can be None / Partial (Low) / High.
- Integrity: Usually either Partial or Hight.
- Availability: Can be None / Partial (Low) / High.

## Locating CORS Vulnerabilities

### Black Box

- Test the application for dynamic ACAO header generation and determine how it is being implemented. Does it allow the null origin? Does it restrict the protocol? Does it allow credentials?
- Review the application's functionality and determine how to prove impact.

### White Box

- Identify the framework/technologies being used and learn how they set CORS rules.
- Review code to identify any misconfigurations.

## Prevention

- Properly configure CORS to only allow trusted sites with a whitelist.
- Avoid whitelisting the null Origin.
- Avoid wildcards in internal networks.

## Resources

- https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties
- https://quitten.github.io/StackStorm/
