// components/ErrorDisplay.jsx
import React from 'react';

const ErrorDisplay = ({ message }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      backgroundColor: 'rgba(255, 77, 79, 0.1)',
      borderLeft: '3px solid #ff4d4f',
      padding: '0.8rem 1rem',
      marginBottom: '1.5rem',
      borderRadius: '4px'
    }}>
      <div style={{ color: '#ff4d4f', flexShrink: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div style={{ color: '#ff4d4f', fontSize: '0.9rem', lineHeight: '1.4' }}>
        {message}
      </div>
    </div>
  );
};

export default ErrorDisplay;