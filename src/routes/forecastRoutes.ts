import { Router } from "express";

import { getForecast } from "../controllers/forecastController";

const router = Router();

router.get("/:city", getForecast);

export default router;
