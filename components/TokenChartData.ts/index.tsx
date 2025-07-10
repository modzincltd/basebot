'use client'
import { useEffect, useState } from 'react'

type PricePoint = {
  timestamp: string
  price: number
}

type TokenPriceData = {
  allData: PricePoint[]
  last5m: PricePoint[]
  last1h: PricePoint[]
  last6h: PricePoint[]
  last24h: PricePoint[]
}

export default function TokenChartData({ address }: { address: string }) {
  const [priceData, setPriceData] = useState<TokenPriceData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/token-prices/${address}`)
      const json = await res.json()
      setPriceData(json)
    }
    fetchData()
  }, [address])

  if (!priceData) return <div>Loading chart data...</div>

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Price Data</h3>
      <ul className="text-sm">
        <li>5m: {priceData.last5m.length} pts</li>
        <li>1h: {priceData.last1h.length} pts</li>
        <li>6h: {priceData.last6h.length} pts</li>
        <li>24h: {priceData.last24h.length} pts</li>
        <li>All: {priceData.allData.length} pts</li>
      </ul>
    </div>
  )
}