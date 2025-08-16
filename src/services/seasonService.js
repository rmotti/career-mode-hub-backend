// src/services/seasonService.js
import { Season } from "../models/Season.js";
import { Save } from "../models/Save.js";

async function assertSaveOwnership(saveId, userId) {
  const owns = await Save.findOne({ _id: saveId, user: userId }).lean();
  if (!owns) {
    const err = new Error("Acesso negado ao save.");
    err.status = 403;
    throw err;
  }
}

export async function createSeason({ userId, save, label, startDate, endDate, mainLeagueName, mainLeagueId, notes }) {
  await assertSaveOwnership(save, userId);

  if (!label) {
    const err = new Error("Informe o label da temporada (ex.: '2025/26').");
    err.status = 400;
    throw err;
  }

  try {
    const season = await Season.create({ save, label, startDate, endDate, mainLeagueName, mainLeagueId, notes });
    return season;
  } catch (e) {
    // erro 11000: duplicidade de (save,label)
    if (e?.code === 11000) {
      const err = new Error("Esta temporada já existe para este save.");
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

export async function listBySave({ userId, saveId }) {
  await assertSaveOwnership(saveId, userId);
  return Season.find({ save: saveId })
    .sort({ startDate: -1, createdAt: -1 })
    .lean();
}

export async function getSeasonByIdForUser({ userId, seasonId }) {
  const season = await Season.findById(seasonId).lean();
  if (!season) {
    const err = new Error("Temporada não encontrada.");
    err.status = 404;
    throw err;
  }
  await assertSaveOwnership(season.save, userId);
  return season;
}

export async function updateSeasonForUser({ userId, seasonId, payload }) {
  const season = await Season.findById(seasonId);
  if (!season) {
    const err = new Error("Temporada não encontrada.");
    err.status = 404;
    throw err;
  }
  await assertSaveOwnership(season.save, userId);

  // whitelist de campos atualizáveis
  const updatable = {};
  const allowed = ["label", "startDate", "endDate", "mainLeagueName", "mainLeagueId", "notes"];
  for (const k of allowed) {
    if (payload[k] !== undefined) updatable[k] = payload[k];
  }

  try {
    const updated = await Season.findByIdAndUpdate(seasonId, { $set: updatable }, { new: true });
    return updated;
  } catch (e) {
    if (e?.code === 11000) {
      const err = new Error("Já existe uma temporada com esse label neste save.");
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

export async function deleteSeasonForUser({ userId, seasonId }) {
  const season = await Season.findById(seasonId);
  if (!season) {
    const err = new Error("Temporada não encontrada.");
    err.status = 404;
    throw err;
  }
  await assertSaveOwnership(season.save, userId);

  await Season.deleteOne({ _id: seasonId });
  return { ok: true };
}
