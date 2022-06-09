# SQL injection UNION attack, finding a column containing text

This lab contains an SQL injection vulnerability in the product category filter.

To determine which columns are of type string, we will need to iteratively try a UNION with a string value such as 'a' in each position, watching for errors.

```html
GET /filter?category=Accessories'+UNION+SELECT+NULL,'vnTt3X',NULL-- HTTP/1.1
```

Note that we were asked to have the database return the string `vnTt3X`.
