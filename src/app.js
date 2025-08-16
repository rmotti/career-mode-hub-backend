import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// ===== CORS =====
const allowedOrigins = [
  "http://localhost:3000", // CRA
  "http://localhost:5173", // Vite
  "https://career-mode-hub.vercel.app/" // TODO: troque pelo domínio real do seu front na Vercel
];

app.use(cors({
  origin: (origin, cb) => {
    // permite tools sem origin (ex.: curl/insomnia) e os allowed
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin não permitido: ${origin}`));
  },
  credentials: true
}));

// ===== Segurança básica =====
app.use(helmet());
app.use(express.json());

// ===== Healthcheck =====
app.get("/api/status", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" });
});

export default app;
