// src/controllers/playerController.js
import {
  listPlayers,
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
} from "../../services/player/playerServices.js";

/** GET /players */
export async function getPlayers(req, res) {
  try {
    const { saveId, seasonId } = req.params;
    const {
      q, position, role, status, minOverall, maxOverall,
      page, pageSize, sort,
    } = req.query;

    const result = await listPlayers({
      saveRef: saveId,
      seasonRef: seasonId,
      q, position, role, status, minOverall, maxOverall,
      page, pageSize, sort,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar jogadores", error: err.message });
  }
}

/** POST /players */
export async function postPlayer(req, res) {
  try {
    const { saveId, seasonId } = req.params;
    const payload = {
      ...req.body,
      saveRef: saveId,
      seasonRef: seasonId,
    };

    // Validações básicas
    if (!payload.playerId) return res.status(400).json({ message: "playerId é obrigatório" });
    if (!payload.name) return res.status(400).json({ message: "name é obrigatório" });
    if (!payload.position) return res.status(400).json({ message: "position é obrigatório" });

    const created = await createPlayer(payload);
    res.status(201).json(created);
  } catch (err) {
    // Duplicate key (índice único playerId+seasonRef)
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Este playerId já existe nesta temporada" });
    }
    res.status(500).json({ message: "Erro ao criar jogador", error: err.message });
  }
}

/** GET /players/:playerDocId */
export async function getPlayerById(req, res) {
  try {
    const { saveId, seasonId, playerDocId } = req.params;
    const found = await getPlayer(playerDocId, { saveRef: saveId, seasonRef: seasonId });
    if (!found) return res.status(404).json({ message: "Jogador não encontrado" });
    res.json(found);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar jogador", error: err.message });
  }
}

/** PUT /players/:playerDocId */
export async function putPlayer(req, res) {
  try {
    const { saveId, seasonId, playerDocId } = req.params;
    const updated = await updatePlayer(playerDocId, { saveRef: saveId, seasonRef: seasonId }, req.body);
    if (!updated) return res.status(404).json({ message: "Jogador não encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar jogador", error: err.message });
  }
}

/** DELETE /players/:playerDocId */
export async function removePlayer(req, res) {
  try {
    const { saveId, seasonId, playerDocId } = req.params;
    const removed = await deletePlayer(playerDocId, { saveRef: saveId, seasonRef: seasonId });
    if (!removed) return res.status(404).json({ message: "Jogador não encontrado" });
    res.json({ message: "Jogador removido com sucesso", _id: playerDocId });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover jogador", error: err.message });
  }
}
