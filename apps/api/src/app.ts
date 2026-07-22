/**
 * Create the Express app and connect all route modules.
 */

import express from "express";

import weatherRoutes from "./routes/weatherRoutes";
import forecastRoutes from "./routes/forecastRoutes";
import healthRoutes from "./routes/healthRoutes";

const app = express();

/**
 * Basic root endpoint for local smoke checks.
 */
app.get("/", (_req, res) => {
  res.send("Weather API is running!");
});

// Mount feature route groups.
app.use("/weather", weatherRoutes);
app.use("/forecast", forecastRoutes);
app.use("/health", healthRoutes);

export default app;
