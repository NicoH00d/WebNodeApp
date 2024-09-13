const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ruta principal para renderizar el formulario
router.get('/', function(req, res, next) {
  res.render('index', { weatherData: null, error: null });  // Asegúrate de que 'weatherData' está presente, aunque sea null
});

// Ruta para obtener el clima
router.post('/weather', async function(req, res, next) {
  const city = req.body.city;
  const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
  const weatherApiKey = process.env.WEATHER_API_KEY;

  try {
    // Llamada a OpenWeather
    const openWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`
    );

    // Llamada a WeatherAPI
    const weatherApiResponse = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&aqi=no`
    );

    // Combina los datos obtenidos
    const weatherData = {
      openWeather: openWeatherResponse.data,
      weatherAPI: weatherApiResponse.data,
    };

    // Renderiza la vista con los datos del clima
    res.render('index', { weatherData: weatherData, error: null });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.render('index', { weatherData: null, error: 'Error al obtener los datos del clima' });
  }
});

module.exports = router;
