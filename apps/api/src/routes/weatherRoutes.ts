import { Router } from "express";

import { getWeather } from "../controllers/weatherController";

const router = Router();

/**
 * Weather routes mounted under /weather.
 *
 * GET /weather/:city
 */
router.get("/:city", getWeather);

export default router;
