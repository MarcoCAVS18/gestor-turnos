// src/components/ui/GlassButton/index.jsx

import React, ***REMOVED*** useRef, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import './index.css';

const GlassButton = (***REMOVED*** 
  children,
  onClick,
  icon: Icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
***REMOVED***) => ***REMOVED***
  const buttonRef = useRef(null);
    const ***REMOVED*** thematicColors ***REMOVED*** = useApp();

 // Efecto para actualizar las variables de color del CSS
  useEffect(() => ***REMOVED***
    if (!buttonRef.current || !thematicColors) return;

    const btn = buttonRef.current;

    // Define los colores para cada variante
    let colors = ***REMOVED***
      bgStart: 'rgba(255, 255, 255, 0.1)',
      bgEnd: 'rgba(255, 255, 255, 0.1)',
      bgHoverStart: 'rgba(255, 255, 255, 0.15)',
      bgHoverEnd: 'rgba(255, 255, 255, 0.2)',
      borderStart: 'rgba(255, 255, 255, 0.4)',
      borderEnd: 'rgba(255, 255, 255, 0.1)',
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    ***REMOVED***;

    if (variant === 'primary') ***REMOVED***
      colors = ***REMOVED***
        bgStart: thematicColors.transparent20,
        bgEnd: thematicColors.transparent10,
        bgHoverStart: thematicColors.transparent30,
        bgHoverEnd: thematicColors.transparent20,
        borderStart: thematicColors.transparent60,
        borderEnd: thematicColors.transparent30,
        shadowColor: `rgba($***REMOVED***thematicColors.rgb***REMOVED***, 0.3)`
      ***REMOVED***;
    ***REMOVED*** else if (variant === 'secondary') ***REMOVED***
      colors = ***REMOVED***
        bgStart: 'rgba(107, 114, 128, 0.2)',
        bgEnd: 'rgba(107, 114, 128, 0.1)',
        bgHoverStart: 'rgba(107, 114, 128, 0.3)',
        bgHoverEnd: 'rgba(107, 114, 128, 0.2)',
        borderStart: 'rgba(255, 255, 255, 0.3)',
        borderEnd: 'rgba(255, 255, 255, 0.1)',
        shadowColor: 'rgba(50, 50, 50, 0.3)'
      ***REMOVED***;
    ***REMOVED***
    // Puedes añadir más variantes ('success', 'danger') aquí

    // Aplica los colores como variables CSS al elemento
    Object.entries(colors).forEach(([key, value]) => ***REMOVED***
      btn.style.setProperty(`--btn-$***REMOVED***key***REMOVED***`, value);
    ***REMOVED***);

  ***REMOVED***, [variant, thematicColors]);

  const handleMouseMove = (e) => ***REMOVED***
    // ... (sin cambios, esta función sigue controlando el efecto 3D)
    if (!buttonRef.current || disabled || loading) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttonRef.current.style.setProperty('--mouse-x', `$***REMOVED***x***REMOVED***px`);
    buttonRef.current.style.setProperty('--mouse-y', `$***REMOVED***y***REMOVED***px`);
    const ***REMOVED*** width, height ***REMOVED*** = rect;
    const rotateX = (y / height - 0.5) * -15;
    const rotateY = (x / width - 0.5) * 15;
    buttonRef.current.style.setProperty('--rotate-x', `$***REMOVED***rotateX***REMOVED***deg`);
    buttonRef.current.style.setProperty('--rotate-y', `$***REMOVED***rotateY***REMOVED***deg`);
  ***REMOVED***;

  const handleMouseLeave = () => ***REMOVED***
    // ... (sin cambios)
    if (!buttonRef.current) return;
    buttonRef.current.style.setProperty('--rotate-x', '0deg');
    buttonRef.current.style.setProperty('--rotate-y', '0deg');
  ***REMOVED***;

  const getSizeClasses = () => ***REMOVED***
    // ... (sin cambios)
    const sizes = ***REMOVED*** sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;
  
  // Ya no necesitamos getVariantClasses, porque el color se maneja con variables
  
  return (
    <button
      ref=***REMOVED***buttonRef***REMOVED***
      onMouseMove=***REMOVED***handleMouseMove***REMOVED***
      onMouseLeave=***REMOVED***handleMouseLeave***REMOVED***
      className=***REMOVED***`
        glass-button
        $***REMOVED***getSizeClasses()***REMOVED***
        $***REMOVED***disabled ? 'glass-button-disabled' : ''***REMOVED***
        $***REMOVED***loading ? 'glass-button-loading' : ''***REMOVED***
        $***REMOVED***className***REMOVED***
      `***REMOVED***
      onClick=***REMOVED***disabled || loading ? undefined : onClick***REMOVED***
      disabled=***REMOVED***disabled || loading***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <span className="glass-button-content">
        ***REMOVED***/* ... (contenido del botón sin cambios) ... */***REMOVED***
        ***REMOVED***loading && <div className="glass-button-spinner" />***REMOVED***
        ***REMOVED***Icon && !loading && <Icon className="glass-button-icon" />***REMOVED***
        <span className="glass-button-text">***REMOVED***children***REMOVED***</span>
        ***REMOVED***!Icon && !loading && <ChevronRight className="glass-button-arrow" />***REMOVED***
      </span>
      <div className="glass-button-shine"></div>
    </button>
  );
***REMOVED***;

export default GlassButton;