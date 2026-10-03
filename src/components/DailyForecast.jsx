import React from 'react';
import { CalendarDays } from 'lucide-react';
import { groupDailyForecast, formatTemp, getWeatherIconUrl } from '../utils/weatherUtils';

const DailyForecast = ({ forecastList = [], timezoneOffset = 0, unit }) => {
  if (!forecastList || forecastList.length === 0) return null;

  const dailyData = groupDailyForecast(forecastList, timezoneOffset);

  return (
    <div className="daily-forecast-section">
      <h3 className="section-heading">
        <CalendarDays size={18} className="heading-icon" />
        5-Day Forecast
      </h3>

      <div className="daily-cards-container">
        {dailyData.map((day) => {
          const maxTemp = formatTemp(day.maxTemp, unit);
          const minTemp = formatTemp(day.minTemp, unit);

          return (
            <div key={day.dateStr} className="daily-card">
              <div className="daily-date-col">
                <span className="daily-day-label">{day.label}</span>
                <span className="daily-sublabel">{day.fullDayName}</span>
              </div>

              <div className="daily-condition-col">
                <img
                  src={getWeatherIconUrl(day.icon, '@2x')}
                  alt={day.condition}
                  className="daily-icon"
                  loading="lazy"
                />
                <span className="daily-condition-text">{day.condition}</span>
              </div>

              <div className="daily-temp-col">
                <span className="max-temp">{maxTemp}</span>
                <span className="temp-slash">/</span>
                <span className="min-temp">{minTemp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
