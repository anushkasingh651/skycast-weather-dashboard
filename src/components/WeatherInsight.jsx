import "./WeatherInsight.css";

export default function WeatherInsight({
  weather,
}) {
  if (!weather) {
    return null;
  }

  const { current } = weather;

  const temperature =
    current.temp_c;

  const humidity =
    current.humidity;

  const rainChance =
    weather.forecast?.forecastday?.[0]
      ?.day?.daily_chance_of_rain || 0;

  let message = "";
  let activity = "";
  let clothing = "";

  if (rainChance >= 60) {
    message =
      "Rain is likely today. Keep an umbrella nearby and plan indoor activities.";

    activity = "Indoor activities";

    clothing = "Rain protection recommended";
  } else if (temperature >= 32) {
    message =
      "It's a hot day. Stay hydrated and avoid prolonged exposure to direct sunlight.";

    activity = "Best before noon";

    clothing = "Light clothing";
  } else if (temperature >= 24) {
    message =
      "Warm and comfortable conditions. It's a good time to enjoy outdoor activities.";

    activity = "Excellent";

    clothing = "Light clothing";
  } else {
    message =
      "Cool conditions today. A light jacket may make your outdoor plans more comfortable.";

    activity = "Good";

    clothing = "Light jacket";
  }

  return (
    <div className="insight-card">

      <div className="insight-header">

        <div className="insight-icon">
          🧠
        </div>

        <div>
          <p>SKYCAST INTELLIGENCE</p>

          <h2>
            Today's insight
          </h2>
        </div>

      </div>

      <p className="insight-message">
        {message}
      </p>

      <div className="insight-grid">

        <div>
          <span>🌧️ Rain risk</span>
          <strong>
            {rainChance}%
          </strong>
        </div>

        <div>
          <span>🏃 Outdoor activity</span>
          <strong>
            {activity}
          </strong>
        </div>

        <div>
          <span>👕 Clothing</span>
          <strong>
            {clothing}
          </strong>
        </div>

        <div>
          <span>💧 Humidity</span>
          <strong>
            {humidity}%
          </strong>
        </div>

      </div>

    </div>
  );
}