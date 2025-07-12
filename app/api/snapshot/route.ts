// app/api/snapshot/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import Token from '@/models/Token'
import TokenPrice from '@/models/TokenPrice'
import { fetchPricesFromJupiterLite } from '@/lib/fetchTokenPrices'

export async function GET() {
  try {
    await connectToDB()

    const tokens = await Token.find({ chain: 'solana' })
    const addresses = tokens.map((t) => t.address)

    const prices = await fetchPricesFromJupiterLite(addresses)
    const now = new Date()

    const entries = Object.entries(prices).map(([address, price]) => ({
      address,
      price,
      timestamp: now,
    }))

    await TokenPrice.insertMany(entries)
    console.log(`[✔] Stored ${entries.length} prices @ ${now.toLocaleTimeString()}`)

    return NextResponse.json({ success: true, count: entries.length })
  } catch (err) {
    console.error('[❌] Snapshot error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
