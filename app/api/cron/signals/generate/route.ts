import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongo'
import TokenPrice from '@/models/TokenPrice'
import TokenSignalData from '@/models/TokenSignalData'
import { calculateRSI } from '@/utils/calculateRSI'

export const dynamic = 'force-dynamic'

// 🔧 Utility functions

export async function GET(req: NextRequest) {
  await connectToDB()


  

  return NextResponse.json("TEST")
}