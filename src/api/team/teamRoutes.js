import express from "express";
import { getAllTeams } from "./teamController.js";

const router = express.Router();

// GET /api/teams
router.get("/", getAllTeams);

export default router;
