// src/controllers/player/playerControllers.js
import mongoose from "mongoose";
import { Season } from "../../models/season/Season.js";
import {
  listPlayers,
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer
} from "../../services/player/playerServices.js";

/** Util interna: valida que a season existe, pertence ao save e ao user */
async function assertSeasonScope({ userId, saveId, seasonId }) {
  if (!mongoose.isValidObjectId(saveId)) {
    const err = new Error("ID de save inválido.");
    err.status = 400; throw err;
  }
  if (!mongoose.isValidObjectId(seasonId)) {
    const err = new Error("ID de temporada inválido.");
    err.status = 400; throw err;
  }
  const season = await Season.findOne({ _id: seasonId, saveRef: saveId, user: userId }).lean();
  if (!season) {
    const err = new Error("Temporada não encontrada para este save ou sem permissão.");
    err.status = 404; throw err;
  }
  return season;
}

/** GET /api/saves/:saveId/seasons/:seasonId/players */
export async function getPlayers(req, res) {
  try {
    const { saveId, seasonId } = req.params;
    await assertSeasonScope({ userId: req.user._id, saveId, seasonId });

    const {
      q,
      position,
      role,
      status,
      minOverall,
      maxOverall,
      page,
      pageSize,
      sort
    } = req.query;

    const data = await listPlayers({
      saveRef: saveId,
      seasonRef: seasonId,
      q,
      position,
      role,
      status,
      minOverall,
      maxOverall,
      page,
      pageSize,
      sort
    });

    return res.json(data);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

/** POST /api/saves/:saveId/seasons/:seasonId/players */
export async function postPlayer(req, res) {
  try {
    const { saveId, seasonId } = req.params;
    await assertSeasonScope({ userId: req.user._id, saveId, seasonId });

    // Validações mínimas de payload
    const { name, position } = req.body || {};
    if (!name || !position) {
      return res.status(400).json({ message: "Informe ao menos 'name' e 'position'." });
    }

    const created = await createPlayer({
      ...req.body,
      saveRef: saveId,
      seasonRef: seasonId
    });

    return res.status(201).json(created);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

/** GET /api/saves/:saveId/seasons/:seasonId/players/:playerDocId */
export async function getPlayerById(req, res) {
  try {
    const { saveId, seasonId, playerDocId } = req.params;
    await assertSeasonScope({ userId: req.user._id, saveId, seasonId });

    if (!mongoose.isValidObjectId(playerDocId)) {
      return res.status(400).json({ message: "ID de jogador inválido." });
    }

    const doc = await getPlayer(playerDocId, { saveRef: saveId, seasonRef: seasonId });
    if (!doc) return res.status(404).json({ message: "Jogador não encontrado." });

    return res.json(doc);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

/** PUT /api/saves/:saveId/seasons/:seasonId/players/:playerDocId */
export async function putPlayer(req, res) {
  try {
    const { saveId, seasonId, playerDocId } = req.params;
    await assertSeasonScope({ userId: req.user._id, saveId, seasonId });

    if (!mongoose.isValidObjectId(playerDocId)) {
      return res.status(400).json({ message: "ID de jogador inválido." });
    }

    const updated = await updatePlayer(playerDocId, { saveRef: saveId, seasonRef: seasonId }, req.body || {});
    if (!updated) return res.status(404).json({ message: "Jogador não encontrado." });

    return res.json(updated);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

/** DELETE /api/saves/:saveId/seasons/:seasonId/players/:playerDocId */
export async function removePlayer(req, res) {
  try {
    const { saveId, seasonId, playerDocId } = req.params;
    await assertSeasonScope({ userId: req.user._id, saveId, seasonId });

    if (!mongoose.isValidObjectId(playerDocId)) {
      return res.status(400).json({ message: "ID de jogador inválido." });
    }

    const deleted = await deletePlayer(playerDocId, { saveRef: saveId, seasonRef: seasonId });
    if (!deleted) return res.status(404).json({ message: "Jogador não encontrado." });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}
