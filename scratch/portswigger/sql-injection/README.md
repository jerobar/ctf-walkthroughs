# SQL Injection

SQL Injection (SQLi) is a vulnerability that consists of an attacker interfering with the SQL queries an application makes to a database.

OWASP Top 10: A1 - Injection.

#### Example

An attacker may submit `admin'--` as the username to the SQL query below, bypassing the password check:

```sql
SELECT * FROM users WHERE username='admin'--' AND password='';
```

### Impact

- Confidentiality: SQLi may be used to access sensitive information from the database, such as usernames and passwords.
- Integrity: SQLi may be used to alter data in the database.
- Availability: SQLi may be used to delete data from the database.

SQLi may also lead to remote code execution.

### Types of SQLi

- In-Band (Classic) - Error or UNION based. Results of the query are presented directly in the output.
- Inferential (Blind) - Boolean or Time based. Results of the query must be inferred indirectly as no data is transferred.
- Out-of-Band. A network connection is triggered to a system that the attacker controls (e.g. DNS, HTTP).

## Locating SQLi

### Black/Grey Box

- Map the application, making notes of input vectors that may involve database communication.
- Fuzz the application with SQL-specific character such as `'`, `"`, `--`, etc. looking for errors or anomylous behavior.
- Submit boolean conditions such as `OR 1=1` and `OR 1=2` and look for differences in the application's response.
- Submit payloads designed to trigger time delays and examine the response.
- Submit OAST payloads designed to trigger an out-of-band network interaction and monitor for resulting interactions.

### White Box

- Enable web server and database logging.
- Map the application.
- Regex search for all instances of code that communicate with the database.
- Follow the code path for all input vectors.
- Test any potential SQLi.

## Exploiting SQLi

### Error-Based

- Submit SQL-specific characters and look for errors or anomolies.

### UNION-Based

- Figure out the number of columns in the query and their data types, e.g. using the ORDER BY clause or NULL select values then testing each column using different data types.
- The number and order of columns must be the same in all queries and the data types must be compatible.
- Use the UNION operator to output information from the database.

### Boolean-Based

- Submit a boolean condition that evaluates to true/false and note difference in responses.
- Write a program using conditional statements to ask the database a series of true/false questions to exfiltrate data.

### Time-Based

- Submit a payload that pauses the application for a specified period of time.
- Write a program using conditional statements to ask the database a series of true/false questions to exfiltrate data.

### Out-of-Band

- Submit OAST payloads designed to trigger and out-of-band network query and monitor for any resulting interactions.

Note that automated SQLi exploitation tools such as SQLMap exist.

## Preventing SQLi

- Use of prepared statements/parameterized queries (best solution).
- Use of stored procedures.
- Whitelist input validation.
- Escape all user supplied input (last resort).

Additional defenses:

- Enforcing least privilege.
- Performing whitelist input validation as a secondary defense.

## Resources

- OWASP – SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection
- OWASP – SQL Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- PentestMonkey – SQL Injection: http://pentestmonkey.net/category/cheat-sheet/sql-injection
