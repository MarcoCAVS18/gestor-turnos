// src/components/ui/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';

/**
 * @param {object} props
 * @param {string} props.size - Tailwind size classes (e.g., "h-12 w-12"). Default: "h-6 w-6".
 * @param {string} props.color - Tailwind border color classes (e.g., "border-pink-500").
 * @param {object} props.style - Inline style object, useful for dynamic colors.
 * @param {string} props.className - Additional CSS classes.
 */
const LoadingSpinner = ({ size = 'h-6 w-6', color = 'border-gray-900', style, className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${size} ${color} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
};

export default LoadingSpinner;