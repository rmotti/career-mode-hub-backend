// src/services/season/seasonService.js
import mongoose from "mongoose";
import { Season } from "../../models/season/Season.js";
import { Save } from "../../models/save/Save.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function assertSaveOwnership(saveId, userId) {
  if (!mongoose.isValidObjectId(saveId)) {
    throw httpError(400, "ID de save inválido.");
  }
  const owns = await Save.findOne({ _id: saveId, user: userId }).lean();
  if (!owns) throw httpError(403, "Acesso negado ao save.");
}

/** CREATE */
export async function createSeason({
  userId,
  save, // <- vem do body/params
  label,
  startDate,
  endDate,
  mainLeagueName,
  mainLeagueId,
  notes
}) {
  await assertSaveOwnership(save, userId);
  if (!label) throw httpError(400, "Informe o label da temporada (ex.: '2025/26').");

  try {
    const season = await Season.create({
      saveRef: save, // <- **consistente com o model**
      label,
      startDate,
      endDate,
      mainLeagueName,
      mainLeagueId,
      notes,
      summary: {
        squadCount: 0,
        wageWeeklyTotal: 0,
        budgetCurrent: 0,
        transfersInCount: 0,
        transfersOutCount: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        wins: 0,
        draws: 0,
        losses: 0
      }
    });
    return season;
  } catch (e) {
    if (e?.code === 11000) throw httpError(409, "Esta temporada já existe para este save.");
    throw e;
  }
}

/** LIST by save */
export async function listBySave({ userId, saveId }) {
  await assertSaveOwnership(saveId, userId);
  return Season.find({ saveRef: saveId }) // <- **saveRef**
    .sort({ startDate: -1, createdAt: -1 })
    .lean();
}

/** GET one (checa propriedade pelo saveRef do doc) */
export async function getSeasonByIdForUser({ userId, seasonId }) {
  if (!mongoose.isValidObjectId(seasonId)) {
    throw httpError(400, "ID de temporada inválido.");
  }
  const season = await Season.findById(seasonId).lean();
  if (!season) throw httpError(404, "Temporada não encontrada.");
  await assertSaveOwnership(season.saveRef, userId); // <- **saveRef**
  return season;
}

/** UPDATE (whitelist) */
export async function updateSeasonForUser({ userId, seasonId, payload }) {
  if (!mongoose.isValidObjectId(seasonId)) {
    throw httpError(400, "ID de temporada inválido.");
  }
  const season = await Season.findById(seasonId);
  if (!season) throw httpError(404, "Temporada não encontrada.");
  await assertSaveOwnership(season.saveRef, userId); // <- **saveRef**

  const updatable = {};
  const allowed = ["label", "startDate", "endDate", "mainLeagueName", "mainLeagueId", "notes", "summary"];
  for (const k of allowed) if (payload[k] !== undefined) updatable[k] = payload[k];

  try {
    const updated = await Season.findByIdAndUpdate(seasonId, { $set: updatable }, { new: true });
    return updated;
  } catch (e) {
    if (e?.code === 11000) throw httpError(409, "Já existe uma temporada com esse label neste save.");
    throw e;
  }
}

/** DELETE */
export async function deleteSeasonForUser({ userId, seasonId }) {
  if (!mongoose.isValidObjectId(seasonId)) {
    throw httpError(400, "ID de temporada inválido.");
  }
  const season = await Season.findById(seasonId);
  if (!season) throw httpError(404, "Temporada não encontrada.");
  await assertSaveOwnership(season.saveRef, userId); // <- **saveRef**

  await Season.deleteOne({ _id: seasonId });
  return { ok: true };
}
