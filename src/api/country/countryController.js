import { fetchCountries } from "./countryService.js";

export const getAllCountries = async (req, res) => {
  try {
    const countries = await fetchCountries();
    res.json(countries);
  } catch (error) {
    console.error("❌ Erro no controller ao buscar países:", error.message);
    res.status(500).json({ message: "Erro ao buscar países" });
  }
};
