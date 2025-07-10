// lib/fetchTokenPrices.ts
export async function fetchPricesFromJupiterLite(addresses: string[]) {
  const prices: Record<string, number> = {}

  try {
    const query = addresses.join(',')
    const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${query}`)

    const text = await res.text()
    let data

    try {
      data = JSON.parse(text)
    } catch (err) {
      console.error('Failed to parse Jupiter response:', text)
      return prices
    }

    for (const address of addresses) {
      const price = data[address]?.usdPrice ?? 0
      prices[address] = price
    }
  } catch (err) {
    console.error('Error fetching from Jupiter Lite:', err)
    for (const address of addresses) {
      prices[address] = 0
    }
  }

  return prices
}
