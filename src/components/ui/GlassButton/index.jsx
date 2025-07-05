// src/components/ui/GlassButton/index.jsx

import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import './index.css';

const GlassButton = ({ 
  children,
  onClick,
  icon: Icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const buttonRef = useRef(null);
    const { thematicColors } = useApp();

 // Efecto para actualizar las variables de color del CSS
  useEffect(() => {
    if (!buttonRef.current || !thematicColors) return;

    const btn = buttonRef.current;

    // Define los colores para cada variante
    let colors = {
      bgStart: 'rgba(255, 255, 255, 0.1)',
      bgEnd: 'rgba(255, 255, 255, 0.1)',
      bgHoverStart: 'rgba(255, 255, 255, 0.15)',
      bgHoverEnd: 'rgba(255, 255, 255, 0.2)',
      borderStart: 'rgba(255, 255, 255, 0.4)',
      borderEnd: 'rgba(255, 255, 255, 0.1)',
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    };

    if (variant === 'primary') {
      colors = {
        bgStart: thematicColors.transparent20,
        bgEnd: thematicColors.transparent10,
        bgHoverStart: thematicColors.transparent30,
        bgHoverEnd: thematicColors.transparent20,
        borderStart: thematicColors.transparent60,
        borderEnd: thematicColors.transparent30,
        shadowColor: `rgba(${thematicColors.rgb}, 0.3)`
      };
    } else if (variant === 'secondary') {
      colors = {
        bgStart: 'rgba(107, 114, 128, 0.2)',
        bgEnd: 'rgba(107, 114, 128, 0.1)',
        bgHoverStart: 'rgba(107, 114, 128, 0.3)',
        bgHoverEnd: 'rgba(107, 114, 128, 0.2)',
        borderStart: 'rgba(255, 255, 255, 0.3)',
        borderEnd: 'rgba(255, 255, 255, 0.1)',
        shadowColor: 'rgba(50, 50, 50, 0.3)'
      };
    }
    // Puedes añadir más variantes ('success', 'danger') aquí

    // Aplica los colores como variables CSS al elemento
    Object.entries(colors).forEach(([key, value]) => {
      btn.style.setProperty(`--btn-${key}`, value);
    });

  }, [variant, thematicColors]);

  const handleMouseMove = (e) => {
    // ... (sin cambios, esta función sigue controlando el efecto 3D)
    if (!buttonRef.current || disabled || loading) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
    buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
    const { width, height } = rect;
    const rotateX = (y / height - 0.5) * -15;
    const rotateY = (x / width - 0.5) * 15;
    buttonRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    buttonRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    // ... (sin cambios)
    if (!buttonRef.current) return;
    buttonRef.current.style.setProperty('--rotate-x', '0deg');
    buttonRef.current.style.setProperty('--rotate-y', '0deg');
  };

  const getSizeClasses = () => {
    // ... (sin cambios)
    const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
    return sizes[size] || sizes.md;
  };
  
  // Ya no necesitamos getVariantClasses, porque el color se maneja con variables
  
  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        glass-button
        ${getSizeClasses()}
        ${disabled ? 'glass-button-disabled' : ''}
        ${loading ? 'glass-button-loading' : ''}
        ${className}
      `}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="glass-button-content">
        {/* ... (contenido del botón sin cambios) ... */}
        {loading && <div className="glass-button-spinner" />}
        {Icon && !loading && <Icon className="glass-button-icon" />}
        <span className="glass-button-text">{children}</span>
        {!Icon && !loading && <ChevronRight className="glass-button-arrow" />}
      </span>
      <div className="glass-button-shine"></div>
    </button>
  );
};

export default GlassButton;