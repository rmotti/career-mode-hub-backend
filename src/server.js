import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/configdb.js";
import userRoutes from "./routes/userRoute.js";
import saveRoutes from "./routes/saveRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

console.log("RAPIDAPI_KEY carregada?", process.env.RAPIDAPI_KEY ? "Sim" : "Não");

// Middlewares de rotas
app.use("/api/teams", teamRoutes);
app.use("/api/saves", saveRoutes);
app.use("/api/users", userRoutes);

// Rota raiz para teste do Render
app.get("/", (req, res) => {
  res.json({ status: "Backend do Career Mode Hub está rodando! ✅" });
});

// Porta do Render
const PORT = process.env.PORT || 5000;

// Subir servidor somente depois do DB conectar
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});
