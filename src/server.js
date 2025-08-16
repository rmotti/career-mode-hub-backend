import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/configdb.js";
import userRoutes from "./routes/userRoutes.js";
import saveRoutes from "./routes/saveRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import countriesRoutes from "./routes/countriesRoutes.js";
import leaguesRoutes from "./routes/leaguesRoutes.js";
import seasonRoutes from "./routes/seasonRoutes.js";


// Rotas
app.use("/api/teams", teamRoutes);
app.use("/api/saves", saveRoutes);
app.use("/api/users", userRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/leagues", leaguesRoutes);
app.use("/api/seasons", seasonRoutes);

// Rota raiz (Render mostra isso quando acessa o domínio)
app.get("/", (_req, res) => {
  res.send("Career Mode Hub API está no ar!");
});

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// Só logar segredo em dev
if (process.env.NODE_ENV !== "production") {
  console.log("RAPIDAPI_KEY carregada?", process.env.RAPIDAPI_KEY ? "Sim" : "Não");
}

// Conectar DB e depois subir servidor
connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Erro ao conectar DB:", err?.message || err);
  process.exit(1);
});
