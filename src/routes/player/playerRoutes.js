// src/routes/playerRoutes.js
import express from "express";
import {
  getPlayers,
  postPlayer,
  getPlayerById,
  putPlayer,
  removePlayer,
} from "../../controllers/player/playerControllers.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// Base: /api/saves/:saveId/seasons/:seasonId/players
router.use(protect);

router.route("/")
  .get(getPlayers)   // lista jogadores da temporada
  .post(postPlayer); // cria jogador na temporada

router.route("/:playerDocId")
  .get(getPlayerById) // busca jogador específico
  .put(putPlayer)     // atualiza jogador
  .delete(removePlayer); // remove jogador

export default router;
