import './App.css';
import React, { useEffect, useState } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import Weather from './components/weather';
import Forecast from './components/forecast';

export default function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      function (error) {
        setError('Please enable location access in your browser.');
      }
    );
  }, []);

  useEffect(() => {
    if (lat && long) {
      Promise.all([getWeather(), getForecast()])
        .then(([weather, forecast]) => {
          setWeatherData(weather);
          setForecast(forecast);
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [lat, long]);

  function handleResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Unable to fetch data.');
    }
  }

  function getWeather() {
    return fetch(
      `${API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${API_KEY}`
    )
      .then((res) => handleResponse(res))
      .then((weather) => mapDataToWeatherInterface(weather));
  }

  function getForecast() {
    return fetch(
      `${API_URL}/forecast/?lat=${lat}&lon=${long}&units=metric&APPID=${API_KEY}`
    )
      .then((res) => handleResponse(res))
      .then((forecastData) =>
        forecastData.list
          .filter((forecast) => forecast.dt_txt.includes('09:00:00'))
          .map((data) => mapDataToWeatherInterface(data))
      );
  }

  function mapDataToWeatherInterface(data) {
    return {
      date: data.dt * 1000,
      description: data.weather[0].main,
      temperature: Math.round(data.main.temp),
      dt_txt: data.dt_txt || null,
    };
  }

  return (
    <div className="App">
      {error ? (
        <div>
          <p>{error}</p>
        </div>
      ) : weatherData && forecast ? (
        <div>
          <Weather weatherData={weatherData} />
          <Forecast forecast={forecast} weatherData={weatherData} />
        </div>
      ) : (
        <div>
          <Dimmer active>
            <Loader>Loading..</Loader>
          </Dimmer>
        </div>
      )}
    </div>
  );
}
