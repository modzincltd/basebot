import { NextResponse } from 'next/server'
import {connectToDB} from '@/lib/mongo'
import Token from '@/models/Token'

export async function GET(
  req: Request,
  context: { params: { chain: string; tokenAddress: string } }
) {
  const { chain, tokenAddress } = context.params

  await connectToDB()

  const token = await Token.findOne({
    address: tokenAddress,
    chain: chain.toLowerCase(),
  })

  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  return NextResponse.json(token)
}