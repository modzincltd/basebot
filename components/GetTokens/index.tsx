'use client'
import { useEffect, useState } from 'react'


type Token = {
  token: {
    name: string
    symbol: string
    address: string
    icon_url: string | null
    exchange_rate: string | null
    decimals: string
    holders: string
  }
  value: string
}

type Props = {
  tokens: Token[]
}

export default function TokenList({ address }: Props) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch('/api/get-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        })

        const data = await res.json()
        setTokens(data.items || []) // 👈 Ensures it's an array or empty

        console.log('Fetched tokens:', data.items)

      } catch (err) {
        console.error('Failed to fetch tokens:', err)
      } finally {
        setLoading(false)
      }
    }

    if (address) fetchTokens()
  }, [address])

  if (loading) return <p>Loading tokens...</p>
 
 // if (!tokens.length) return <p>No tokens found for this wallet. {address}</p>

  return (
    <div className="overflow-x-auto rounded shadow border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-700 bg-white">
        <thead className="bg-gray-100 uppercase text-xs text-gray-500">
          <tr>
            <th className="px-4 py-3">Logo</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Holders</th>
            <th className="px-4 py-3">Exchange Rate</th>
            <th className="px-4 py-3">Balance</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((item, idx) => {
            const { token, value } = item
            const balance = parseFloat(value) / 10 ** parseInt(token.decimals || '18')

            return (
              <tr key={idx} className="border-t border-gray-200">
                <td className="px-4 py-3">
                  {token.icon_url ? (
                    <img src={token.icon_url} alt={token.symbol} className="w-6 h-6" />
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">{token.name}</td>
                <td className="px-4 py-3">{token.symbol}</td>
                <td className="px-4 py-3 break-all">{token.address}</td>
                <td className="px-4 py-3">{token.holders}</td>
                <td className="px-4 py-3">
                  {token.exchange_rate ? Number(token.exchange_rate).toFixed(6) : 'N/A'}
                </td>
                <td className="px-4 py-3">{balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <pre>{JSON.stringify(tokens, null, 2) }</pre>
      
    </div>
  )

   return (
    JSON.stringify(tokens, null, 2)
  )

}
