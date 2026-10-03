import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Cloud,
  Thermometer
} from 'lucide-react';
import { formatWindSpeed, formatVisibility, formatTemp } from '../utils/weatherUtils';

const WeatherDetails = ({ weather, unit }) => {
  if (!weather) return null;

  const { main, wind, visibility, clouds } = weather;

  const details = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${main?.humidity ?? 0}%`,
      icon: Droplets,
      color: '#38bdf8'
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: formatWindSpeed(wind?.speed, unit),
      icon: Wind,
      color: '#818cf8'
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${main?.pressure ?? 1013} hPa`,
      icon: Gauge,
      color: '#f472b6'
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: formatVisibility(visibility, unit),
      icon: Eye,
      color: '#34d399'
    },
    {
      id: 'cloudiness',
      label: 'Cloudiness',
      value: `${clouds?.all ?? 0}%`,
      icon: Cloud,
      color: '#fbbf24'
    },
    {
      id: 'feels_like',
      label: 'Feels Like',
      value: formatTemp(main?.feels_like, unit),
      icon: Thermometer,
      color: '#f87171'
    }
  ];

  return (
    <div className="weather-details-section">
      <h3 className="section-heading">Weather Highlights</h3>
      <div className="details-grid">
        {details.map((detail) => {
          const IconComponent = detail.icon;
          return (
            <div key={detail.id} className="detail-card">
              <div className="detail-card-header">
                <span className="detail-label">{detail.label}</span>
                <div 
                  className="detail-icon-wrapper" 
                  style={{ backgroundColor: `${detail.color}20`, color: detail.color }}
                >
                  <IconComponent size={20} />
                </div>
              </div>
              <div className="detail-value">{detail.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherDetails;
