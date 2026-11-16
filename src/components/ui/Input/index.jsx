// src/components/ui/Input/index.jsx

import React from 'react';

const Input = ({
  label,
  error,
  warning = false,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  focusColor = '#EC4899',
  ...props
}) => {
  // Priority: error (red) > warning (amber, "needs review") > normal.
  const borderClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : warning
      ? 'border-amber-400 focus:border-amber-400'
      : 'border-gray-300 focus:border-transparent';
  const ringColor = error ? '#EF4444' : warning ? '#F59E0B' : focusColor;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {Icon && <Icon size={16} className="inline mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          className={`
            block w-full px-3 py-2 border rounded-lg shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors bg-white
            ${borderClass}
          `}
          style={{
            '--tw-ring-color': ringColor,
            backgroundColor: '#FFFFFF'
          }}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {!error && helperText && (
        <p className={`mt-1 text-sm ${warning ? 'text-amber-600' : 'text-gray-500'}`}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;