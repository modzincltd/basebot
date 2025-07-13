import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongo';
import TokenPrice from '@/models/TokenPrice';
import TokenSignal from '@/models/TokenSignal';
import { calculateRSI } from '@/utils/calculateRSI';

export const dynamic = 'force-dynamic'; // for edge

export async function GET(req: NextRequest) {
  connectToDB();

  const now = new Date();
  const start5m = new Date(now.getTime() - 5 * 60 * 1000);
  const start1h = new Date(now.getTime() - 60 * 60 * 1000);

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
  ]);

  const signals = [];

  for (const token of tokenPrices) {
    const sortedPrices = token.prices.sort((a, b) => a.timestamp - b.timestamp);
    const pricesOnly = sortedPrices.map(p => p.price);

    const recent5mPrices = sortedPrices.filter(p => new Date(p.timestamp) >= start5m).map(p => p.price);

    signals.push({
      address: token._id,
      rsi_5m: calculateRSI(recent5mPrices, 14),
      rsi_1h: calculateRSI(pricesOnly, 14),
      high_5m: Math.max(...recent5mPrices),
      low_5m: Math.min(...recent5mPrices),
      high_1h: Math.max(...pricesOnly),
      low_1h: Math.min(...pricesOnly),
    });
  }

  // Save to Mongo
 for (const sig of signals) {
  // Skip anything with NaN
  if (
    isNaN(sig.rsi_5m) ||
    isNaN(sig.rsi_1h) ||
    isNaN(sig.high_5m) ||
    isNaN(sig.low_5m) ||
    isNaN(sig.high_1h) ||
    isNaN(sig.low_1h)
  ) {
    console.warn(`Skipping ${sig.address} due to invalid data`);
    continue;
  }

  await TokenSignal.findOneAndUpdate(
    { address: sig.address },
    { ...sig, timestamp: new Date() },
    { upsert: true, new: true }
  );
}

  return NextResponse.json({ success: true, signals });
}
