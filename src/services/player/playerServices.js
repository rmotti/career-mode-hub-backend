// src/services/playerService.js
import { Player } from "../../models/player/Player.js";
import { Season } from "../../models/season/Season.js";

/** Recalcula summary básico da Season (contagem e salários) */
export async function recalcSeasonSummary(seasonRef) {
  const agg = await Player.aggregate([
    { $match: { seasonRef } },
    {
      $group: {
        _id: null,
        squadCount: { $sum: 1 },
        wageWeeklyTotal: { $sum: { $ifNull: ["$salaryWeekly", 0] } },
      },
    },
  ]);

  const summary = agg[0] || { squadCount: 0, wageWeeklyTotal: 0 };
  await Season.findByIdAndUpdate(
    seasonRef,
    {
      $set: {
        "summary.squadCount": summary.squadCount,
        "summary.wageWeeklyTotal": summary.wageWeeklyTotal,
      },
    },
    { new: true }
  );
}

/** Lista paginada com filtros e sort */
export async function listPlayers({ saveRef, seasonRef, q, position, role, status, minOverall, maxOverall, page = 1, pageSize = 30, sort = "overall:-1" }) {
  const filters = { saveRef, seasonRef };

  if (q) filters.name = { $regex: q, $options: "i" };
  if (position) filters.position = position;
  if (role) filters.role = role;
  if (status) filters.status = status;
  if (minOverall || maxOverall) {
    filters.overall = {};
    if (minOverall) filters.overall.$gte = Number(minOverall);
    if (maxOverall) filters.overall.$lte = Number(maxOverall);
  }

  // sort string formato: "campo:dir,campo2:dir" (ex.: "overall:-1,name:1")
  const sortObj = {};
  sort.split(",").forEach(pair => {
    const [field, dir] = pair.split(":");
    if (field) sortObj[field.trim()] = Number(dir) || 1;
  });

  const skip = (Number(page) - 1) * Number(pageSize);
  const [items, total] = await Promise.all([
    Player.find(filters).sort(sortObj).skip(skip).limit(Number(pageSize)),
    Player.countDocuments(filters),
  ]);

  return {
    items,
    total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / Number(pageSize) || 1),
  };
}

/** Cria player (snapshot da temporada) */
export async function createPlayer(data) {
  const created = await Player.create(data);
  await recalcSeasonSummary(created.seasonRef);
  return created;
}

/** Lê player por id do documento */
export async function getPlayer(docId, { saveRef, seasonRef }) {
  const found = await Player.findOne({ _id: docId, saveRef, seasonRef });
  return found;
}

/** Atualiza player */
export async function updatePlayer(docId, { saveRef, seasonRef }, payload) {
  const before = await Player.findOneAndUpdate(
    { _id: docId, saveRef, seasonRef },
    { $set: payload },
    { new: true }
  );
  if (before) {
    await recalcSeasonSummary(before.seasonRef);
  }
  return before;
}

/** Apaga player */
export async function deletePlayer(docId, { saveRef, seasonRef }) {
  const toDelete = await Player.findOneAndDelete({ _id: docId, saveRef, seasonRef });
  if (toDelete) {
    await recalcSeasonSummary(toDelete.seasonRef);
  }
  return toDelete;
}
