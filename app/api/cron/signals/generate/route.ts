import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import TokenPrice from '@/models/TokenPrice'
import TokenSignal from '@/models/TokenSignal'
import { calculateRSI } from '@/utils/calculateRSI'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  await connectToDB()

  const now = Date.now()

  const period = 21 // for RSI

  const timeWindows = {
    change_5m: now - 1000 * 60 * 5,
    change_30m: now - 1000 * 60 * 30,
    change_1h: now - 1000 * 60 * 60,
    change_6h: now - 1000 * 60 * 60 * 6,
    change_12h: now - 1000 * 60 * 60 * 12,
    change_24h: now - 1000 * 60 * 60 * 24,
  }

  const addresses = await TokenPrice.distinct('address')

  for (const address of addresses) {
    const prices = await TokenPrice.find({ address }).sort({ timestamp: -1 })

    const latestPrice = prices[0]?.price
    if (!latestPrice) continue

    const rawPrices = prices.map(p => p.price) // Extract numbers ✅


    const rsi = calculateRSI(rawPrices, period)

    const signals: Record<string, number> = {}

    for (const [label, cutoff] of Object.entries(timeWindows)) {
      const pastPriceEntry = prices.find(p => new Date(p.timestamp).getTime() <= cutoff)
      if (pastPriceEntry) {
        const old = pastPriceEntry.price
        const change = ((latestPrice - old) / old) * 100
        signals[label] = parseFloat(change.toFixed(2))
      } else {
        signals[label] = 0 // Or null if no data
      }
    }

      if (rsi !== null) {
        signals.rsi = rsi
      }

    console.log("📈 Signals for", address, signals)


      const result = await TokenSignal.findOneAndUpdate(
        { address }, // Match by unique address
        {
          $set: {
            timestamp: new Date(),
            ...signals, // { change_5m, change_30m, etc. }
          }
        },
        {
          upsert: true, // Insert if it doesn’t exist
          new: true,     // Return the updated doc
        }
      )



      
        console.log("✅ Upserted:", result)

  }

  return NextResponse.json({ success: true, count: addresses.length })
}
