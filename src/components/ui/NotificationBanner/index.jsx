// src/components/ui/NotificationBanner/index.jsx

import React from 'react';

const NotificationBanner = (***REMOVED*** message, type = 'success', onClose ***REMOVED***) => ***REMOVED***
  if (!message) return null;

  const getStyles = () => ***REMOVED***
    const styles = ***REMOVED***
      success: 'bg-green-50 text-green-800 border-green-200',
      error: 'bg-red-50 text-red-600 border-red-200'
    ***REMOVED***;
    return styles[type] || styles.success;
  ***REMOVED***;

  return (
    <div className=***REMOVED***`mb-4 p-3 rounded-md border $***REMOVED***getStyles()***REMOVED***`***REMOVED***>
      <div className="flex justify-between items-center">
        <span className="text-sm">***REMOVED***message***REMOVED***</span>
        ***REMOVED***onClose && (
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default NotificationBanner;