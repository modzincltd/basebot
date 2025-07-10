// lib/mongo.ts
import mongoose from 'mongoose'

let isConnected = false // Global connection state

export const connectToDB = async () => {
  if (isConnected) {
    console.log('🟢 MongoDB already connected')
    return
  }

  console.log("heee" + process.env.MONGODB_URI)

  try {
    const uri = process.env.MONGODB_URI!
    if (!uri) throw new Error("Missing MONGODB_URI in .env")

    await mongoose.connect(uri, {
      dbName: 'coinbot', // optional: set your DB name
    })

    isConnected = true
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw new Error('Failed to connect to MongoDB')
  }
}
