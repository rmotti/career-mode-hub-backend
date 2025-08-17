// src/models/Season.js
import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    saveRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Save",
      required: true,
      index: true,
    },
    label: {
      type: String, 
      required: true,
      trim: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    mainLeagueName: { type: String }, 
    mainLeagueId: { type: Number },   
    notes: { type: String },

    // 🔹 Resumo rápido da temporada
    summary: {
      squadCount: { type: Number, default: 0 },          
      wageWeeklyTotal: { type: Number, default: 0 },     
      budgetCurrent: { type: Number, default: 0 },      

      transfersInCount: { type: Number, default: 0 },    
      transfersOutCount: { type: Number, default: 0 },   

      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// mesma temporada não pode ser criada 2x no mesmo save
seasonSchema.index({ saveRef: 1, label: 1 }, { unique: true });

export const Season = mongoose.model("Season", seasonSchema);
