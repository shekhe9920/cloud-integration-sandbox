import { Router } from "express";

import { getForecast } from "../controllers/forecastController";

const router = Router();

/**
 * Forecast routes mounted under /forecast.
 *
 * GET /forecast/:city
 */
router.get("/:city", getForecast);

export default router;
