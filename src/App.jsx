import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Country, City } from "country-state-city";
import WeatherCard from "./components/WeatherCard";

export default function App() {
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "b50314631f34eb7f5215896cc9f14f0a";

  useEffect(() => {
    const countries = Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: `${c.name} (${c.isoCode})`,
    }));
    setCountryOptions(countries);
  }, []);

  useEffect(() => {
    if (country) {
      const cities = City.getCitiesOfCountry(country.value).map((c) => ({
        value: `${c.name},${c.countryCode}`,
        label: c.name,
      }));
      setCityOptions(cities);
      setCity(null);
      setWeatherData(null);
      setForecastData([]);
      setError("");
    } else {
      setCityOptions([]);
      setCity(null);
      setWeatherData(null);
      setForecastData([]);
      setError("");
    }
  }, [country]);

  const fetchWeather = async () => {
    if (!city) {
      setError("Please select a city.");
      return;
    }

    const [name, countryCode] = city.value.split(",");

    try {
      setError("");
      setWeatherData(null);
      setForecastData([]);

      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          name
        )},${countryCode}&limit=1&appid=${API_KEY}`
      );

      if (!geoRes.data.length) {
        setError("City not found. Please try again.");
        return;
      }

      const { lat, lon } = geoRes.data[0];

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(weatherRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const daily = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecastData(daily.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError("Error fetching weather data. Please try again.");
    }
  };

  return (
    <div className="app" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Weather App 🌤</h1>
      <div
        className="search"
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
      >
        <Select
          options={countryOptions}
          value={country}
          onChange={setCountry}
          placeholder="Select a country..."
          isSearchable
          styles={{
            option: (provided) => ({
              ...provided,
              color: "black",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "black",
            }),
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
        />

        <Select
          options={cityOptions}
          value={city}
          onChange={setCity}
          placeholder={country ? "Select a city..." : "Select country first"}
          isSearchable
          isDisabled={!country}
          styles={{
            option: (provided) => ({
              ...provided,
              color: "black",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "black",
            }),
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
        />

        <button onClick={fetchWeather}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData && (
        <WeatherCard data={weatherData} forecast={forecastData} />
      )}
    </div>
  );
}
