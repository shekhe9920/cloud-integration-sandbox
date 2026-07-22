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

// src/lambdas/forecastHandler.ts
var forecastHandler_exports = {};
__export(forecastHandler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(forecastHandler_exports);

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

// src/utils/convertTemperature.ts
function convertTemperature(temp, unit) {
  const safeTemp = temp ?? 0;
  if (unit === "fahrenheit") {
    return safeTemp * 9 / 5 + 32;
  }
  return safeTemp;
}

// src/services/weatherService.ts
var geocodingApiUrl = process.env.GEOCODING_API_URL;
var weatherApiUrl = process.env.WEATHER_API_URL;
if (!geocodingApiUrl || !weatherApiUrl) {
  throw new Error("Missing required environment variables");
}
async function getCoordinatesForCity(city) {
  const encodedCity = encodeURIComponent(city);
  const url = geocodingApiUrl + `?name=${encodedCity}&count=1&language=en&format=json`;
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

// src/services/forecastService.ts
var weatherApiUrl2 = process.env.WEATHER_API_URL;
if (!weatherApiUrl2) {
  throw new Error("Missing required environment variables");
}
async function getForecastByCoordinates(city, latitude, longitude, unit) {
  const url = weatherApiUrl2 + `?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=3&timezone=auto`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data.daily || data.daily.time === void 0 || data.daily.temperature_2m_max === void 0 || data.daily.temperature_2m_min === void 0) {
      return null;
    }
    const daily = data.daily;
    const forecastList = daily.time.map(
      (dateStr, index) => {
        return {
          date: dateStr,
          temperatureMax: convertTemperature(
            daily.temperature_2m_max[index],
            unit
          ),
          temperatureMin: convertTemperature(
            daily.temperature_2m_min[index],
            unit
          ),
          precipitation: daily.precipitation_sum?.[index] ?? 0
        };
      }
    );
    return {
      city,
      unit,
      forecast: forecastList
    };
  } catch (error) {
    console.error("Forecast fetch failed!", error);
    return null;
  }
}

// src/lambdas/utils/httpResponses.ts
function errorResponse(statusCode, errMsg, msg) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      error: errMsg,
      message: msg
    })
  };
}
function successResponse(data) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data
    })
  };
}

// src/lambdas/forecastHandler.ts
async function handler(event) {
  const city = event.pathParameters?.city;
  if (!city) {
    return errorResponse(
      400,
      "Bad Request",
      "Missing 'city' parameter in the URL"
    );
  }
  const rawUnit = event.queryStringParameters?.unit;
  const unit = parseTemperatureUnits(rawUnit);
  if (unit === null) {
    return errorResponse(
      400,
      "Bad Request",
      "Invalid unit. Use celsius or fahrenheit"
    );
  }
  try {
    const coords = await getCoordinatesForCity(city);
    if (coords === null) {
      return errorResponse(404, "Not Found", "City not found");
    }
    const forecastData = await getForecastByCoordinates(
      city,
      coords.latitude,
      coords.longitude,
      unit
    );
    if (forecastData === null) {
      return errorResponse(
        500,
        "Internal Server Error",
        "Failed to fetch forecast data"
      );
    }
    return successResponse(forecastData);
  } catch (error) {
    console.error("Forecast Lambda failed: ", error);
    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred"
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=forecastHandler.js.map
