/**
 * Starts the server
 */

import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Server has started! Go to http://localhost:${PORT} in your browser.`,
  );
  console.log(`Oslo weather: http://localhost:${PORT}/weather/oslo`);

  console.log(`Oslo forecast: http://localhost:${PORT}/forecast/oslo`);

  console.log(`\nServer health: http://localhost:${PORT}/health`);
});
