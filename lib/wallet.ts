// lib/wallet.ts
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Modzbot',
  projectId: 'YOUR_WALLETCONNECT_ID',
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true, 
  connectors,
  publicClient,
})
