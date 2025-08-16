import express from 'express';
import {
  create,
  listBySaveId,
  getOne,
  update,
  remove
} from '../controllers/seasonController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas de season exigem usuário autenticado
router.post('/', protect, create);                 // Criar temporada
router.get('/by-save/:saveId', protect, listBySaveId); // Listar temporadas de um save
router.get('/:id', protect, getOne);               // Buscar temporada específica
router.put('/:id', protect, update);               // Atualizar temporada
router.patch('/:id', protect, update);             // Atualizar parcial
router.delete('/:id', protect, remove);            // Excluir temporada

export default router;
