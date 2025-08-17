import express from "express";
import { getLeaguesByCountry } from "./leagueController.js";

const router = express.Router();

// GET /api/leagues?country=England
router.get("/", getLeaguesByCountry);

export default router;
