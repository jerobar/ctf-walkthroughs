# Cross-Site Request Forgery

Cross-Site Request Forgery (CSRF) is an attack which causes the victim user to carry out an (authenticated) action with the application unintentionally.

For a CSRF attack to be possible, three conditions must exist:

- A relevant action
- Cookie-based session handling
- No unpredicatble request parameters

### Impact

Impact is contextual and depends on the application.

- Confidentiality: Can be None / Partial (Low) / High
- Integrity: usually either Partial (Low) or High
- Availability: Can be None / Partial (Low) / High

## Locating CSRF

### Black Box

- Map the application and identify all application functions that satisfy the three conditions for a CSRF.
- Create a PoC script to exploit the CSRF (GET request - img tag with src attribute set to vulnerable url, POST - form with hidden fields for all the required params and action set to the vulnerable URL).

### White Box

- Identify the framework used by the application and determine how it defends against CSRF.
- Review code to ensure the built in defenses have not been disabled.
- Review all sensitive functionality to ensure the CSRF defenses have been applied.

## Exploiting CSRF

- Use a hidden img element with a malicious src attribute to send GET requests.
- Use an invisible form (target="csrf-iframe") to send POST requests.
- Use JavaScript to do either.

## Preventing CSRF

- Use a CSRF token in the relevant requests (primary defense). Should be unpredictable, tied to the user's session, and validated before the relevant action is executed. These tokens generally should not be submitted in the URL query string or within cookies.
- Use of SameSite cookies (additional defense).
- Use of Referer header (inadequete defense).

## Resources

- OWASP – CSRF: https://owasp.org/www-community/attacks/csrf
- OWASP – CSRF Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
