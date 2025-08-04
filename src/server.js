import dotenv from "dotenv";
dotenv.config(); 

import app from "./app.js";
import { connectDB } from "./config/configdb.js";
import userRoutes from './routes/userRoute.js';
import saveRoutes from "./routes/saveRoutes.js";

app.use("/api/saves", saveRoutes);

app.use('/api/users', userRoutes);

// Conectar no banco
connectDB();

// Subir servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
