import React from 'react';
import { Sunrise, Sunset, SunMedium } from 'lucide-react';
import { formatCityLocalTime } from '../utils/weatherUtils';

const SunriseSunset = ({ weather }) => {
  if (!weather || !weather.sys) return null;

  const { sys, dt, timezone: timezoneOffset = 0 } = weather;

  const formatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const sunriseTime = sys.sunrise ? formatCityLocalTime(sys.sunrise, timezoneOffset, formatOptions) : 'N/A';
  const sunsetTime = sys.sunset ? formatCityLocalTime(sys.sunset, timezoneOffset, formatOptions) : 'N/A';

  // Calculate daylight duration & progress
  let durationText = '';
  let dayProgressPercent = 50;

  if (sys.sunrise && sys.sunset) {
    const totalDaylightSec = sys.sunset - sys.sunrise;
    const hours = Math.floor(totalDaylightSec / 3600);
    const mins = Math.floor((totalDaylightSec % 3600) / 60);
    durationText = `${hours}h ${mins}m`;

    if (dt && dt >= sys.sunrise && dt <= sys.sunset) {
      const elapsed = dt - sys.sunrise;
      dayProgressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDaylightSec) * 100)));
    } else if (dt > sys.sunset) {
      dayProgressPercent = 100;
    } else {
      dayProgressPercent = 0;
    }
  }

  return (
    <div className="sun-card">
      <h3 className="section-heading">
        <SunMedium size={18} className="heading-icon" />
        Sun Schedule
      </h3>

      <div className="sun-grid">
        {/* Sunrise Card */}
        <div className="sun-item sunrise-item">
          <div className="sun-icon-box sunrise-icon-box">
            <Sunrise size={26} />
          </div>
          <div className="sun-meta">
            <span className="sun-label">Sunrise</span>
            <span className="sun-time">{sunriseTime}</span>
          </div>
        </div>

        {/* Sunset Card */}
        <div className="sun-item sunset-item">
          <div className="sun-icon-box sunset-icon-box">
            <Sunset size={26} />
          </div>
          <div className="sun-meta">
            <span className="sun-label">Sunset</span>
            <span className="sun-time">{sunsetTime}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Total Daylight Duration */}
      {durationText && (
        <div className="daylight-progress-container">
          <div className="daylight-progress-bar">
            <div 
              className="daylight-progress-fill" 
              style={{ width: `${dayProgressPercent}%` }}
            ></div>
          </div>
          <div className="daylight-info">
            <span>Total Daylight</span>
            <span className="daylight-duration">{durationText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunriseSunset;
