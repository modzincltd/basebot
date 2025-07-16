// models/TokenSignal.ts
import mongoose from "mongoose";


const TokenSignalSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true }, // 👈 Unique
  timestamp: { type: Date, default: Date.now },
  change_5m: Number,
  change_30m: Number,
  change_1h: Number,
  change_6h: Number,
  change_12h: Number,
  change_24h: Number,
  rsi: Number,
}, { timestamps: true })



export default mongoose.models.TokenSignal || mongoose.model("TokenSignal", TokenSignalSchema);