// models/TokenSignal.ts
import mongoose from "mongoose";

const TokenSignalSchema = new mongoose.Schema({
  address: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  rsi_5m: Number,
  rsi_1h: Number,
  high_5m: Number,
  low_5m: Number,
  high_1h: Number,
  low_1h: Number,
}, { timestamps: true });

export default mongoose.models.TokenSignal || mongoose.model("TokenSignal", TokenSignalSchema);
