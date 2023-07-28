import './App.css';
import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from 'semantic-ui-react';
import Weather from './components/weather';
import Forecast from './components/forecast';

export default function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      function(error) {
        setError('Geolocation error: ' + error.message);
      }
    );
  }, []);

  useEffect(() => {
    if (lat && long) {
      getWeather(lat, long)
        .then(weather => {
          setWeatherData(weather);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
        });

      getForecast(lat, long)
        .then(data => {
          setForecast(data);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
        });
    }
  }, [lat, long]);

  async function handleResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Please Enable your Location in your browser!");
    }
  }

  async function getWeather(lat, long) {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    );
    const weather = await handleResponse(res);
    if (Object.entries(weather).length) {
      const mappedData = mapDataToWeatherInterface(weather);
      return mappedData;
    }
  }

  async function getForecast(lat, long) {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/forecast?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    );
    const forecastData = await handleResponse(res);
    if (Object.entries(forecastData).length) {
      return forecastData.list
        .filter(forecast => forecast.dt_txt.match(/09:00:00/))
        .map(mapDataToWeatherInterface);
    }
  }

  function mapDataToWeatherInterface(data) {
    const mapped = {
      date: data.dt * 1000, // convert from seconds to milliseconds
      description: data.weather[0].main,
      temperature: Math.round(data.main.temp),
    };
  
    // Add extra properties for the five day forecast: dt_txt, icon, min, max
    if (data.dt_txt) {
      mapped.dt_txt = data.dt_txt;
    }
  
    return mapped;
  }
  
  return (
    <div className="App">
      {weatherData && weatherData.main ? (
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
