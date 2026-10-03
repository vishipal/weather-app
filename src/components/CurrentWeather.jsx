import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Radio } from 'lucide-react';
import {
  formatTemp,
  formatCityLocalTime,
  formatCityLocalDate,
  getUtcOffsetString,
  getCountryName,
  getWeatherIconUrl
} from '../utils/weatherUtils';

const CurrentWeather = ({ weather, unit, onToggleUnit }) => {
  // Live ticking clock state
  const [liveNowMs, setLiveNowMs] = useState(Date.now());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNowMs(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!weather) return null;

  const { name, sys, dt, main, weather: weatherDetails, timezone: timezoneOffset = 0 } = weather;
  const countryFull = sys?.country ? getCountryName(sys.country) : '';
  const weatherItem = weatherDetails && weatherDetails[0] ? weatherDetails[0] : {};
  const iconCode = weatherItem.icon || '01d';
  const conditionMain = weatherItem.main || 'Clear';
  const description = weatherItem.description || conditionMain;

  // Capitalize description
  const formattedDescription = description
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const tempDisplay = formatTemp(main?.temp, unit);
  const feelsLikeDisplay = formatTemp(main?.feels_like, unit);

  // 1. Live Current Local Time & Date for the searched city
  const liveLocalTime = formatCityLocalTime(liveNowMs, timezoneOffset, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const liveLocalDate = formatCityLocalDate(liveNowMs, timezoneOffset);
  const utcOffsetBadge = getUtcOffsetString(timezoneOffset);

  // 2. Weather observation snapshot time (dt from OpenWeather API)
  const weatherObservedTime = formatCityLocalTime(dt, timezoneOffset, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="current-weather-card">
      <div className="card-glass-glow"></div>
      
      {/* Top Meta Header: Location, Live Time & Date */}
      <div className="current-meta-header">
        <div className="location-info">
          <MapPin size={22} className="location-pin-icon" />
          <div>
            <h2 className="city-name">
              {name}{countryFull ? `, ${countryFull}` : ''}
            </h2>
            <span className="utc-offset-badge">{utcOffsetBadge}</span>
          </div>
        </div>

        <div className="datetime-info">
          <div className="live-clock-row" title="Live City Local Time">
            <Clock size={16} className="clock-icon animate-pulse" />
            <span className="live-time-text">{liveLocalTime}</span>
          </div>
          <span className="datetime-item">
            <Calendar size={14} />
            {liveLocalDate}
          </span>
          <span className="obs-time-item" title="OpenWeather Observation Timestamp">
            <Radio size={12} className="obs-icon" />
            Observed at {weatherObservedTime}
          </span>
        </div>
      </div>

      {/* Main Temp & Icon Grid */}
      <div className="current-main-body">
        <div className="weather-icon-container">
          <img
            src={getWeatherIconUrl(iconCode, '@4x')}
            alt={formattedDescription}
            className="weather-main-icon"
            loading="eager"
          />
        </div>

        <div className="temperature-container">
          <div className="temp-badge-row">
            <span className="temp-number">{tempDisplay}</span>
            <button
              type="button"
              className="unit-toggle-chip"
              onClick={() => onToggleUnit(unit === 'C' ? 'F' : 'C')}
              title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
              aria-label="Toggle Temperature Unit"
            >
              °{unit}
            </button>
          </div>

          <p className="condition-text">{formattedDescription}</p>
          <p className="feels-like-text">
            Feels like <strong>{feelsLikeDisplay}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
