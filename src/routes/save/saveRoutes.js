import express from "express";
import { protect } from '../../middlewares/authMiddleware.js'
import {
  createSave,
  getUserSaves,
  updateSave,
  deleteSave,
} from "../../controllers/save/saveController.js";

const router = express.Router();

// Todas as rotas abaixo são protegidas
router.post("/", protect, createSave);
router.get("/", protect, getUserSaves);
router.put("/:id", protect, updateSave);
router.delete("/:id", protect, deleteSave);

export default router;
