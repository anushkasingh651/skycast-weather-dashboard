import "./WeatherDetails.css";

export default function WeatherDetails({ weather }) {
  if (!weather) {
    return null;
  }

  const { current } = weather;

  return (
    <div className="details-grid">
      <div className="detail-card">
        <div className="detail-icon">💧</div>
        <p>Humidity</p>
        <h3>{current.humidity}%</h3>
      </div>

      <div className="detail-card">
        <div className="detail-icon">💨</div>
        <p>Wind</p>
        <h3>{current.wind_kph} km/h</h3>
      </div>

      <div className="detail-card">
        <div className="detail-icon">👁️</div>
        <p>Visibility</p>
        <h3>{current.vis_km} km</h3>
      </div>

      <div className="detail-card">
        <div className="detail-icon">☀️</div>
        <p>UV Index</p>
        <h3>{current.uv}</h3>
      </div>
    </div>
  );
}