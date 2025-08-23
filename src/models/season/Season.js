import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    // denormalização para autorização/queries (opcional porém recomendado)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // vínculo obrigatório com o save
    saveRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Save",
      required: true,
      index: true,
    },

    // ex.: "2025/26"
    label: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}\/\d{2}$/, "Use o formato YYYY/YY, ex.: 2025/26"],
    },

    // opcionais (podem ser definidos no service, se necessário)
    startDate: { type: Date },
    endDate:   { type: Date },

    mainLeagueName: { type: String },
    mainLeagueId:   { type: Number }, // mude para String se vier de API externa como texto

    notes: { type: String },

    // snapshot para dashboards (atualizado no service)
    summary: {
      squadCount:        { type: Number, default: 0 },
      wageWeeklyTotal:   { type: Number, default: 0 },
      budgetCurrent:     { type: Number, default: 0 },

      transfersInCount:  { type: Number, default: 0 },
      transfersOutCount: { type: Number, default: 0 },

      goalsFor:     { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
      wins:   { type: Number, default: 0 },
      draws:  { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => { delete ret.__v; return ret; },
    },
  }
);

/* ------------------------------- Índices ------------------------------- */
seasonSchema.index({ saveRef: 1, label: 1 }, { unique: true }); // evita duplicidade por save
seasonSchema.index({ user: 1, saveRef: 1, createdAt: -1 });
seasonSchema.index({ user: 1, createdAt: -1 });

/* ---------------------------- Validações leves ----------------------------- */
seasonSchema.path("endDate").validate(function (value) {
  if (!value || !this.startDate) return true;
  return value > this.startDate;
}, "endDate deve ser maior que startDate");

export const Season = mongoose.model("Season", seasonSchema);
