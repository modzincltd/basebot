// app/api/token-prices/[address]/route.ts

import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo.js'
import TokenPrice from '@/models/TokenPrice.js'

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  await connectToDB()
  const now = new Date()

  const timeRanges = {
    last5m: new Date(now.getTime() - 5 * 60 * 1000),
    last1h: new Date(now.getTime() - 60 * 60 * 1000),
    last6h: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    last24h: new Date(now.getTime() - 24 * 60 * 60 * 1000),
  }

  const [allData, last5m, last1h, last6h, last24h] = await Promise.all([
    TokenPrice.find({ address: params.address }).sort({ timestamp: 1 }),
    TokenPrice.find({ address: params.address, timestamp: { $gte: timeRanges.last5m } }).sort({ timestamp: 1 }),
    TokenPrice.find({ address: params.address, timestamp: { $gte: timeRanges.last1h } }).sort({ timestamp: 1 }),
    TokenPrice.find({ address: params.address, timestamp: { $gte: timeRanges.last6h } }).sort({ timestamp: 1 }),
    TokenPrice.find({ address: params.address, timestamp: { $gte: timeRanges.last24h } }).sort({ timestamp: 1 }),
  ])

  const format = (arr: any[]) => arr.map(p => ({
    timestamp: p.timestamp,
    price: p.price
  }))

  return NextResponse.json({
    allData: format(allData),
    last5m: format(last5m),
    last1h: format(last1h),
    last6h: format(last6h),
    last24h: format(last24h),
  })
}
