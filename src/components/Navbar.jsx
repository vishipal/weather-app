import React from 'react';
import { CloudSun } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = ({ onSearch, onCurrentLocation, unit, onToggleUnit, loading, locationLoading }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* App Logo & Name */}
        <div className="navbar-brand">
          <div className="logo-icon-wrapper">
            <CloudSun className="brand-icon" size={28} />
          </div>
          <h1 className="brand-title">WeatherNow</h1>
        </div>

        {/* Search Bar Component */}
        <div className="navbar-search">
          <SearchBar 
            onSearch={onSearch} 
            onCurrentLocation={onCurrentLocation} 
            loading={loading}
            locationLoading={locationLoading}
          />
        </div>

        {/* Temperature Unit Toggle */}
        <div className="unit-toggle-container">
          <div className="unit-toggle">
            <button
              type="button"
              className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => onToggleUnit('C')}
              aria-label="Switch to Celsius"
              title="Celsius"
            >
              °C
            </button>
            <span className="unit-divider">|</span>
            <button
              type="button"
              className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => onToggleUnit('F')}
              aria-label="Switch to Fahrenheit"
              title="Fahrenheit"
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
