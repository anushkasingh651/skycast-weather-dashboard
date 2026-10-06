import { useEffect, useState } from "react";

import SearchBox from "./searchBox";

import WeatherCard from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";
import WeatherInsight from "./components/WeatherInsight";
import Forecast from "./components/Forecast";
import Footer from "./components/Footer";

import "./App.css";


export default function App() {

  const [weather, setWeather] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem(
        "skycast_theme"
      ) === "dark"
    );
  });

  const [searchHistory, setSearchHistory] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "skycast_history"
          )
        ) || [];
      } catch {
        return [];
      }
    });


  // Save theme
  useEffect(() => {
    localStorage.setItem(
      "skycast_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);


  // Save search history
  useEffect(() => {
    localStorage.setItem(
      "skycast_history",
      JSON.stringify(searchHistory)
    );
  }, [searchHistory]);


  const handleWeatherResult = (data) => {

    setWeather(data);

    if (!data) {
      return;
    }

    const city = data.location.name;

    setSearchHistory((previous) => {

      const updated = [
        city,
        ...previous.filter(
          (item) =>
            item.toLowerCase() !==
            city.toLowerCase()
        ),
      ];

      return updated.slice(0, 6);
    });
  };


  const handleHistorySearch = (city) => {

    // This event is handled by SearchBox
    window.dispatchEvent(
      new CustomEvent(
        "skycast-search-city",
        {
          detail: city,
        }
      )
    );
  };


  const clearHistory = () => {
    setSearchHistory([]);
  };


  // Unsplash images
  const weatherImages = {

    sunny:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",

    cloudy:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=80",

    rain:
      "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1600&q=80",

    snow:
      "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1600&q=80",

    night:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80",

    default:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
  };


  const getWeatherImage = () => {

    if (!weather) {
      return weatherImages.default;
    }

    const condition =
      weather.current.condition.text.toLowerCase();


    if (
      condition.includes("rain") ||
      condition.includes("drizzle") ||
      condition.includes("shower")
    ) {
      return weatherImages.rain;
    }


    if (
      condition.includes("snow") ||
      condition.includes("sleet") ||
      condition.includes("ice")
    ) {
      return weatherImages.snow;
    }


    if (
      condition.includes("cloud") ||
      condition.includes("overcast")
    ) {
      return weatherImages.cloudy;
    }


    if (
      condition.includes("clear") &&
      weather.current.is_day === 0
    ) {
      return weatherImages.night;
    }


    if (
      condition.includes("sunny") ||
      condition.includes("clear")
    ) {
      return weatherImages.sunny;
    }


    return weatherImages.default;
  };


  return (

    <div
      className={
        darkMode
          ? "weather-page dark-mode"
          : "weather-page"
      }
    >

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-logo">
            ☁️
          </div>

          <span>
            SkyCast
          </span>

        </div>


        <div className="nav-right">

          <span className="nav-description">
            Smart Weather Intelligence
          </span>


          <div className="nav-location">
            🌍 Live Weather
          </div>


          <button
            className="theme-button"
            onClick={() =>
              setDarkMode(
                (previous) =>
                  !previous
              )
            }
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-badge">

              <span className="live-dot"></span>

              LIVE WEATHER INTELLIGENCE

            </div>


            <h1>

              Weather,

              <br />

              <span>
                made intelligent.
              </span>

            </h1>


            <p className="hero-text">

              Get real-time weather conditions,
              forecasts, rain probability and
              personalized insights for any city.

            </p>


            <SearchBox
              onWeatherResult={
                handleWeatherResult
              }
            />

          </div>

        </section>


        {/* ================= SEARCH HISTORY ================= */}

        {searchHistory.length > 0 && (

          <section className="history-section">

            <div className="history-header">

              <div>

                <p>
                  RECENT SEARCHES
                </p>

                <h2>
                  Search history
                </h2>

              </div>


              <button
                className="clear-history"
                onClick={clearHistory}
              >
                Clear
              </button>

            </div>


            <div className="history-list">

              {searchHistory.map(
                (city) => (

                  <button
                    key={city}
                    className="history-item"
                    onClick={() =>
                      handleHistorySearch(
                        city
                      )
                    }
                  >
                    <span>
                      🕘
                    </span>

                    {city}

                    <span className="history-arrow">
                      →
                    </span>

                  </button>

                )
              )}

            </div>

          </section>

        )}


        {/* ================= WEATHER IMAGE ================= */}

        {weather && (

          <section className="weather-image-section">

            <img
              src={getWeatherImage()}
              alt="Current weather landscape"
              className="weather-background-image"
            />


            <div className="weather-image-overlay"></div>


            <div className="weather-image-content">

              <span>
                📍 {weather.location.name},{" "}
                {weather.location.country}
              </span>


              <h2>
                {weather.current.condition.text}
              </h2>


              <p>
                {Math.round(
                  weather.current.temp_c
                )}
                °C
              </p>

            </div>

          </section>

        )}


        {/* ================= WEATHER DATA ================= */}

        {weather && (

          <section className="weather-section">

            <div className="section-heading">

              <div>

                <p>
                  YOUR WEATHER
                </p>

                <h2>
                  Current conditions
                </h2>

              </div>


              <span>
                Live data
              </span>

            </div>


            <WeatherCard
              weather={weather}
            />


            <WeatherDetails
              weather={weather}
            />


            <WeatherInsight
              weather={weather}
            />


            <Forecast
              weather={weather}
            />

          </section>

        )}


        {/* ================= EMPTY STATE ================= */}

        {!weather && (

          <section className="empty-state">

            <div className="empty-card">

              <div className="empty-weather-icon">
                🌤️
              </div>


              <div>

                <h2>
                  Search for a city
                </h2>


                <p>
                  Enter a city above to explore
                  live weather, insights and
                  upcoming forecasts.
                </p>

              </div>

            </div>

          </section>

        )}

      </main>


      <Footer />

    </div>
  );
}