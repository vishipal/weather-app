import React, { useState } from 'react';
import { Search, Navigation, Loader2 } from 'lucide-react';

const SearchBar = ({ onSearch, onCurrentLocation, loading, locationLoading }) => {
  const [cityQuery, setCityQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityQuery.trim()) {
      onSearch(cityQuery.trim());
      setCityQuery('');
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search city (e.g., Delhi, London, Tokyo)..."
          value={cityQuery}
          onChange={(e) => setCityQuery(e.target.value)}
          disabled={loading || locationLoading}
          aria-label="Search city"
        />
        <button
          type="submit"
          className="search-submit-btn"
          disabled={loading || locationLoading || !cityQuery.trim()}
          aria-label="Search"
          title="Search"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
        </button>
      </div>

      <button
        type="button"
        className="location-btn"
        onClick={onCurrentLocation}
        disabled={loading || locationLoading}
        title="Use Current Location"
        aria-label="Use Current Location"
      >
        {locationLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Navigation size={18} />
        )}
        <span className="location-btn-text">Location</span>
      </button>
    </form>
  );
};

export default SearchBar;
