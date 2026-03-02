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

  // Color variants — each includes dark mode counterpart
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    primary: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    success: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    win:     'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    warning: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    danger:  'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info:    'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
    purple:  'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    pink:    'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
    // No hardcoded colors — color is fully driven by the `style` prop (for theme colors)
    theme:   '',
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

  // Use `in` so that the 'theme' variant (empty string, falsy) doesn't fall back to default
  const variantClass = variant in variantClasses ? variantClasses[variant] : variantClasses.default;

  const combinedClasses = `
    ${baseClasses}
    ${variantClass}
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