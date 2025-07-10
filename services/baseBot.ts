// services/baseBot.ts
import { getTokenPrice } from '../lib/getPrice'


export async function runBaseBot() {
  const price = await getTokenPrice()
  console.log(`[🧠] Current token price: $${price}`)

  if (price < 0.95) {
    console.log('🟢 BUY signal')
  } else if (price > 1500) {
    console.log('🔴 SELL signal')
  } else {
    console.log('🟡 HOLD')
  }
}
