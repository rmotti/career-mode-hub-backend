import { Save } from "../../models/save/Save.js";

// 🔹 Criar novo save
export const createNewSave = async ({ user, userName, name, team, season }) => {
  return await Save.create({
    user,
    userName,
    name,
    team,
    season,
  });
};

// 🔹 Listar saves do usuário
export const fetchUserSaves = async (userId) => {
  return await Save.find({ user: userId }).sort({ updatedAt: -1 });
};

// 🔹 Atualizar save
export const updateExistingSave = async (userId, saveId, { name, team, season }) => {
  const save = await Save.findOne({ _id: saveId, user: userId });
  if (!save) return null;

  if (name) save.name = name;
  if (team) save.team = team;
  if (season) save.season = season;

  await save.save();
  return save;
};

// 🔹 Deletar save
export const deleteUserSave = async (userId, saveId) => {
  return await Save.findOneAndDelete({ _id: saveId, user: userId });
};
