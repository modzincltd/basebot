'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SolanaLinks from '../SolanaLinks'
import AddressCell from '../AddressCell'

type Token = {
  _id: string
  name: string
  address: string
  chain: string
  status: string
}

type AddTokenFormProps = {
  chain?: string // optional prop
}

export default function TokenTable({ chain: defaultChain = '' }: AddTokenFormProps) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [chain, setChain] = useState()
  const [status, setStatus] = useState()

  const fetchTokens = async () => {
    const queryParams = new URLSearchParams()
    if (chain) queryParams.append('chain', chain)
    if (status) queryParams.append('status', status)

    const res = await fetch(`/api/tokens/get?${queryParams.toString()}`)
    const data = await res.json()

    console.log('Fetched tokens:', data)
    setTokens(data)
  }

  useEffect(() => {
    fetchTokens()
  }
  , []) 

  useEffect(() => {
    fetchTokens()
  }, [chain, status])



    const CellChange = ( {theValue} ) => {
      const numeric = typeof theValue === 'number' ? theValue : null

      return (
        <td
          className={`border p-1 text-white text-xs ${
            numeric > 0
              ? 'bg-green-500'
              : numeric < 0
              ? 'bg-red-500'
              : 'bg-gray-200 text-black'
          }`}
        >
          {numeric !== null ? `${numeric.toFixed(2)}%` : '—'}
        </td>
      )
    }
    
   const RSI = ({ theValue }) => {
      const numeric = typeof theValue === 'number' ? theValue : null

      const getColorFromRSI = (rsi: number | null) => {
        if (rsi === null) return 'hsl(0, 0%, 80%)' // Gray fallback
        const hue = Math.max(0, Math.min(120, (100 - rsi) * 1.2)) // Red to green
        return `hsl(${hue}, 70%, 60%)`
      }

      const isHotBuy = numeric !== null && numeric < 40

      return (
        <td
          className={`border p-1 text-center text-xs font-semibold text-white relative ${
            isHotBuy ? 'animate-pulse ring-2 ring-green-300' : ''
          }`}
          style={{ backgroundColor: getColorFromRSI(numeric) }}
        >
          {isHotBuy ? '⭐ ' : ''}
          {numeric !== null ? `${numeric.toFixed(2)}` : '—'}
          {isHotBuy ? ' ⭐' : ''}
        </td>
      )
    }




  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Saved Tokens</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select value={chain} onChange={(e) => setChain(e.target.value)} className="border p-2">
          <option value="">All Chains</option>
          <option value="base">Base</option>
          <option value="eth">ETH</option>
          <option value="solana">solana</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2">
          <option value="">All Statuses</option>
          <option value="live">Live</option>
          <option value="paused">Paused</option>
          <option value="removed">Removed</option>
        </select>

        <button onClick={fetchTokens} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Refresh
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse">
       <thead>
  <tr className="bg-gray-200 text-left">
    <th className="border p-1">Name</th>
    <th className="border p-1">Address</th>
    <th className="border p-1">Chain</th>
    <th className="border p-1">Status</th>
    <th className='border p-1'>Live</th>
  
    <th className='border p-1'>RSI</th>
    <th className='border p-1'>5m %</th>
    <th className='border p-1'>30m %</th> 
    <th className='border p-1'>1H %</th>
    <th className='border p-1'>6H %</th>
    <th className='border p-1'>12H %</th>
    <th className='border p-1'>24H %</th>


    
    <th className="border p-1">Links</th>
    <th className='border p-1'>View</th>
  </tr>
</thead>
<tbody>
  {tokens.length === 0 ? (
    <tr>
      <td colSpan={10} className="border p-2 text-center text-gray-500">
        No tokens found
      </td>
    </tr>
  ) : (
    tokens.map((token) => {

      
     
     
      return (
        <tr key={token._id}>
          <td className="border p-1 text-xs">{token.name}</td>
          <td className="border p-1 font-mono text-xs"><AddressCell address={token.address} /></td>
          <td className="border p-1 text-xs">{token.chain}</td>
          <td className="border p-1 text-xs">{token.status}</td>
          <td className='border p-1 text-xs'>{token?.livePrice.toFixed(6)}</td>
          <RSI theValue={token?.signal?.rsi} />

          <CellChange theValue={token?.signal?.change_5m} />
          <CellChange theValue={token?.signal?.change_30m} />
          <CellChange theValue={token?.signal?.change_1h} />
          <CellChange theValue={token?.signal?.change_6h} />
          <CellChange theValue={token?.signal?.change_12h} />
          <CellChange theValue={token?.signal?.change_24h} />
           

        

        

        


          <td className='border p-2'><SolanaLinks tokenAddress={token.address} /></td>
          <td className='border p-2'><Link href={`/token/${token.chain}/${token.address}`}>VIEW</Link></td>
        </tr>
      )
    })
  )}
</tbody>

      </table>
    </div>
  )
}
