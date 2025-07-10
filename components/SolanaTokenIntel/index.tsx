'use client'

import { useEffect, useState } from 'react'

export default function JupiterTokenInfo({ tokenAddress }: { tokenAddress: string }) {
  const [tokenData, setTokenData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const res = await fetch(
          `https://lite-api.jup.ag/ultra/v1/search?query=${tokenAddress}`,
        )
       const json = await res.json()
if (!json?.length) {
  setError('Token not found')
} else {
  setTokenData(json[0]) // ✅ directly use the first item
}
      } catch (err) {
        setError('Error fetching token info')
      } finally {
        setLoading(false)
      }
    }

    fetchTokenData()
  }, [])

  if (loading) return <p>Loading token data...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!tokenData) return null

  const {
    name,
    symbol,
    icon,
    twitter,
    usdPrice,
    circSupply,
    totalSupply,
    holderCount,
    mcap,
    fdv,
    liquidity,
    audit,
    isVerified,
    organicScoreLabel,
    cexes,
    tags,
    firstPool,
    stats5m,
    stats1h,
    stats6h,
    stats24h,
    ctLikes,
    smartCtLikes,
  } = tokenData

   return (
    <div className="bg-white shadow rounded p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img src={icon} alt={name} className="w-12 h-12 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{name} ({symbol})</h2>
          <p className="text-sm text-gray-500">
            {isVerified ? '✅ Verified' : '⚠️ Unverified'} | Organic Score: <span className="capitalize">{organicScoreLabel}</span>
          </p>
        </div>
      </div>

      {/* Price & Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div><strong>Price:</strong> ${usdPrice.toFixed(6)}</div>
        <div><strong>Market Cap:</strong> ${mcap.toLocaleString()}</div>
        <div><strong>FDV:</strong> ${fdv.toLocaleString()}</div>
        <div><strong>Liquidity:</strong> ${liquidity.toLocaleString()}</div>
        <div><strong>Circulating Supply:</strong> {circSupply.toLocaleString()}</div>
        <div><strong>Total Supply:</strong> {totalSupply.toLocaleString()}</div>
        <div><strong>Holders:</strong> {holderCount.toLocaleString()}</div>
        <div><strong>Mint Authority:</strong> {audit?.mintAuthorityDisabled ? 'Disabled ✅' : 'Active ⚠️'}</div>
        <div><strong>Freeze Authority:</strong> {audit?.freezeAuthorityDisabled ? 'Disabled ✅' : 'Active ⚠️'}</div>
        <div><strong>Top Holders %:</strong> {audit?.topHoldersPercentage.toFixed(2)}%</div>
      </div>

      {/* Exchanges + Tags */}
      <div className="text-sm">
        <p><strong>Exchanges:</strong> {cexes?.join(', ')}</p>
        <p><strong>Tags:</strong> {tags?.join(', ')}</p>
        <p><strong>Twitter:</strong> <a className="text-blue-500 underline" href={twitter} target="_blank">{twitter}</a></p>
      </div>

      {/* First Pool Info */}
      <div className="text-sm text-gray-600">
        <p><strong>First Pool Created:</strong> {new Date(firstPool.createdAt).toLocaleString()}</p>
        <p><strong>Pool ID:</strong> {firstPool.id}</p>
      </div>

      {/* Social Likes */}
      <div className="text-sm">
        <p><strong>Contract Likes:</strong> {ctLikes}</p>
        <p><strong>Smart Likes:</strong> {smartCtLikes}</p>
      </div>

      {/* Stats Blocks */}
      <div className="space-y-4">
        {[
          { label: '5 min', stats: stats5m },
          { label: '1 hour', stats: stats1h },
          { label: '6 hour', stats: stats6h },
          { label: '24 hour', stats: stats24h },
        ].map(({ label, stats }) => (
          <div key={label} className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">📈 Stats ({label})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><strong>Price Change:</strong> {stats.priceChange.toFixed(2)}%</div>
              <div><strong>Volume Change:</strong> {stats.volumeChange.toFixed(2)}%</div>
              <div><strong>Buy Volume:</strong> ${stats.buyVolume.toLocaleString()}</div>
              <div><strong>Sell Volume:</strong> ${stats.sellVolume?.toLocaleString()}</div>
              <div><strong>Net Buyers:</strong> {stats.numNetBuyers}</div>
              <div><strong>Buys/Sells:</strong> {stats.numBuys}/{stats.numSells}</div>
              <div><strong>Organic Buys:</strong> {stats.numOrganicBuyers}</div>
              <div><strong>Liquidity Change:</strong> {stats.liquidityChange.toFixed(2)}%</div>
              <div><strong>Holder Change:</strong> {stats.holderChange.toFixed(2)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
