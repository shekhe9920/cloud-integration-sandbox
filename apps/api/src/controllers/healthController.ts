import type { Request, Response } from "express";

/**
 * Express controller for the health endpoint.
 *
 * Expected route:
 * GET /health
 */
export function getHealth(_req: Request, res: Response): void {
  res.json({
    status: "ok",
    service: "weather-api",
  });
}
