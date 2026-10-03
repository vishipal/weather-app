import React from 'react';
import { History, X, MapPin } from 'lucide-react';

const RecentSearches = ({ searches = [], onSelectCity, onClearSearches }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="recent-searches-container">
      <div className="recent-header">
        <span className="recent-title">
          <History size={15} />
          Recent Searches
        </span>
        <button 
          className="recent-clear-btn" 
          onClick={onClearSearches}
          title="Clear recent searches"
          aria-label="Clear recent searches"
        >
          Clear
        </button>
      </div>

      <div className="recent-chips-wrapper">
        {searches.map((city, index) => (
          <button
            key={`${city}-${index}`}
            className="recent-chip"
            onClick={() => onSelectCity(city)}
            type="button"
          >
            <MapPin size={13} className="chip-icon" />
            <span>{city}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
