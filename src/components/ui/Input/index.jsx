// src/components/ui/Input/index.jsx

import React from 'react';

const Input = (***REMOVED***
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  focusColor = '#EC4899',
  ...props
***REMOVED***) => ***REMOVED***
  return (
    <div className=***REMOVED***className***REMOVED***>
      ***REMOVED***label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ***REMOVED***Icon && <Icon size=***REMOVED***16***REMOVED*** className="inline mr-2" />***REMOVED***
          ***REMOVED***label***REMOVED***
          ***REMOVED***required && <span className="text-red-500 ml-1">*</span>***REMOVED***
        </label>
      )***REMOVED***
      
      <div className="relative">
        <input
          className=***REMOVED***`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors $***REMOVED***
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'focus:border-transparent'
          ***REMOVED***`***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': error ? '#EF4444' : focusColor
          ***REMOVED******REMOVED***
          ***REMOVED***...props***REMOVED***
        />
      </div>
      
      ***REMOVED***error && (
        <p className="mt-1 text-sm text-red-600">***REMOVED***error***REMOVED***</p>
      )***REMOVED***
      
      ***REMOVED***!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">***REMOVED***helperText***REMOVED***</p>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default Input;