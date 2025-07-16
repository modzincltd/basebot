// utils/calculateRSI.ts

export function calculateRSI(prices: number[], period: number = 14): number | null {
  if (prices.length < period + 1) return null // Not enough data

  let gains = 0
  let losses = 0

  // First average gain/loss
  for (let i = 1; i <= period; i++) {
    const delta = prices[i] - prices[i - 1]
    if (delta > 0) gains += delta
    else losses -= delta // subtract negative
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  // Continue smoothing with rest of the data
  for (let i = period + 1; i < prices.length; i++) {
    const delta = prices[i] - prices[i - 1]
    const gain = delta > 0 ? delta : 0
    const loss = delta < 0 ? -delta : 0

    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
  const rsi = 100 - 100 / (1 + rs)

  return parseFloat(rsi.toFixed(2))
}
