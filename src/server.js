import dotenv from "dotenv";
dotenv.config(); // ✅ Primeiro de tudo

import app from "./app.js";
import { connectDB } from "./config/configdb.js";
import userRoutes from './routes/userRoute.js';

app.use('/api/users', userRoutes);

// Conectar no banco
connectDB();

// Subir servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
