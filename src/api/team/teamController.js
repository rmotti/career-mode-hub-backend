import { fetchTeams } from "./teamService.js";

export const getAllTeams = async (req, res) => {
  try {
    const teams = await fetchTeams();
    res.json(teams);
  } catch (error) {
    console.error("❌ Erro no controller ao buscar times:", error.message);
    res.status(500).json({ message: "Erro ao buscar times" });
  }
};
