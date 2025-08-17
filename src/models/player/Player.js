// src/models/Player.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const playerSchema = new mongoose.Schema(
  {
    saveRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Save",
      required: true,
      index: true,
    },
    seasonRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
      index: true,
    },

    // Identificação global
    playerId: { 
      type: String, 
      required: true,        // agora sempre tem que vir do front ou ser gerado na 1ª vez
      index: true,
      unique: true
    },
    externalPlayerId: { type: Number, index: true }, // opcional (API externa no futuro)

    // Dados básicos
    name: { type: String, required: true, trim: true, index: true },
    nationality: { type: String },
    age: { type: Number },
    foot: { type: String }, // "left", "right", "both"

    // Posição detalhada
    position: { 
      type: String, 
      enum: ["GK", "RB", "LB", "CB", "CDM", "CM", "CAM", "RW", "LW", "ST"], 
      required: true,
      index: true 
    },

    // Função no elenco
    role: {
      type: String,
      enum: ["crucial", "important", "rotation", "sporadic", "prospect"],
      default: "rotation",
      index: true,
    },

    // Atributos snapshot da temporada
    overall: { type: Number },
    potential: { type: Number },
    marketValue: { type: Number },
    salaryWeekly: { type: Number },
    contractUntil: { type: Date },

    // Status no elenco
    status: { 
      type: String, 
      enum: ["in-squad", "loaned-out", "youth academy"], 
      default: "in-squad",
      index: true 
    },

    // Estatísticas acumuladas da temporada
    stats: {
      apps: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      yellows: { type: Number, default: 0 },
      reds: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Índices úteis
playerSchema.index({ playerId: 1, seasonRef: 1 }, { unique: true });
playerSchema.index({ seasonRef: 1, position: 1 });
playerSchema.index({ seasonRef: 1, overall: -1 });
playerSchema.index({ saveRef: 1, name: 1 });

export const Player = mongoose.model("Player", playerSchema);
