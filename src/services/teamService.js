import axios from "axios";

export const fetchTeams = async () => {
  console.log("🔐 Usando chave:", process.env.RAPIDAPI_KEY);

  const response = await axios.get("https://api-football-v1.p.rapidapi.com/v3/teams", {
    params: { league: "39", season: "2024" },
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    },
  });

  console.log("🔍 Resposta bruta da API (teams):", JSON.stringify(response.data, null, 2));

  const teams = response.data.response.map((item) => ({
    id: item.team.id,
    name: item.team.name,
    logo: item.team.logo,
    country: item.team.country,
  }));

  console.log("📦 Times processados:", teams);

  return teams;
};
