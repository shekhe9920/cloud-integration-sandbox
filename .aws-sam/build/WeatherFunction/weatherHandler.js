"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lambdas/weatherHandler.ts
var weatherHandler_exports = {};
__export(weatherHandler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(weatherHandler_exports);

// src/utils/convertTemperature.ts
function convertTemperature(temp, unit) {
  const safeTemp = temp ?? 0;
  if (unit === "fahrenheit") {
    return safeTemp * 9 / 5 + 32;
  }
  return safeTemp;
}

// src/services/weatherService.ts
async function getCoordinatesForCity(city) {
  const encodedCity = encodeURIComponent(city);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=en&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;
    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude
    };
  } catch (error) {
    console.error("Geocoding failed!", error);
    return null;
  }
}
async function getWeatherByCoordinates(city, latitude, longitude, unit) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data.current || data.current.temperature_2m === void 0 || data.current.wind_speed_10m === void 0 || data.current.weather_code === void 0) {
      return null;
    }
    let temperature = data.current.temperature_2m;
    temperature = convertTemperature(temperature, unit);
    return {
      city,
      temperature: Math.round(temperature * 10) / 10,
      unit,
      windSpeed: data.current.wind_speed_10m,
      condition: mapWeatherCodeToCondition(data.current.weather_code)
    };
  } catch (error) {
    console.error("Weather fetch failed!", error);
    return null;
  }
}
function mapWeatherCodeToCondition(weatherCode) {
  if (weatherCode === 0) {
    return "Clear";
  }
  if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
    return "Cloudy";
  }
  if (weatherCode >= 45 && weatherCode <= 48) {
    return "Fog";
  }
  if (weatherCode >= 51 && weatherCode <= 67) {
    return "Rain";
  }
  if (weatherCode >= 71 && weatherCode <= 77) {
    return "Snow";
  }
  if (weatherCode >= 80 && weatherCode <= 82) {
    return "Rain showers";
  }
  if (weatherCode >= 95) {
    return "Thunderstorm";
  }
  return "Unknown";
}

// src/utils/parseTemperatureUnit.ts
function parseTemperatureUnits(rawUnit) {
  if (rawUnit === void 0) {
    return "celsius";
  } else if (rawUnit === "celsius" || rawUnit === "fahrenheit") {
    return rawUnit;
  } else {
    return null;
  }
}

// src/lambdas/weatherHandler.ts
async function handler(event) {
  const city = event.pathParameters?.city;
  if (!city) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Missing 'city' parameter in the URL"
      })
    };
  }
  const rawUnit = event.queryStringParameters?.unit;
  let unit = parseTemperatureUnits(rawUnit);
  if (unit === null) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Invalid unit. Use celsius or fahrenheit"
      })
    };
  }
  try {
    const coords = await getCoordinatesForCity(city);
    if (!coords) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Not Found",
          message: `Could not find coordinates for city: ${city}`
        })
      };
    }
    const weatherData = await getWeatherByCoordinates(
      city,
      coords.latitude,
      coords.longitude,
      unit
    );
    if (weatherData === null) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to fetch weather data"
        })
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        weatherData
      })
    };
  } catch (error) {
    console.error("Weather Lambda failed: ", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred"
      })
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=weatherHandler.js.map
