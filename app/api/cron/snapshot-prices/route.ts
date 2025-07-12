// app/api/cron/snapshot-prices/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import Token from '@/models/Token' 
import TokenPrice from '@/models/TokenPrice'
import { fetchPricesFromJupiterLite } from '@/lib/fetchTokenPrices'

export async function GET() {
  await connectToDB()

  const tokens = await Token.find({ chain: 'solana' })
  const addresses = tokens.map(t => t.address)

  if (addresses.length === 0) {
    return NextResponse.json({ inserted: 0, message: 'No tokens to process' })
  }

  const prices = await fetchPricesFromJupiterLite(addresses)
  const now = new Date()

  const docs = Object.entries(prices).map(([address, price]) => ({
    address,
    price,
    timestamp: now,
  }))

  await TokenPrice.insertMany(docs)

  return NextResponse.json({ inserted: docs.length })
}
