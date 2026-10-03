import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import SunriseSunset from './components/SunriseSunset';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import RecentSearches from './components/RecentSearches';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

import { getWeatherDataByCity, getWeatherDataByCoordinates } from './services/weatherApi';
import { getWeatherTheme } from './utils/weatherUtils';

const DEFAULT_CITY = 'New Delhi';
const RECENT_STORAGE_KEY = 'weathernow_recent_searches';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');
  const [recentCities, setRecentCities] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  // Helper to update recent cities in state and localStorage
  const addRecentCity = useCallback((cityName) => {
    if (!cityName) return;
    setRecentCities((prev) => {
      // Clean up string case-insensitively
      const trimmed = cityName.trim();
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return updated;
    });
  }, []);

  // Fetch weather data by city name
  const fetchWeatherForCity = useCallback(async (targetCity) => {
    if (!targetCity || !targetCity.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { currentWeather: currData, forecast: forecastData } = await getWeatherDataByCity(targetCity);
      setCurrentWeather(currData);
      setForecast(forecastData);
      setCity(currData.name || targetCity);
      addRecentCity(currData.name || targetCity);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while fetching weather data.');
    } finally {
      setLoading(false);
    }
  }, [addRecentCity]);

  // Fetch weather data by geographic coordinates
  const fetchWeatherForCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setLocationLoading(true);
    setError(null);

    try {
      const { currentWeather: currData, forecast: forecastData } = await getWeatherDataByCoordinates(lat, lon);
      setCurrentWeather(currData);
      setForecast(forecastData);
      setCity(currData.name || 'Current Location');
      if (currData.name) {
        addRecentCity(currData.name);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather for your location.');
    } finally {
      setLoading(false);
      setLocationLoading(false);
    }
  }, [addRecentCity]);

  // Handle Geolocation request
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please search for a city instead.');
      return;
    }

    setLocationLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherForCoords(latitude, longitude);
      },
      (geoError) => {
        setLocationLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission was denied. Please search for a city instead.');
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setError('Location information is unavailable. Please try searching for a city.');
        } else if (geoError.code === geoError.TIMEOUT) {
          setError('Location request timed out. Please try searching for a city.');
        } else {
          setError('Failed to retrieve current location. Please search for a city.');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [fetchWeatherForCoords]);

  // Load stored recent cities and fetch initial default city weather
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentCities(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }

    // Initial load: fetch New Delhi weather
    fetchWeatherForCity(DEFAULT_CITY);
  }, [fetchWeatherForCity]);

  // Handle unit toggle
  const handleToggleUnit = (newUnit) => {
    if (newUnit !== unit) {
      setUnit(newUnit);
    }
  };

  // Handle clearing recent searches
  const handleClearRecent = () => {
    setRecentCities([]);
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  };

  // Determine theme and background based on current weather
  const weatherMain = currentWeather?.weather?.[0]?.main || 'Clear';
  const iconCode = currentWeather?.weather?.[0]?.icon || '01d';
  const theme = getWeatherTheme(weatherMain, iconCode);

  return (
    <div className={`app-root ${theme.themeClass}`} style={{ background: theme.bgGradient }}>
      {/* Top Navigation */}
      <Navbar
        onSearch={fetchWeatherForCity}
        onCurrentLocation={handleCurrentLocation}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        loading={loading}
        locationLoading={locationLoading}
      />

      {/* Main Container */}
      <main className="main-content">
        <div className="content-container">
          {/* Recent Searches Pills */}
          <RecentSearches
            searches={recentCities}
            onSelectCity={fetchWeatherForCity}
            onClearSearches={handleClearRecent}
          />

          {/* Error Banner */}
          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => fetchWeatherForCity(city || DEFAULT_CITY)}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Loading State Skeleton or Weather Content */}
          {loading ? (
            <Loading />
          ) : currentWeather ? (
            <div className="dashboard-grid">
              {/* Primary Column: Current Weather & Forecasts */}
              <div className="primary-column">
                <CurrentWeather
                  weather={currentWeather}
                  unit={unit}
                  onToggleUnit={handleToggleUnit}
                />

                <HourlyForecast
                  forecastList={forecast?.list || []}
                  timezoneOffset={currentWeather.timezone || 0}
                  unit={unit}
                />

                <DailyForecast
                  forecastList={forecast?.list || []}
                  timezoneOffset={currentWeather.timezone || 0}
                  unit={unit}
                />
              </div>

              {/* Secondary Column: Highlights & Sun Schedule */}
              <div className="secondary-column">
                <WeatherDetails
                  weather={currentWeather}
                  unit={unit}
                />

                <SunriseSunset
                  weather={currentWeather}
                />
              </div>
            </div>
          ) : !error ? (
            <div className="empty-state">
              <p>No weather data available. Please search for a city above.</p>
            </div>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>WeatherNow &copy; {new Date().getFullYear()} &bull; Powered by OpenWeather API</p>
      </footer>
    </div>
  );
}

export default App;
