import type { ForecastData } from "../types/forecast";

type ForecastCardProps = {
  forecast: ForecastData;
};

function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <section>
      <h2>{forecast.city}</h2>

      {forecast.forecast.map((day) => (
        <div key={day.date}>
          <p>Date: {day.date}</p>
          <p>Max Temperature: {day.temperatureMax}</p>
          <p>Min Temperature:{day.temperatureMin}</p>
          <p>Precipitation: {day.precipitation}</p>
        </div>
      ))}
    </section>
  );
}

export default ForecastCard;
