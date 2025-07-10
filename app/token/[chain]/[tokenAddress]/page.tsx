"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import TradingViewWidget from "@/components/TradingViewWidget"
import TokenMetaPanel from "@/components/TokenMetaPanel"
import SolanaTokenIntel from "@/components/SolanaTokenIntel"
import TokenInsightPanel from "@/components/TokenInsightPanel"
import AddressCell from "@/components/AddressCell"
import SolanaLinks from "@/components/SolanaLinks"

type Props = {
  params: {
    chain: string
    tokenAddress: string
  }
}

export default function TokenDetailPage({ params: { chain, tokenAddress } }: Props) {
  const [token, setToken] = useState<any | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/tokens/${chain}/${tokenAddress}`, { cache: 'no-store' })

        if (!res.ok) {
          setError(true)
          return
        }

        const data = await res.json()
        setToken(data)
      } catch (err) {
        console.error("Failed to fetch token:", err)
        setError(true)
      }
    }

    fetchToken()
  }, [chain, tokenAddress,token])

  if (error) return notFound()
  if (!token) return <p className="text-center py-10">Loading token data...</p>

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <h1 className="col-span-12 text-3xl font-bold mb-4">{token.name} on {chain}</h1>

      <div className="col-span-12">
         <TokenMetaPanel token={token} />
      </div>

      <div className="col-span-12">
        <SolanaLinks tokenAddress={token.address} />
      </div>

      <div className="col-span-12">
        <TokenInsightPanel tokenAddress={token.address} />
      </div>
     
    </div>
  )
}
