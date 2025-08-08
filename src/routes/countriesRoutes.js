import express from "express";
import { getAllCountries } from "../controllers/countryController.js";

const router = express.Router();

// GET /api/countries
router.get("/", getAllCountries);

export default router;
