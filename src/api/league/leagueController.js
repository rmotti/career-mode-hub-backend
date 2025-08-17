import { fetchLeaguesByCountry } from "./leagueService.js";

export const getLeaguesByCountry = async (req, res) => {
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({ message: "País não informado." });
  }

  try {
    const leagues = await fetchLeaguesByCountry(country);
    res.json(leagues);
  } catch (error) {
    console.error("❌ Erro no controller ao buscar ligas:", error.message);
    res.status(500).json({ message: "Erro ao buscar ligas" });
  }
};
