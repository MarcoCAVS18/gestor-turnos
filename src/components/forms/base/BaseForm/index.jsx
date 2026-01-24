// src/components/forms/base/BaseForm/index.jsx

import React from 'react';

/**
 * BaseForm - Unified base component for all forms
 *
 * Features:
 * - Consistent form structure
 * - Optimized mobile styles (prevents zoom on iOS)
 * - Integrated responsive grid
 *
 * @param {Object} props
 * @param {string} props.id - Form ID to link with external buttons
 * @param {Function} props.onSubmit - Function to execute when submitting the form
 * @param {boolean} props.isMobile - If in mobile view
 * @param {ReactNode} props.children - Form content
 * @param {string} props.className - Additional classes for the container
 */
const BaseForm = ({
  id,
  onSubmit,
  isMobile = false,
  children,
  className = ''
}) => {
  return (
    <div
      className={`w-full ${isMobile ? 'mobile-form' : ''} ${className}`}
      style={{
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      <form id={id} onSubmit={onSubmit} className="space-y-4 w-full">
        {/* Form content */}
        {children}
      </form>

      {/* Additional styles for mobile - prevents zoom on iOS */}
      {isMobile && (
        <style jsx>{`
          .mobile-form input[type="date"],
          .mobile-form input[type="time"],
          .mobile-form input[type="number"],
          .mobile-form input[type="text"],
          .mobile-form select,
          .mobile-form textarea {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            font-size: 16px !important;
          }

          .mobile-form input[type="time"]::-webkit-calendar-picker-indicator,
          .mobile-form input[type="date"]::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
          }
        `}</style>
      )}
    </div>
  );
};

/**
 * FormSection - Helper component for form sections
 * Provides a container with consistent styles
 */
export const FormSection = ({ children, className = '' }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
);

/**
 * FormGrid - Helper component for responsive grids
 * Automatically handles mobile/desktop layout
 */
export const FormGrid = ({ children, columns = 2, className = '' }) => (
  <div className="w-full">
    <div className={`grid grid-cols-${columns} gap-4 ${className}`}>
      {children}
    </div>
  </div>
);

/**
 * FormField - Helper component for individual fields
 * Provides consistent structure with label, input, and error
 */
export const FormField = ({
  children,
  className = ''
}) => (
  <div className={`w-full min-w-0 ${className}`}>
    {children}
  </div>
);

/**
 * FormLabel - Helper component for consistent labels
 */
export const FormLabel = ({
  children,
  icon: Icon,
  className = ''
}) => (
  <label className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
    {Icon && <Icon size={16} className="inline mr-2" />}
    {children}
  </label>
);

/**
 * FormError - Helper component to display errors
 */
export const FormError = ({ error, size = 'xs' }) => {
  if (!error) return null;
  return (
    <p className={`text-red-500 text-${size} mt-1`}>{error}</p>
  );
};

/**
 * getInputClasses - Helper function for input classes
 * Provides consistent classes for all inputs
 */
export const getInputClasses = (isMobile = false, hasError = false) => {
  const baseClasses = `
    w-full px-3 py-3 border rounded-lg text-base transition-colors
    focus:outline-none focus:ring-2 focus:border-transparent
    ${isMobile ? 'text-base min-h-[44px]' : 'text-sm py-2'}
    ${hasError ? 'border-red-500' : 'border-gray-300'}
  `;
  return baseClasses.trim();
};

export default BaseForm;