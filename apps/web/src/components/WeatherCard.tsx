import type { WeatherData } from "../types/weather";

type WeatherCardProps = {
  weather: WeatherData;
};

function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section>
      <h2>{weather.city}</h2>

      <p>
        {weather.temperature} {weather.unit === "celsius" ? "°C" : "°F"}
      </p>

      <p>Condition: {weather.condition}</p>
      <p>Wind speed: {weather.windSpeed} km/h</p>
    </section>
  );
}

export default WeatherCard;
