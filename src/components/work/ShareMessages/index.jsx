// src/components/work/ShareMessages/index.jsx

import React from 'react';

const ShareMessages = (***REMOVED*** messages ***REMOVED***) => ***REMOVED***
  const hasMessages = Object.values(messages).some(msg => msg);
  
  if (!hasMessages) return null;

  return (
    <div className="space-y-2">
      ***REMOVED***Object.entries(messages).map(([workId, message ]) => 
        message ? (
          <div key=***REMOVED***workId***REMOVED*** className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
            ***REMOVED*** message ***REMOVED***
          </div>
        ) : null
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShareMessages;