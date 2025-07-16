import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import Token from '@/models/Token'
import TokenSignal from '@/models/TokenSignal'

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

    // Fetch latest price for each token
    const prices = await fetchPricesForSolanaTokens(tokenAddresses)

    // Fetch latest signal per token
    const signals = await TokenSignal.aggregate([
      { $match: { address: { $in: tokenAddresses } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$address",
          signal: { $first: "$$ROOT" },
        },
      },
    ])

    const signalMap = new Map<string, any>()
    signals.forEach(entry => {
      signalMap.set(entry._id, entry.signal)
    })

    // Build enriched token list
    const enriched = tokens.map(token => {
      const address = token.address
      return {
        ...token.toObject(),
        livePrice: prices[address] || 0,
        signal: signalMap.get(address) || null,
      }
    })

    return NextResponse.json(enriched)
  } catch (err: any) {
    console.error('❌ Failed to fetch tokens:', err)
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 })
  }
}

// 🔧 Helper: Fetch token prices from Jupiter
async function fetchPricesForSolanaTokens(addresses: string[]) {
  const prices: Record<string, number> = {}

  for (const address of addresses) {
    try {
      const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${address}`)
      const data = await res.json()
      prices[address] = data?.[address]?.usdPrice || 0
    } catch (err) {
      console.error(`⚠️ Price fetch failed for ${address}:`, err)
      prices[address] = 0
    }
  }

  return prices
}
