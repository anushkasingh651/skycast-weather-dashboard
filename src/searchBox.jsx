import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import {
  getWeatherInfo,
  getWeatherByCoordinates,
} from "./services/weatherApi";

import "./SearchBox.css";


export default function SearchBox({
  onWeatherResult,
}) {

  const [city, setCity] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const searchCity = async (
    cityName
  ) => {

    setLoading(true);

    setError("");

    try {

      const data =
        await getWeatherInfo(
          cityName
        );

      setCity(
        data.location.name
      );

      onWeatherResult(data);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to fetch weather."
      );

      onWeatherResult(null);

    } finally {

      setLoading(false);

    }
  };


  // Listen for history searches
  useEffect(() => {

    const handleHistorySearch =
      (event) => {

        searchCity(
          event.detail
        );

      };


    window.addEventListener(
      "skycast-search-city",
      handleHistorySearch
    );


    return () => {

      window.removeEventListener(
        "skycast-search-city",
        handleHistorySearch
      );

    };

  }, []);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      const cityName =
        city.trim();


      if (!cityName) {

        setError(
          "Please enter a city name."
        );

        return;
      }


      await searchCity(
        cityName
      );

    };


  const handleLocation = () => {

    if (!navigator.geolocation) {

      setError(
        "Geolocation is not supported by your browser."
      );

      return;
    }


    setLocationLoading(true);

    setError("");


    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const data =
            await getWeatherByCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );


          setCity(
            data.location.name
          );


          onWeatherResult(data);

        } catch (err) {

          setError(
            err.message ||
            "Unable to detect your location."
          );

        } finally {

          setLocationLoading(false);

        }

      },


      () => {

        setError(
          "Location permission was denied."
        );

        setLocationLoading(false);

      }

    );

  };


  return (

    <div className="search-container">

      <form
        className="search-form"
        onSubmit={handleSubmit}
      >

        <TextField
          className="city-input"
          label="Enter city"
          placeholder="Delhi, Mumbai, London..."
          variant="outlined"
          value={city}
          onChange={(event) =>
            setCity(
              event.target.value
            )
          }
          fullWidth
          disabled={loading}
        />


        <Button
          className="search-button"
          variant="contained"
          type="submit"
          disabled={
            loading ||
            locationLoading
          }
        >

          {loading
            ? "Searching..."
            : "Search"}

        </Button>

      </form>


      <button
        className="location-button"
        onClick={handleLocation}
        disabled={
          locationLoading ||
          loading
        }
      >

        📍{" "}

        {locationLoading
          ? "Detecting location..."
          : "Use My Location"}

      </button>


      {error && (

        <div className="error-box">

          ⚠️ {error}

        </div>

      )}

    </div>

  );
}