// app/api/solana-tokens/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = url.searchParams.get('limit') || '100'

  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${limit}&convert=USD&sort=volume_24h`,
    
    {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY!,
      },
    }
  )

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const json = await res.json() 
  // `json.data` is an array of SOL tokens aggregated from central exchanges
  return NextResponse.json(json.data)
}
