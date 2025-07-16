export function calculateRSI(prices: number[], period: number = 14): number | null {


  console.log(prices)


  if (prices.length < period + 1) {
    console.log("🛑 Not enough data for RSI. Need", period + 1, "got", prices.length)
    return null
  }

  let gains = 0
  let losses = 0

  for (let i = 1; i <= period; i++) {
    const delta = prices[i] - prices[i - 1]
    if (delta > 0) gains += delta
    else losses -= delta
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  console.log("🧪 Initial avgGain:", avgGain, "avgLoss:", avgLoss)

  for (let i = period + 1; i < prices.length; i++) {
    const delta = prices[i] - prices[i - 1]
    const gain = delta > 0 ? delta : 0
    const loss = delta < 0 ? -delta : 0

    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
  }

  console.log("📊 Smoothed avgGain:", avgGain, "avgLoss:", avgLoss)

  const rs = avgLoss === 0 ? (avgGain === 0 ? 0 : 100) : avgGain / avgLoss
  const rsi = avgLoss === 0 && avgGain === 0 ? 50 : 100 - 100 / (1 + rs)

  console.log("📈 RS:", rs, "RSI:", rsi)

  return parseFloat(rsi.toFixed(2))
}
