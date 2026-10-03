import React from 'react';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-banner-container" role="alert">
      <div className="error-banner">
        <div className="error-icon-wrapper">
          <AlertTriangle size={24} className="error-icon" />
        </div>

        <div className="error-content">
          <h4 className="error-title">Weather Request Error</h4>
          <p className="error-text">{message}</p>
        </div>

        <div className="error-actions">
          {onRetry && (
            <button 
              type="button" 
              className="error-retry-btn"
              onClick={onRetry}
              title="Try again"
            >
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
          )}
          {onDismiss && (
            <button 
              type="button" 
              className="error-dismiss-btn"
              onClick={onDismiss}
              title="Dismiss error"
              aria-label="Dismiss error"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
