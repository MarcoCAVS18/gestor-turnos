// src/components/ui/Badge/index.jsx

import React from 'react';

/**
 * Componente Badge reutilizable para mostrar etiquetas con diferentes variantes
 *
 * @param {string} variant - Variante de color: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @param {string} size - Tamaño: 'xs' | 'sm' | 'md' | 'lg'
 * @param {boolean} rounded - Si debe ser completamente redondeado (pill shape)
 * @param {React.ReactNode} children - Contenido del badge
 * @param {React.ReactNode} icon - Ícono opcional a mostrar
 * @param {string} className - Clases CSS adicionales
 * @param {object} style - Estilos inline adicionales
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
  // Clases base
  const baseClasses = 'inline-flex items-center font-medium';

  // Variantes de color
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-orange-50 text-orange-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-cyan-50 text-cyan-700',
    purple: 'bg-purple-50 text-purple-700',
    pink: 'bg-pink-50 text-pink-700'
  };

  // Tamaños
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  // Tamaños de iconos
  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  };

  // Clases de redondeo
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
