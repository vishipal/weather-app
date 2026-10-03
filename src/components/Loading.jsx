import React from 'react';

const Loading = () => {
  return (
    <div className="loading-container" aria-label="Loading weather data">
      {/* Top Banner Loader */}
      <div className="skeleton-card skeleton-current-weather">
        <div className="skeleton-header">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-subtitle"></div>
        </div>
        <div className="skeleton-body">
          <div className="skeleton-circle"></div>
          <div className="skeleton-temp"></div>
        </div>
      </div>

      {/* Grid Highlights Loader */}
      <div className="skeleton-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card skeleton-detail-card">
            <div className="skeleton-line skeleton-short"></div>
            <div className="skeleton-line skeleton-value"></div>
          </div>
        ))}
      </div>

      {/* Hourly Scroll Loader */}
      <div className="skeleton-card skeleton-hourly-box">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-hourly-row">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-hourly-item">
              <div className="skeleton-line skeleton-short"></div>
              <div className="skeleton-circle-sm"></div>
              <div className="skeleton-line skeleton-short"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
