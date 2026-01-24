// src/components/ui/Badge/index.jsx

import React from 'react';

/**
 * Reusable component to display labels with different variants
 *
 * @param {string} variant - Color variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @param {string} size - Size: 'xs' | 'sm' | 'md' | 'lg'
 * @param {boolean} rounded - If it should be fully rounded (pill shape)
 * @param {React.ReactNode} children - Badge content
 * @param {React.ReactNode} icon - Optional icon to display
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 */
const Badge = ({
  variant = 'default',
  size = 'sm',
  rounded = false,
  children,
  icon: Icon,
  className = '',
  style = {},
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';

  // Color variants
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    win: 'bg-purple-50 text-purple-700', // Cambié 'pink' por 'win' para consistencia con estilos comunes (opcional, si prefieres mantener 'pink', déjalo como 'pink')
    warning: 'bg-orange-50 text-orange-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-cyan-50 text-cyan-700',
    purple: 'bg-purple-50 text-purple-700',
    pink: 'bg-pink-50 text-pink-700'
  };

  // Sizes
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  // Icon sizes
  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  };

  // Rounded class
  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.default}
    ${sizeClasses[size]}
    ${roundedClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={combinedClasses} style={style} {...props}>
      {Icon && (
        <Icon
          size={iconSizes[size]}
          className="mr-1"
          style={{ flexShrink: 0 }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;