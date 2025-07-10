import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import Token from '@/models/Token'

export async function GET(req: Request) {
  try {
    await connectToDB()

    const { searchParams } = new URL(req.url)
    const chain = searchParams.get('chain')
    const status = searchParams.get('status')

    const query: any = {}
    if (chain) query.chain = chain.toUpperCase()
    if (status) query.status = status.toLowerCase()

    const tokens = await Token.find(query).sort({ createdAt: -1 })

    const tokenAddresses = tokens.map(t => t.address)

    const prices = await fetchPricesForSolanaTokens(tokenAddresses)

    // 🧪 Enrich the tokens with live prices
    const enriched = tokens.map(token => {
      const price = prices[token.address] || 0
      return {
        ...token.toObject(),
        livePrice: price
      }
    })


    return NextResponse.json(enriched)


  } catch (err: any) {
    console.error('Failed to fetch tokens:', err)
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 })
  }
}


// Utility function
async function fetchPricesForSolanaTokens(addresses: string[]) {
  const prices: Record<string, number> = {}

  // Sample Jupiter Ultra Lite API loop (batch fetch doesn't exist yet)
  for (const address of addresses) {
    try {
      const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${address}`)
      const data = await res.json()
      console.log(`Response for ${address}:`, JSON.stringify(data, null, 2))
      prices[address] = data?.[address]?.usdPrice || 0
    } catch (err) {
      console.error(`Error fetching price for ${address}`, err)
      prices[address] = 0
    }
  }

  return prices
}
