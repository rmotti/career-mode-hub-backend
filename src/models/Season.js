// src/models/Season.js
import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    save: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Save",
      required: true,
      index: true,
    },
    label: {
      type: String,           // ex.: "2025/26"
      required: true,
      trim: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    mainLeagueName: { type: String },   // ex.: "Primeira Liga"
    mainLeagueId: { type: Number },     // opcional (id externo)
    notes: { type: String },
  },
  { timestamps: true }
);

// mesma temporada não pode ser criada 2x no mesmo save
seasonSchema.index({ save: 1, label: 1 }, { unique: true });

export const Season = mongoose.model("Season", seasonSchema);
