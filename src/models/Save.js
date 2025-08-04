import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relaciona com quem criou o save
    required: true,
  },
    userName: { 
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true, // Usuário escolhe o nome do save
  },
  team: {
    type: String,
    required: true, // Time escolhido pelo usuário
  },
  season: {
    type: String,
    required: true, // Ex: "2025/26"
    default: "2025/2026"
  },
  createdAt: {
    type: Date,
    default: Date.now, // Data de criação
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Data de última atualização
  },
});

// Middleware para atualizar updatedAt automaticamente
saveSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Save = mongoose.model("Save", saveSchema);
