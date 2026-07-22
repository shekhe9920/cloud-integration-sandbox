import { useState } from "react";
import "./App.css";
import WeatherSearch from "./components/WeatherSearch";
import { getCurrentWeather } from "./api/weatherApi";
import type { WeatherData } from "./types/weather";
import WeatherCard from "./components/WeatherCard";
function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  async function handleSearch(city: string) {
    const results = await getCurrentWeather(city);
    setWeather(results);
  }

  return (
    <main className="app">
      <h1>Weather Dashboard</h1>

      <p>Search for a city to see the current weather.</p>
      <WeatherSearch onSearch={(city) => handleSearch(city)} />
      {weather && <WeatherCard weather={weather} />}
    </main>
  );
}

export default App;
