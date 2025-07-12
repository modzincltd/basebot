"use client"

import { useEffect, useState } from "react"
import { Sparklines, SparklinesLine } from "react-sparklines"
import compactNumber from "@/utils/compactNumber"
//import TokenChartData  from "../TokenChartData"

export default function TokenInsightPanel({ tokenAddress }: { tokenAddress: string }) {
  const [tokenData, setTokenData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const res = await fetch(`https://lite-api.jup.ag/ultra/v1/search?query=${tokenAddress}`)
        const data = await res.json()

        if (!data?.length) {
          setError("Token not found")
        } else {
          setTokenData(data[0])

          console.log("Fetched token data:", data[0])


        }
      } catch (err) {
        setError("Error fetching token info")
      } finally {
        setLoading(false)
      }
    }

    fetchTokenData()
  }, [tokenAddress])

  if (loading) return <p>Loading token data...</p>
  if (error) return <p className="text-red-500">{error}</p>
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

  const generateSignal = (stats: any) => {
    const { priceChange, numNetBuyers, buyVolume, sellVolume } = stats

    if (priceChange > 5 && numNetBuyers > 100) return "🔥"
    if (priceChange > 3 && buyVolume > sellVolume) return "📈"
    if (priceChange < -5 && numNetBuyers < 0) return "🔻"
    if (priceChange < -3 && sellVolume > buyVolume) return "⚠️"

    return "-"
  }

  const calculateRiskScore = () => {
    let score = 100
    if (!audit?.mintAuthorityDisabled) score -= 40
    if (!audit?.freezeAuthorityDisabled) score -= 30
    if (audit?.topHoldersPercentage > 60) score -= 20

    if (score > 80) return "🟢 Low Risk"
    if (score > 50) return "🟠 Medium Risk"
    return "🔴 High Risk"
  }

  const mockPriceTrend = [0.012, 0.013, 0.0125, 0.0138, 0.0142] // Replace with real data later

  return (
    <div className="bg-white shadow rounded p-6 mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <img src={icon} alt={name} className="w-12 h-12 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{name} ({symbol})</h2>
          <p className="text-sm text-gray-500">
            {isVerified ? "✅ Verified" : "⚠️ Unverified"} | Organic Score: <span className="capitalize">{organicScoreLabel}</span>
          </p>
        </div>
      </div>

     {/*<TokenChartData tokenAddress={tokenAddress} />*/}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div><strong>Price:</strong> ${usdPrice.toFixed(6)}</div>
        <div><strong>Market Cap:</strong> ${compactNumber(mcap)}</div>
        <div><strong>FDV:</strong> ${compactNumber(fdv)}</div>
        <div><strong>Liquidity:</strong> ${compactNumber(liquidity)}</div>
        <div><strong>Circulating Supply:</strong> {compactNumber(circSupply)}</div>
        <div><strong>Total Supply:</strong> {compactNumber(totalSupply)}</div>
        <div><strong>Holders:</strong> {compactNumber(holderCount)}</div>
        <div><strong>Risk Score:</strong> {calculateRiskScore()}</div>
      </div>

        <div className="border-t grid grid-cols-12 pt-4">
          <div>Interval</div>
          <div>Price Change</div>
          <div>Volume Change</div>
          <div>Buy Volume</div>
          <div>Sell Volume</div>
          <div>Liquidity Change</div>
          <div>Holder Change</div>
        <div className="col-span-2">Signal</div>
         </div>
      {[{ label: "5m", stats: stats5m }, { label: "1H", stats: stats1h }, { label: "6H", stats: stats6h }, { label: "24H", stats: stats24h }].map(({ label, stats }) => (
        <div key={label} className="border-t grid grid-cols-12 pt-4">
        
          
         


            <div>{label}</div>
            <div>{stats.priceChange.toFixed(2)}%</div>
            <div>{stats.volumeChange.toFixed(2)}%</div>
            <div>${compactNumber(stats.buyVolume)}</div>
            <div>${compactNumber(stats.sellVolume)}</div>
            <div>{stats.liquidityChange.toFixed(2)}%</div>
            <div>{stats.holderChange.toFixed(2)}%</div>
            <div className="col-span-1">{generateSignal(stats)}</div>
            <div className="col-span-1">
              <Sparklines data={mockPriceTrend} width={100} height={30} margin={5}>
                <SparklinesLine color="blue" />
              </Sparklines>
            </div>


           
        </div>
        
      ))}

      <div className="text-sm space-y-1">
        {twitter && (
          <p><strong>Twitter:</strong> <a href={twitter} className="text-blue-600 underline" target="_blank" rel="noreferrer">{twitter}</a></p>
        )}
        <p><strong>Solana Explorer:</strong> <a href={`https://solscan.io/token/${tokenData.id}`} className="text-blue-600 underline" target="_blank" rel="noreferrer">View on Solscan</a></p>
      </div>
    </div>
  )
}
