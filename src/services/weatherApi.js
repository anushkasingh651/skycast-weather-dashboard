const API_URL = "https://api.weatherapi.com/v1";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const CACHE_TIME = 10 * 60 * 1000; // 10 minutes


async function request(endpoint, params) {
  if (!API_KEY) {
    throw new Error(
      "Weather API key is missing. Check your .env file."
    );
  }

  const query = new URLSearchParams({
    key: API_KEY,
    ...params,
  });

  const response = await fetch(
    `${API_URL}/${endpoint}?${query}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message ||
        "Unable to fetch weather data."
    );
  }

  return data;
}


function getCacheKey(city) {
  return `skycast_weather_${city
    .trim()
    .toLowerCase()}`;
}


export async function getWeatherInfo(city) {
  const cacheKey = getCacheKey(city);

  // Check cache
  const cachedData =
    localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const cached = JSON.parse(cachedData);

      const isValid =
        Date.now() - cached.timestamp <
        CACHE_TIME;

      if (isValid) {
        console.log(
          "⚡ Weather loaded from cache"
        );

        return cached.data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }


  // API request
  const data = await request(
    "forecast.json",
    {
      q: city,
      days: 3,
      aqi: "no",
      alerts: "yes",
    }
  );


  // Save to cache
  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );

  console.log(
    "🌐 Weather loaded from API"
  );

  return data;
}


export async function getWeatherByCoordinates(
  latitude,
  longitude
) {
  return request(
    "forecast.json",
    {
      q: `${latitude},${longitude}`,
      days: 3,
      aqi: "no",
      alerts: "yes",
    }
  );
}