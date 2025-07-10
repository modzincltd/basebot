import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import Token from '@/models/Token'

export async function GET() {
  try {
    await connectToDB()
    const tokens = await Token.find().sort({ createdAt: -1 }) // newest first
    return NextResponse.json(tokens)
  } catch (err: any) {
    console.error('Failed to fetch tokens:', err)
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 })
  }
}
