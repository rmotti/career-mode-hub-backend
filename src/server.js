import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/configdb.js";

dotenv.config();

//  Conectar no banco
connectDB();

// 2️Subir servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
