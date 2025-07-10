'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk'

export default function CoinbaseWalletConnect() {
  const [address, setAddress] = useState<string | null>(null)
  const [sdkInstance, setSdkInstance] = useState<any>(null)

  const SDK_OPTIONS = {
    appName: 'Modzbot',
    appLogoUrl: 'https://yourapp.com/logo.png',
    darkMode: true,
    chains: [
      {
        chainId: 8453,
        rpcUrl: 'https://mainnet.base.org',
      },
    ],
  }

  const connectWallet = async () => {
    const sdk = createCoinbaseWalletSDK(SDK_OPTIONS)
    setSdkInstance(sdk)

    const provider = sdk.getProvider()
    const ethersProvider = new ethers.BrowserProvider(provider as any)
    const signer = await ethersProvider.getSigner()
    const userAddress = await signer.getAddress()

    setAddress(userAddress)
    localStorage.setItem('wallet_connected', 'true')
    localStorage.setItem('wallet_address', userAddress) 
  }

  const disconnectWallet = () => {
    if (sdkInstance) {
      sdkInstance.disconnect?.()
    }
    setAddress(null)
    localStorage.removeItem('wallet_connected')
    localStorage.removeItem('wallet_address') 
  }

  // 🔁 Check on page load
  useEffect(() => {
    const shouldReconnect = localStorage.getItem('wallet_connected') === 'true'
    if (shouldReconnect) {
      connectWallet()
    }
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded space-y-2">
      {!address ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Connect Coinbase Wallet
        </button>
      ) : (
        <>
          <p className="text-green-700 break-all">Connected: {address}</p>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  )
}
