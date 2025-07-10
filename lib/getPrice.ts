export async function getTokenPrice() {
  const USDbC_BASE = 'base:0x4621b7A9c75199271F773Ebd9A499dbd165c3191'

  const res = await fetch(`https://coins.llama.fi/prices/current/${USDbC_BASE}`)
  const json = await res.json()

  console.log('DefiLlama response:', json)

  const price = json.coins[USDbC_BASE]?.price

  if (!price) {
    throw new Error('Price not found from DefiLlama')
  }

  return price
}
