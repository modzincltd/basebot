// scripts/price-loop.ts
import 'dotenv/config' // Load environment variables from .env file
import { connectToDB } from '../lib/mongo.js'
import Token from '../models/Token.js'
import TokenPrice from '../models/TokenPrice.js'
import { fetchPricesFromJupiterLite } from '../lib/fetchTokenPrices.js'

const INTERVAL_MS = 15 * 1000 // 15 seconds

async function runSnapshot() {
  await connectToDB()

  const tokens = await Token.find({ chain: 'solana' })
  const addresses = tokens.map((t) => t.address)

  const prices = await fetchPricesFromJupiterLite(addresses)
  console.log(prices)
  const now = new Date()

  const entries = Object.entries(prices).map(([address, price]) => ({
    address,
    price,
    timestamp: now,
  }))

  await TokenPrice.insertMany(entries)
  console.log(`[✔] Stored ${entries.length} prices @ ${now.toLocaleTimeString()}`)
}

async function loop() {
  while (true) {
    try {
      await runSnapshot()
    } catch (err) {
      console.error('[❌] Snapshot error:', err)
    }

    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS))
  }
}

loop()
