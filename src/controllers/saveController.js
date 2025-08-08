import { 
  createNewSave, 
  fetchUserSaves, 
  updateExistingSave, 
  deleteUserSave 
} from "../services/saveService.js";

// Criar novo save
export const createSave = async (req, res) => {
  try {
    const { name, team, season } = req.body;

    if (!name || !team || !season) {
      return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    const save = await createNewSave({
      user: req.user._id,
      userName: req.user.userName,
      name,
      team,
      season,
    });

    res.status(201).json(save);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar save", error: error.message });
  }
};

// Listar todos os saves do usuário logado
export const getUserSaves = async (req, res) => {
  try {
    const saves = await fetchUserSaves(req.user._id);
    res.json(saves);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar saves", error: error.message });
  }
};

// Atualizar save
export const updateSave = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, team, season } = req.body;

    const save = await updateExistingSave(req.user._id, id, { name, team, season });

    if (!save) {
      return res.status(404).json({ message: "Save não encontrado" });
    }

    res.json(save);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar save", error: error.message });
  }
};

// Deletar save
export const deleteSave = async (req, res) => {
  try {
    const { id } = req.params;

    const save = await deleteUserSave(req.user._id, id);

    if (!save) {
      return res.status(404).json({ message: "Save não encontrado" });
    }

    res.json({ message: "Save deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar save", error: error.message });
  }
};
