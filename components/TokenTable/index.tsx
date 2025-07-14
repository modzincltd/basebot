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
    <th className="border p-2">Name</th>
    <th className="border p-2">Address</th>
    <th className="border p-2">Chain</th>
    <th className="border p-2">Status</th>
    <th className='border p-2'>Live</th>
    <th className='border p-2'>L5</th>
    <th className='border p-2'>H5</th>
    <th className='border p-2'>H15</th>
    <th className='border p-2'>L15</th>
    <th className='border p-2'>RSI 3</th>
    <th className='border p-2'>RSI 5</th>
    <th className='border p-2'>RSI 14</th>
    <th className='border p-2'>ROC 5</th>
    <th className='border p-2'>SMA 5/15</th>
    <th className="border p-2">Links</th>
    <th className='border p-2'>View</th>
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
      const rsi3 = token.signal?.rsi_3
      const rsi5 = token.signal?.rsi_5
      const rsi14 = token.signal?.rsi_14
      const roc5 = token.signal?.roc_5
      const sma5 = token.signal?.sma_5
      const sma15 = token.signal?.sma_15
      const smaTrend =
        sma5 > sma15 ? 'text-green-600 font-semibold' :
        sma5 < sma15 ? 'text-red-600 font-semibold' : ''

      return (
        <tr key={token._id}>
          <td className="border p-2">{token.name}</td>
          <td className="border p-2 font-mono text-xs"><AddressCell address={token.address} /></td>
          <td className="border p-2">{token.chain}</td>
          <td className="border p-2">{token.status}</td>
          <td className='border p-2'>{token.livePrice?.toFixed(6) ?? '-'}</td>
          <td className="border p-2">{token.signal?.low_5m?.toFixed(6) ?? '-'}</td>
          <td className="border p-2">{token.signal?.high_5m?.toFixed(6) ?? '-'}</td>
          <td className="border p-2">{token.signal?.high_15m?.toFixed(6) ?? '-'}</td>
          <td className="border p-2">{token.signal?.low_15m?.toFixed(6) ?? '-'}</td>

          <td className={`border p-2 ${
            rsi3 !== undefined && rsi3 < 30 ? 'text-green-600 font-semibold' :
            rsi3 > 70 ? 'text-red-600 font-semibold' : ''
          }`}>
            {rsi3?.toFixed(1) ?? '-'}
          </td>

          <td className={`border p-2 ${
            rsi5 !== undefined && rsi5 < 30 ? 'text-green-600 font-semibold' :
            rsi5 > 70 ? 'text-red-600 font-semibold' : ''
          }`}>
            {rsi5?.toFixed(1) ?? '-'}
          </td>

          <td className={`border p-2 ${
            rsi14 !== undefined && rsi14 < 30 ? 'text-green-600 font-semibold' :
            rsi14 > 70 ? 'text-red-600 font-semibold' : ''
          }`}>
            {rsi14?.toFixed(1) ?? '-'}
          </td>

          <td className={`border p-2 ${
            roc5 !== undefined && roc5 > 0 ? 'text-green-600' :
            roc5 < 0 ? 'text-red-600' : ''
          }`}>
            {roc5?.toFixed(2) ?? '-'}%
          </td>

          <td className={`border p-2 ${smaTrend}`}>
            {sma5?.toFixed(6) ?? '-'} / {sma15?.toFixed(6) ?? '-'}
          </td>

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
