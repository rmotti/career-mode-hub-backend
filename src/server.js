import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/configdb.js";

// rotas em camadas que você já tem
import userRoutes from "./routes/user/userRoutes.js";
import saveRoutes from "./routes/save/saveRoutes.js";
import seasonRoutes from "./routes/season/seasonRoutes.js";
import playerRoutes from "./routes/player/playerRoutes.js";
import teamRoutes from "./api/team/teamRoutes.js";
import countriesRoutes from "./api/country/countriesRoutes.js";
import leaguesRoutes from "./api/league/leaguesRoutes.js";

// Rotas
app.use("/api/teams", teamRoutes);
app.use("/api/saves", saveRoutes);
app.use("/api/users", userRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/leagues", leaguesRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/saves/:saveId/seasons/:seasonId/players", playerRoutes);

// Rota raiz e healthcheck
app.get("/", (_req, res) => res.send("Career Mode Hub API está no ar!"));
app.get("/api/status", (_req, res) =>
  res.status(200).json({ message: "Backend do Career Mode Hub está rodando!" })
);

// Handler para 404
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

if (process.env.NODE_ENV !== "production") {
  console.log("RAPIDAPI_KEY carregada?", process.env.RAPIDAPI_KEY ? "Sim" : "Não");
}

connectDB()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar DB:", err?.message || err);
    process.exit(1);
  });
