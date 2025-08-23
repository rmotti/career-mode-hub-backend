import express from "express";
import {
  create,
  listBySaveId,
  getOne,
  update,
  remove
} from "../../controllers/season/seasonController.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// todas as rotas de season exigem usuário autenticado
router.use(protect);

router.post("/", create);                  // Criar temporada
router.get("/by-save/:saveId", listBySaveId); // Listar temporadas de um save
router.get("/:id", getOne);                // Buscar temporada específica
router.put("/:id", update);                // Atualizar temporada
router.patch("/:id", update);              // Atualizar parcial
router.delete("/:id", remove);             // Excluir temporada

export default router;
