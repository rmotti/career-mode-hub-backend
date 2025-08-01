import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend do Career Mode Hub está rodando!' });
});

export default app;
