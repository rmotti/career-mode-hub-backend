import axios from "axios";

export const fetchCountries = async () => {
  console.log("🔐 Usando chave:", process.env.RAPIDAPI_KEY);

  const response = await axios.get("https://api-football-v1.p.rapidapi.com/v3/countries", {
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    },
  });

  console.log("🔍 Resposta bruta da API:", JSON.stringify(response.data, null, 2));

  const countries = response.data.response.map((c) => ({
    name: c.name,
    code: c.code,
    flag: c.flag,
  }));

  console.log("🌍 Países processados:", countries);

  return countries;
};
