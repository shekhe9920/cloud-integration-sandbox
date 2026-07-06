/**
 * Create the Express-app and connect routes
 */

import express from "express";

import weatherRoutes from "./routes/weatherRoutes";
import forecastRoutes from "./routes/forecastRoutes";
import healthRoutes from "./routes/healthRoutes";

const app = express();

app.get("/", (_req, res) => {
  res.send("Weather API is running!");
});

app.use("/weather", weatherRoutes);
app.use("/forecast", forecastRoutes);
app.use("/health", healthRoutes);

export default app;
