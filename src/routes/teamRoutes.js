import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/teams
router.get("/", async (req, res) => {
  try {
    // 🔹 Exemplo: pegar times da Premier League (id da liga 39)
    const response = await axios.get("https://api-football-v1.p.rapidapi.com/v3/teams", {
      params: { league: "39", season: "2024" },
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
    });

    // 🔹 Transformar resposta para o frontend
    const teams = response.data.response.map((item) => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo,
      country: item.team.country,
    }));

    res.json(teams);
  } catch (error) {
    console.error("Erro ao buscar times:", error.message);
    res.status(500).json({ message: "Erro ao buscar times" });
  }
});

export default router;
