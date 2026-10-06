import "./Forecast.css";

export default function Forecast({ weather }) {
  if (!weather?.forecast?.forecastday) {
    return null;
  }

  const days = weather.forecast.forecastday;

  return (
    <div className="forecast-section">

      <div className="forecast-title">
        <p>UPCOMING WEATHER</p>
        <h2>3-day forecast</h2>
      </div>

      <div className="forecast-grid">

        {days.map((day) => (
          <div
            className="forecast-card"
            key={day.date}
          >
            <p className="forecast-date">
              {new Date(day.date).toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }
              )}
            </p>

            <img
              src={`https:${day.day.condition.icon}`}
              alt={day.day.condition.text}
            />

            <h3>
              {Math.round(day.day.maxtemp_c)}°
              <span>
                {Math.round(day.day.mintemp_c)}°
              </span>
            </h3>

            <p className="forecast-condition">
              {day.day.condition.text}
            </p>

            <div className="rain-chance">
              💧 {day.day.daily_chance_of_rain}%
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}