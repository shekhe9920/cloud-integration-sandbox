import { useState } from "react";
import "./App.css";
import WeatherSearch from "./components/WeatherSearch";
import { getCurrentWeather } from "./api/weatherApi";
import { getCurrentForecast } from "./api/forecastApi";
import type { WeatherData } from "./types/weather";
import type { ForecastData } from "./types/forecast";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>();

  async function handleSearch(city: string) {
    const weatherResults = await getCurrentWeather(city);
    setWeather(weatherResults);

    const forecastResults = await getCurrentForecast(city);
    setForecast(forecastResults);
  }

  return (
    <main className="app">
      <h1>Weather Dashboard</h1>

      <p>Search for a city to see the current weather.</p>
      <WeatherSearch onSearch={(city) => handleSearch(city)} />
      {weather && <WeatherCard weather={weather} />}
      {forecast && <ForecastCard forecast={forecast} />}
    </main>
  );
}

export default App;
