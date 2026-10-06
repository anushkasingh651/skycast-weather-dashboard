import { useState } from "react";

import "./WeatherCard.css";

export default function WeatherCard({
  weather,
}) {
  const [unit, setUnit] =
    useState("C");

  if (!weather) {
    return null;
  }

  const {
    location,
    current,
  } = weather;

  const temperature =
    unit === "C"
      ? Math.round(current.temp_c)
      : Math.round(current.temp_f);

  const feelsLike =
    unit === "C"
      ? Math.round(
          current.feelslike_c
        )
      : Math.round(
          current.feelslike_f
        );

  return (
    <div className="main-weather-card">
      <div className="weather-card-top">
        <div className="weather-location">
          <p className="weather-label">
            CURRENT WEATHER
          </p>

          <h2>{location.name}</h2>

          <span>
            {location.region
              ? `${location.region}, `
              : ""}
            {location.country}
          </span>
        </div>

        <button
          className="favorite-button"
          title="Add to favorites"
        >
          ☆
        </button>
      </div>

      <div className="weather-main">
        <div className="current-weather-icon">
          {current.condition.icon}
        </div>

        <div>
          <div className="temperature-row">
            <h1>{temperature}°</h1>

            <div className="unit-toggle">
              <button
                className={
                  unit === "C"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setUnit("C")
                }
              >
                °C
              </button>

              <button
                className={
                  unit === "F"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setUnit("F")
                }
              >
                °F
              </button>
            </div>
          </div>

          <h3>
            {current.condition.text}
          </h3>

          <p>
            Feels like{" "}
            {feelsLike}°{unit}
          </p>
        </div>
      </div>

      <div className="updated-time">
        Last updated:{" "}
        {current.last_updated}
      </div>
    </div>
  );
}