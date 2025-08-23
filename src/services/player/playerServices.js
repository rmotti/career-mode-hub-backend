// src/services/playerService.js
import mongoose from "mongoose";
import { Player } from "../../models/player/Player.js";
import { Season } from "../../models/season/Season.js";

const { Types } = mongoose;

/* Util: tenta converter para ObjectId quando aplicável */
function oidOrRaw(v) {
  if (v instanceof Types.ObjectId) return v;
  if (typeof v === "string" && Types.ObjectId.isValid(v)) return new Types.ObjectId(v);
  return v; // deixa como está (ex.: já é ObjectId ou não é id)
}

/** Recalcula summary básico da Season (contagem e salários) */
export async function recalcSeasonSummary(seasonRef) {
  const seasonOid = oidOrRaw(seasonRef);

  const agg = await Player.aggregate([
    { $match: { seasonRef: seasonOid } }, // 🔒 casa exatamente a temporada
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
    seasonOid,
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
export async function listPlayers({
  saveRef,
  seasonRef,
  q,
  position,
  role,
  status,
  minOverall,
  maxOverall,
  page = 1,
  pageSize = 30,
  sort = "overall:-1",
}) {
  const saveOid = oidOrRaw(saveRef);
  const seasonOid = oidOrRaw(seasonRef);

  const filters = { saveRef: saveOid, seasonRef: seasonOid };

  if (q) filters.name = { $regex: q, $options: "i" };
  if (position) filters.position = position;
  if (role) filters.role = role;
  if (status) filters.status = status;

  const minOv = minOverall !== undefined && minOverall !== null && `${minOverall}` !== "" ? Number(minOverall) : undefined;
  const maxOv = maxOverall !== undefined && maxOverall !== null && `${maxOverall}` !== "" ? Number(maxOverall) : undefined;

  if (!Number.isNaN(minOv) || !Number.isNaN(maxOv)) {
    filters.overall = {};
    if (!Number.isNaN(minOv)) filters.overall.$gte = minOv;
    if (!Number.isNaN(maxOv)) filters.overall.$lte = maxOv;
  }

  // sort no formato "campo:dir,campo2:dir"
  const sortObj = {};
  const WHITELIST_SORT_FIELDS = new Set([
    "name",
    "overall",
    "potential",
    "position",
    "role",
    "status",
    "marketValue",
    "salaryWeekly",
    "createdAt",
    "updatedAt",
  ]);
  if (typeof sort === "string" && sort.trim().length) {
    sort.split(",").forEach((pair) => {
      const [rawField, rawDir] = pair.split(":");
      const field = (rawField || "").trim();
      if (!field || !WHITELIST_SORT_FIELDS.has(field)) return; // 🔐 evita sort arbitrário
      const dirNum = Number(rawDir);
      sortObj[field] = dirNum === -1 ? -1 : 1;
    });
  }
  // fallback de ordenação se nada válido foi passado
  if (!Object.keys(sortObj).length) sortObj.overall = -1;

  const pageNum = Math.max(1, Number(page) || 1);
  const sizeNum = Math.min(100, Math.max(1, Number(pageSize) || 30)); // limita pageSize a 1..100
  const skip = (pageNum - 1) * sizeNum;

  const [items, total] = await Promise.all([
    Player.find(filters).sort(sortObj).skip(skip).limit(sizeNum),
    Player.countDocuments(filters),
  ]);

  return {
    items,
    total,
    page: pageNum,
    pageSize: sizeNum,
    totalPages: Math.max(1, Math.ceil(total / sizeNum)),
  };
}

/** Cria player (snapshot da temporada) */
export async function createPlayer(data) {
  // ⚠️ Garante refs coerentes (útil para quando vierem como string)
  const payload = {
    ...data,
    saveRef: oidOrRaw(data.saveRef),
    seasonRef: oidOrRaw(data.seasonRef),
  };

  const created = await Player.create(payload);
  await recalcSeasonSummary(created.seasonRef);
  return created;
}

/** Lê player por id do documento */
export async function getPlayer(docId, { saveRef, seasonRef }) {
  const filter = {
    _id: oidOrRaw(docId),
    saveRef: oidOrRaw(saveRef),
    seasonRef: oidOrRaw(seasonRef),
  };
  const found = await Player.findOne(filter);
  return found;
}

/** Atualiza player */
export async function updatePlayer(docId, { saveRef, seasonRef }, payload) {
  const filter = {
    _id: oidOrRaw(docId),
    saveRef: oidOrRaw(saveRef),
    seasonRef: oidOrRaw(seasonRef),
  };

  const updated = await Player.findOneAndUpdate(
    filter,
    { $set: payload },
    { new: true, runValidators: true, context: "query" } // ✅ valida schema no update
  );

  if (updated) {
    await recalcSeasonSummary(updated.seasonRef);
  }
  return updated;
}

/** Apaga player */
export async function deletePlayer(docId, { saveRef, seasonRef }) {
  const filter = {
    _id: oidOrRaw(docId),
    saveRef: oidOrRaw(saveRef),
    seasonRef: oidOrRaw(seasonRef),
  };

  const toDelete = await Player.findOneAndDelete(filter);
  if (toDelete) {
    await recalcSeasonSummary(toDelete.seasonRef);
  }
  return toDelete;
}
