import React from 'react';
import { Clock } from 'lucide-react';
import { formatShortTime, formatTemp, getWeatherIconUrl } from '../utils/weatherUtils';

const HourlyForecast = ({ forecastList = [], timezoneOffset = 0, unit }) => {
  if (!forecastList || forecastList.length === 0) return null;

  // Next 8 forecast items (24 hours)
  const hourlyData = forecastList.slice(0, 8);

  return (
    <div className="hourly-forecast-section">
      <h3 className="section-heading">
        <Clock size={18} className="heading-icon" />
        Hourly Forecast (Next 24 Hours)
      </h3>

      <div className="hourly-scroll-container">
        {hourlyData.map((item, idx) => {
          const timeLabel = formatShortTime(item.dt, timezoneOffset);
          const weatherObj = item.weather && item.weather[0] ? item.weather[0] : {};
          const iconCode = weatherObj.icon || '01d';
          const conditionText = weatherObj.main || 'Clear';
          const tempDisplay = formatTemp(item.main?.temp, unit);

          return (
            <div key={item.dt || idx} className="hourly-card">
              <span className="hourly-time">{timeLabel}</span>
              <img
                src={getWeatherIconUrl(iconCode, '@2x')}
                alt={conditionText}
                className="hourly-icon"
                loading="lazy"
              />
              <span className="hourly-temp">{tempDisplay}</span>
              <span className="hourly-condition">{conditionText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
