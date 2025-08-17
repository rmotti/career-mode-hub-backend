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
router
  .route("/")
  // .all(protect) // se usar auth
  .get(getPlayers)
  .post(postPlayer);

router
  .route("/:playerDocId")
  .all(protect)
  .get(getPlayerById)
  .put(putPlayer)
  .delete(removePlayer);

export default router;
