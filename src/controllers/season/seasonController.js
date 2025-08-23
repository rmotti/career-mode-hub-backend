import {
  createSeason,
  listBySave,
  getSeasonByIdForUser,
  updateSeasonForUser,
  deleteSeasonForUser
} from "../../services/season/seasonService.js";

export async function create(req, res) {
  try {
    const { save, label, startDate, endDate, mainLeagueName, mainLeagueId, notes } = req.body;
    const doc = await createSeason({
      userId: req.user._id,
      save,
      label,
      startDate,
      endDate,
      mainLeagueName,
      mainLeagueId,
      notes
    });
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

export async function listBySaveId(req, res) {
  try {
    const data = await listBySave({ userId: req.user._id, saveId: req.params.saveId });
    return res.json(data);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

export async function getOne(req, res) {
  try {
    const doc = await getSeasonByIdForUser({ userId: req.user._id, seasonId: req.params.id });
    return res.json(doc);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

export async function update(req, res) {
  try {
    const updated = await updateSeasonForUser({
      userId: req.user._id,
      seasonId: req.params.id,
      payload: req.body
    });
    return res.json(updated);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}

export async function remove(req, res) {
  try {
    const result = await deleteSeasonForUser({ userId: req.user._id, seasonId: req.params.id });
    return res.json(result);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
}
