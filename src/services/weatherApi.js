/**
 * API Service for fetching weather data from OpenWeather API
 */

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Gets API key from Vite environment variables
 * @returns {string} API Key
 */
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENWEATHER_API_KEY' || apiKey.trim() === '') {
    throw new Error('API key is missing. Please set VITE_OPENWEATHER_API_KEY in your .env file.');
  }
  return apiKey.trim();
};

/**
 * Helper to handle fetch responses and handle HTTP errors
 * @param {string} url 
 * @returns {Promise<any>} Response data JSON
 */
const fetchWeatherJson = async (url) => {
  let response;
  try {
    response = await fetch(url);
  } catch (netErr) {
    throw new Error('Network error. Please check your internet connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found. Please check the spelling and try again.');
    }
    if (response.status === 401) {
      throw new Error('Invalid OpenWeather API Key. Please verify your VITE_OPENWEATHER_API_KEY setting.');
    }
    if (response.status === 429) {
      throw new Error('API rate limit exceeded. Please try again in a few minutes.');
    }
    throw new Error(`Failed to fetch weather data (Status: ${response.status}). Please try again.`);
  }

  const data = await response.json();
  return data;
};

/**
 * Fetch current weather data by city name
 * @param {string} city 
 * @returns {Promise<object>} Current weather data
 */
export const getCurrentWeatherByCity = async (city) => {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city.trim())}&appid=${apiKey}&units=metric`;
  return fetchWeatherJson(url);
};

/**
 * Fetch current weather data by geographic coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} Current weather data
 */
export const getCurrentWeatherByCoordinates = async (lat, lon) => {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  return fetchWeatherJson(url);
};

/**
 * Fetch 5-day / 3-hour forecast data by city name
 * @param {string} city 
 * @returns {Promise<object>} Forecast data
 */
export const getForecastByCity = async (city) => {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city.trim())}&appid=${apiKey}&units=metric`;
  return fetchWeatherJson(url);
};

/**
 * Fetch 5-day / 3-hour forecast data by geographic coordinates
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<object>} Forecast data
 */
export const getForecastByCoordinates = async (lat, lon) => {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  return fetchWeatherJson(url);
};

/**
 * Fetches both current weather and forecast for a city concurrently
 * @param {string} city 
 * @returns {Promise<{ currentWeather: object, forecast: object }>}
 */
export const getWeatherDataByCity = async (city) => {
  const [currentWeather, forecast] = await Promise.all([
    getCurrentWeatherByCity(city),
    getForecastByCity(city)
  ]);
  return { currentWeather, forecast };
};

/**
 * Fetches both current weather and forecast for coordinates concurrently
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<{ currentWeather: object, forecast: object }>}
 */
export const getWeatherDataByCoordinates = async (lat, lon) => {
  const [currentWeather, forecast] = await Promise.all([
    getCurrentWeatherByCoordinates(lat, lon),
    getForecastByCoordinates(lat, lon)
  ]);
  return { currentWeather, forecast };
};
