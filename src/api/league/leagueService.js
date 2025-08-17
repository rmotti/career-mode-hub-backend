import axios from "axios";

export const fetchLeaguesByCountry = async (country) => {
  console.log("🔐 Usando chave:", process.env.RAPIDAPI_KEY);
  console.log(`🌍 Buscando ligas para o país: ${country}`);

  const response = await axios.get("https://api-football-v1.p.rapidapi.com/v3/leagues", {
    params: { country },
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    },
  });

  console.log("🔍 Resposta bruta da API (leagues):", JSON.stringify(response.data, null, 2));

  // 🔹 Reduz para apenas as ligas mais relevantes
  const leagues = response.data.response.map((item) => ({
    id: item.league.id,
    name: item.league.name,
    logo: item.league.logo,
    season: item.seasons?.at(-1)?.year || "Desconhecido",
  }));

  console.log("📦 Ligas processadas:", leagues);

  return leagues;
};
