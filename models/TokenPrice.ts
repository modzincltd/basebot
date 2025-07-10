// models/TokenPrice.ts
import mongoose from 'mongoose'

const TokenPriceSchema = new mongoose.Schema({
  address: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
})

export default mongoose.models.TokenPrice || mongoose.model('TokenPrice', TokenPriceSchema)
