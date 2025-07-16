// models/TokenSignal.ts
import mongoose from "mongoose";

const TokenSignalSchema = new mongoose.Schema({
  address: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  rsi_3: Number,
  rsi_5: Number,
  rsi_14: Number,
  sma_5: Number,
  sma_15: Number,
  roc_5: Number,
  roc_10: Number,
  high_5m: Number,
  low_5m: Number,
  high_15m: Number,
  low_15m: Number,
  high_1h: Number,
  low_1h: Number,
  test_value: String, 
}, { timestamps: true }); 

export default mongoose.models.TokenSignal || mongoose.model("TokenSignal", TokenSignalSchema);