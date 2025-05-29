import React from 'react';
import { useApp } from '../../../contexts/AppContext';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  ...props
}) => {
  const { coloresTemáticos } = useApp();

  const focusRingColor = coloresTemáticos?.base || '#EC4899';

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
          className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'focus:border-transparent'
          }`}
          style={{
            '--tw-ring-color': error ? '#EF4444' : focusRingColor
          }}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;