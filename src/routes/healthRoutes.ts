import { Router } from "express";

import { getHealth } from "../controllers/healthController";

const router = Router();

/**
 * Health routes mounted under /health.
 *
 * GET /health
 */
router.get("/", getHealth);

export default router;
