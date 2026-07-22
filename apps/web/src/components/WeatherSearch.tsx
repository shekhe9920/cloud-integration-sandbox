import { useState } from "react";

type WeatherSearchProps = {
  onSearch: (city: string) => void;
};

function WeatherSearch({ onSearch }: WeatherSearchProps) {
  const [city, setCity] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      return;
    }

    onSearch(trimmedCity);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Enter a city"
      />

      <button type="submit">Search</button>
    </form>
  );
}

export default WeatherSearch;
