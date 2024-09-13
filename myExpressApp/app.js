const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const app = express(); // No asignamos el puerto aquí, lo hará bin/www

app.set('view engine', 'ejs'); // Configurar EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Configurar la carpeta de vistas
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta principal para mostrar el formulario de búsqueda
app.get('/', (req, res) => {
  res.render('index', { weatherData: null, error: null });
});

// Ruta para obtener el clima de las APIs
app.post('/weather', async (req, res) => {
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

    // Datos combinados
    const weatherData = {
      openWeather: openWeatherResponse.data,
      weatherAPI: weatherApiResponse.data,
    };

    // Renderizar la página con los datos obtenidos
    res.render('index', { weatherData, error: null });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.render('index', { weatherData: null, error: 'Error al obtener datos del clima' });
  }
});

module.exports = app; // Exporta solo la aplicación Express, sin lógica de puerto
