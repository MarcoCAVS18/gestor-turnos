// src/components/layout/PageHeader/index.jsx

import React from 'react';
import Button from '../../ui/Button';

const PageHeader = (***REMOVED*** 
  title, 
  subtitle,
  action,
  className = '' 
***REMOVED***) => ***REMOVED***
  return (
    <div className=***REMOVED***`flex justify-between items-start mb-6 $***REMOVED***className***REMOVED***`***REMOVED***>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">***REMOVED***title***REMOVED***</h2>
        ***REMOVED***subtitle && (
          <p className="text-sm text-gray-600 mt-1">***REMOVED***subtitle***REMOVED***</p>
        )***REMOVED***
      </div>
      
      ***REMOVED***action && (
        <Button 
          onClick=***REMOVED***action.onClick***REMOVED***
          className="flex items-center gap-2"
          icon=***REMOVED***action.icon***REMOVED***
          variant=***REMOVED***action.variant || 'primary'***REMOVED***
          size=***REMOVED***action.size || 'md'***REMOVED***
        >
          ***REMOVED***action.label***REMOVED***
        </Button>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default PageHeader;