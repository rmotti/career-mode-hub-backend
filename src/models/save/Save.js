import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  name: { type: String, required: true },
  team: { type: String, required: true },
  season: { type: String, required: true, default: "2025/26" },
  lastPlayedAt: { type: Date },                                  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// mantém seu middleware atual
saveSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// apenas adiciona um índice (não quebra nada)
saveSchema.index({ user: 1, updatedAt: -1 });

export const Save = mongoose.model("Save", saveSchema);
