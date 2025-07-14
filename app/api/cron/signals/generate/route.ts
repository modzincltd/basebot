import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import TokenPrice from '@/models/TokenPrice'
import TokenSignal from '@/models/TokenSignal'
import { calculateRSI } from '@/utils/calculateRSI'

export const dynamic = 'force-dynamic'

// 🔧 Utility functions
const calculateSMA = (prices: number[], period: number) =>
  prices.length >= period ? prices.slice(-period).reduce((a, b) => a + b, 0) / period : 0

const calculateROC = (prices: number[], period: number) =>
  prices.length >= period ? ((prices[prices.length - 1] - prices[prices.length - period]) / prices[prices.length - period]) * 100 : 0

const calculateHigh = (prices: number[]) => prices.length ? Math.max(...prices) : 0
const calculateLow = (prices: number[]) => prices.length ? Math.min(...prices) : 0

export async function GET(req: NextRequest) {
  await connectToDB()


  function cleanSignal(signal: Record<string, any>) {
  const cleaned = { ...signal }

  for (const key in cleaned) {
    if (typeof cleaned[key] === 'number' && isNaN(cleaned[key])) {
      cleaned[key] = null // or 0 if you prefer defaults
    }
  }

  return cleaned
}


  const now = new Date()
  const start1h = new Date(now.getTime() - 60 * 60 * 1000)
  const start15m = new Date(now.getTime() - 15 * 60 * 1000)
  const start10m = new Date(now.getTime() - 10 * 60 * 1000)
  const start5m = new Date(now.getTime() - 5 * 60 * 1000)

  const tokenPrices = await TokenPrice.aggregate([
    {
      $match: {
        timestamp: { $gte: start1h }
      }
    },
    {
      $group: {
        _id: "$address",
        prices: { $push: { price: "$price", timestamp: "$timestamp" } }
      }
    }
  ])

  const signals = []

  for (const token of tokenPrices) {
    const sorted = token.prices.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const prices = sorted.map(p => p.price)

    const prices5m = sorted.filter(p => new Date(p.timestamp) >= start5m).map(p => p.price)
    const prices10m = sorted.filter(p => new Date(p.timestamp) >= start10m).map(p => p.price)
    const prices15m = sorted.filter(p => new Date(p.timestamp) >= start15m).map(p => p.price)

    const signal = {
      address: token._id,
      timestamp: new Date(),

      // RSI
      rsi_3: calculateRSI(prices, 3),
      rsi_5: calculateRSI(prices, 5),
      rsi_14: calculateRSI(prices, 14),

      // SMA
      sma_5: calculateSMA(prices, 5),
      sma_15: calculateSMA(prices, 15),

      // ROC
      roc_5: calculateROC(prices, 5),
      roc_10: calculateROC(prices, 10),

      // Highs/Lows
      high_5m: calculateHigh(prices5m),
      low_5m: calculateLow(prices5m),
      high_15m: calculateHigh(prices15m),
      low_15m: calculateLow(prices15m),
      high_1h: calculateHigh(prices),
      low_1h: calculateLow(prices),
    }

    // Validation: skip if everything is zero
    const numericValues = Object.values(signal).filter(val => typeof val === 'number')
    const allZero = numericValues.every(val => val === 0)

    if (!allZero) {
      signals.push(signal)
    } else {
      console.warn(`Skipping ${token._id} due to insufficient data`)
    }
  }

  // Save to DB
  for (const sig of signals) {
    const cleaned = cleanSignal(sig) /// cleans and checks its a number
    await TokenSignal.findOneAndUpdate(
      { address: sig.address },
      { ...cleaned },
      { upsert: true, new: true }
    )
  }

  return NextResponse.json({ success: true, count: signals.length, signals })
}
