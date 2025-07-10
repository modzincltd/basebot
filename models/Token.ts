// models/Token.ts
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  chain: { type: String, required: true }, // e.g., "base"
  status: {
    type: String,
    enum: ["live", "paused", "removed"],
    default: "paused",
  },
}, { timestamps: true });  

export default mongoose.models.Token || mongoose.model("Token", TokenSchema);
