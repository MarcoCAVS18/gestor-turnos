// src/components/ui/NotificationBanner/index.jsx

import React from 'react';

const NotificationBanner = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const getStyles = () => {
    const styles = {
      success: 'bg-green-50 text-green-800 border-green-200',
      error: 'bg-red-50 text-red-600 border-red-200'
    };
    return styles[type] || styles.success;
  };

  return (
    <div className={`mb-4 p-3 rounded-md border ${getStyles()}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;