import { Contract, ethers } from 'ethers'
import SWAP_ROUTER_ABI from './abis/SwapRouter.json' // add this ABI file

const SWAP_ROUTER = '0x5615CDAb10dc425a742d643d949a7F474C01abc4'
const USDbC = '0xd9aa36f3d1c7edc5f0d3e0e5a582e40e395e1936'
const WETH = '0x4200000000000000000000000000000000000006'

export async function executeTrade(
  signer: ethers.Signer,
  amountIn: string // in ETH string, e.g., "10"
) {
  const router = new Contract(SWAP_ROUTER, SWAP_ROUTER_ABI, signer)

  const amountInWei = ethers.parseUnits(amountIn, 6) // USDbC is 6 decimals
  const amountOutMin = 0 // slippage protection – you should set this properly

  // Approve USDbC for swap
  const usdbc = new Contract(
    USDbC,
    ['function approve(address spender, uint256 amount) public returns (bool)'],
    signer
  )
  await usdbc.approve(SWAP_ROUTER, amountInWei)

  // Swap
  const tx = await router.exactInputSingle({
    tokenIn: USDbC,
    tokenOut: WETH,
    fee: 500,
    recipient: await signer.getAddress(),
    deadline: Math.floor(Date.now() / 1000) + 60 * 5,
    amountIn: amountInWei,
    amountOutMinimum: amountOutMin,
    sqrtPriceLimitX96: 0,
  })

  await tx.wait()
  return tx.hash
}
