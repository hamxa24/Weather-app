import React from "react";

export default function WeatherCard({ data, forecast }) {
  const { name, sys, weather, main, wind } = data;
  const desc = weather[0].description;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

  return (
    <div className="weather-card">
      <div className="current-weather">
        <div className="left">
          <img src={icon} alt={desc} />
          <p className="desc">{desc}</p>
        </div>
        <div className="right">
          <p>Wind: {wind.speed} m/s</p>
          <p>Humidity: {main.humidity}%</p>
          <p>Pressure: {main.pressure} mb</p>
          <h2>{Math.round(main.temp)}°C</h2>
        </div>
      </div>

      <div className="forecast">
        {forecast.map((day, i) => (
          <div key={i} className="forecast-day">
            <p>
              {new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <p>{Math.round(day.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}
