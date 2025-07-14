import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import Token from '@/models/Token'
import TokenSignal from '@/models/TokenSignal' // ⬅️ import the signal model

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

    // Get live prices
    const prices = await fetchPricesForSolanaTokens(tokenAddresses)

    // Get latest signal for each address
    const signals = await TokenSignal.find({
      address: { $in: tokenAddresses }
    })
      .sort({ timestamp: -1 }) // latest signals
      .lean()

    // Map address => signal
    const signalMap = new Map<string, any>()
    signals.forEach(sig => {
      if (!signalMap.has(sig.address)) {
        signalMap.set(sig.address, sig)
      }
    })

    // Final enriched response
    const enriched = tokens.map(token => {
      const price = prices[token.address] || 0
      const signal = signalMap.get(token.address) || null

      return {
        ...token.toObject(),
        livePrice: price,
        signal
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

  for (const address of addresses) {
    try {
      const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${address}`)
      const data = await res.json()
      prices[address] = data?.[address]?.usdPrice || 0
    } catch (err) {
      console.error(`Error fetching price for ${address}`, err)
      prices[address] = 0
    }
  }

  return prices
}
