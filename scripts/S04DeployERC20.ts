import 'dotenv/config'
import { ethers } from 'ethers'
import configs from '../import/erc20.json'

async function deployAndMintERC20() {
  // Connect to the Ethereum network
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT, 167008)
  const signer = new ethers.Wallet(`${process.env.PK}`, provider)
  console.log(
    `Deploying on behalf of:`,
    signer.address,
    'with balance:',
    await provider.getBalance(signer.address)
  )

  // Deploy the ERC20 contract
  const factory = new ethers.ContractFactory(configs.abi, '', signer)
  const contract = await factory.deploy()
  await contract.deploymentTransaction()?.wait(1)

  const deployedAddr = await contract.getAddress()
  console.log(`Deployed to:`, deployedAddr)
  console.log(`Transaction:`, contract.deploymentTransaction()?.hash)

  const erc20 = new ethers.Contract(deployedAddr, configs.abi, signer)
  // Mint tokens to your address
  await erc20.mint(signer.address, 1000)

  console.log('ERC20 contract deployed and tokens minted successfully!')
}

deployAndMintERC20().catch((error) => {
  console.error('Error deploying ERC20 contract:', error)
})
