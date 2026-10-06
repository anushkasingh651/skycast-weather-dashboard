const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const CACHE_TIME = 10 * 60 * 1000;

const weatherCodeMap = {
  0: {
    text: "Clear sky",
    icon: "☀️",
  },
  1: {
    text: "Mainly clear",
    icon: "🌤️",
  },
  2: {
    text: "Partly cloudy",
    icon: "⛅",
  },
  3: {
    text: "Overcast",
    icon: "☁️",
  },
  45: {
    text: "Fog",
    icon: "🌫️",
  },
  48: {
    text: "Depositing rime fog",
    icon: "🌫️",
  },
  51: {
    text: "Light drizzle",
    icon: "🌦️",
  },
  53: {
    text: "Moderate drizzle",
    icon: "🌦️",
  },
  55: {
    text: "Dense drizzle",
    icon: "🌧️",
  },
  61: {
    text: "Light rain",
    icon: "🌦️",
  },
  63: {
    text: "Moderate rain",
    icon: "🌧️",
  },
  65: {
    text: "Heavy rain",
    icon: "🌧️",
  },
  71: {
    text: "Light snow",
    icon: "🌨️",
  },
  73: {
    text: "Moderate snow",
    icon: "❄️",
  },
  75: {
    text: "Heavy snow",
    icon: "❄️",
  },
  80: {
    text: "Rain showers",
    icon: "🌦️",
  },
  81: {
    text: "Moderate rain showers",
    icon: "🌧️",
  },
  82: {
    text: "Heavy rain showers",
    icon: "🌧️",
  },
  95: {
    text: "Thunderstorm",
    icon: "⛈️",
  },
  96: {
    text: "Thunderstorm with hail",
    icon: "⛈️",
  },
  99: {
    text: "Thunderstorm with heavy hail",
    icon: "⛈️",
  },
};

function getCondition(code) {
  return (
    weatherCodeMap[code] || {
      text: "Unknown",
      icon: "🌤️",
    }
  );
}

function getCacheKey(city) {
  return `skycast_openmeteo_${city
    .trim()
    .toLowerCase()}`;
}

async function getCoordinates(city) {
  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `${GEOCODING_URL}?${params}`
  );

  if (!response.ok) {
    throw new Error(
      "Unable to search for this city."
    );
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(
      `City "${city}" was not found.`
    );
  }

  return data.results[0];
}

async function getForecast(
  latitude,
  longitude
) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,visibility,uv_index",
    hourly:
      "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,visibility",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max",
    forecast_days: "3",
    timezone: "auto",
  });

  const response = await fetch(
    `${WEATHER_URL}?${params}`
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch weather data."
    );
  }

  return response.json();
}

function transformWeather(location, data) {
  const currentCondition = getCondition(
    data.current.weather_code
  );

  const forecastday =
    data.daily.time.map((date, index) => ({
      date,

      day: {
        maxtemp_c:
          data.daily.temperature_2m_max[index],

        mintemp_c:
          data.daily.temperature_2m_min[index],

        daily_chance_of_rain:
          data.daily
            .precipitation_probability_max[index],

        condition: getCondition(
          data.daily.weather_code[index]
        ),
      },
    }));

  return {
    location: {
      name: location.name,
      region:
        location.admin1 || "",
      country:
        location.country || "",
      latitude: location.latitude,
      longitude: location.longitude,
    },

    current: {
      temp_c:
        data.current.temperature_2m,

      temp_f:
        data.current.temperature_2m * 9 / 5 + 32,

      feelslike_c:
        data.current.apparent_temperature,

      feelslike_f:
        data.current.apparent_temperature *
          9 /
          5 +
        32,

      humidity:
        data.current.relative_humidity_2m,

      wind_kph:
        Math.round(
          data.current.wind_speed_10m *
            3.6
        ),

      vis_km:
        data.current.visibility
          ? (
              data.current.visibility /
              1000
            ).toFixed(1)
          : "N/A",

      uv:
        data.current.uv_index,

      condition: {
        text: currentCondition.text,
        icon: currentCondition.icon,
      },

      is_day:
        data.current.is_day ?? 1,

      last_updated:
        new Date().toLocaleString(),
    },

    forecast: {
      forecastday,
    },
  };
}

export async function getWeatherInfo(city) {
  const cacheKey = getCacheKey(city);

  const cachedData =
    localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const cached =
        JSON.parse(cachedData);

      if (
        Date.now() - cached.timestamp <
        CACHE_TIME
      ) {
        console.log(
          "⚡ Weather loaded from cache"
        );

        return cached.data;
      }

      localStorage.removeItem(cacheKey);
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const location =
    await getCoordinates(city);

  const forecast =
    await getForecast(
      location.latitude,
      location.longitude
    );

  const data = transformWeather(
    location,
    forecast
  );

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );

  console.log(
    "🌐 Weather loaded from Open-Meteo"
  );

  return data;
}

export async function getWeatherByCoordinates(
  latitude,
  longitude
) {
  const forecast =
    await getForecast(
      latitude,
      longitude
    );

  const reverseParams =
    new URLSearchParams({
      latitude,
      longitude,
      count: "1",
      language: "en",
      format: "json",
    });

  const response = await fetch(
    `${GEOCODING_URL}?${reverseParams}`
  );

  let location = {
    name: "Your Location",
    admin1: "",
    country: "",
    latitude,
    longitude,
  };

  if (response.ok) {
    const data = await response.json();

    if (
      data.results &&
      data.results.length > 0
    ) {
      location = data.results[0];
    }
  }

  return transformWeather(
    location,
    forecast
  );
}