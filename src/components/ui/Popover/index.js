// src/components/ui/Popover/index.js

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'; // Importamos useLayoutEffect
import ReactDOM from 'react-dom';
import './Popover.css';

const Popover = ({
  children,
  content,
  title,
  footer,
  trigger = 'click',
  position = 'bottom',
  anchorRef,
  fullWidth,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState({});
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  // CAMBIO IMPORTANTE: Usamos useLayoutEffect en lugar de useEffect para evitar el parpadeo visual
  useLayoutEffect(() => {
    const positioningRef = anchorRef || triggerRef;

    if (isOpen && positioningRef.current) {
      const anchorRect = positioningRef.current.getBoundingClientRect();
      const popoverNode = popoverRef.current;
      
      // Si el nodo aún no existe (primer render), no podemos medir
      if (!popoverNode) return;
      
      // 1. Pre-configuración invisible para medir correctamente
      // Usamos visibility: hidden en lugar de opacity para que ocupe espacio pero no se vea
      popoverNode.style.visibility = 'hidden';
      popoverNode.style.display = 'block';
      
      if (fullWidth) {
        popoverNode.style.width = `${anchorRect.width}px`;
      }
      
      const popoverRect = popoverNode.getBoundingClientRect();

      let top, left;
      const offset = 10;

      switch (position) {
        case 'top':
          top = anchorRect.top - popoverRect.height - offset;
          // Centrado con respecto al anchor
          left = anchorRect.left + (anchorRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'bottom':
          top = anchorRect.bottom + offset;
          left = anchorRect.left + (anchorRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'bottom-start':
            top = anchorRect.bottom + offset;
            left = anchorRect.left;
            break;
        case 'left':
          top = anchorRect.top + (anchorRect.height / 2) - (popoverRect.height / 2);
          left = anchorRect.left - popoverRect.width - offset;
          break;
        case 'right':
          top = anchorRect.top + (anchorRect.height / 2) - (popoverRect.height / 2);
          left = anchorRect.right + offset;
          break;
        default:
          top = anchorRect.bottom + offset;
          left = anchorRect.left;
      }
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (left < 0) {
        left = 10;
      } else if (left + popoverRect.width > screenWidth) {
        left = screenWidth - popoverRect.width - 10;
      }

      if (top < 0) {
        top = 10;
      } else if (top + popoverRect.height > screenHeight) {
        top = screenHeight - popoverRect.height - 10;
      }

      // Aplicamos estilos finales y hacemos visible
      setPopoverStyle({
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
        width: fullWidth ? `${anchorRect.width}px` : 'auto',
        visibility: 'visible', // Lo hacemos visible explícitamente aquí
        opacity: 1
      });
      
      // Restauramos display normal en el nodo por si acaso, aunque el style lo controla
      popoverNode.style.display = '';
      popoverNode.style.visibility = ''; 
    }
  }, [isOpen, position, anchorRef, fullWidth]);

  // Click outside handler (se mantiene igual, usando useEffect normal)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', () => setIsOpen(false));
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setIsOpen(false));
    };
  }, [isOpen]);

  const popoverContent = isOpen && (
    <div 
        ref={popoverRef} 
        className={`popover-content popover-${position} ${className}`} 
        style={{...popoverStyle}} // Aplicamos los estilos calculados
    >
      <div className="popover-arrow" />
      {title && <div className="popover-title">{title}</div>}
      <div className="popover-body">
        {content}
      </div>
      {footer && <div className="popover-footer">{footer}</div>}
    </div>
  );

  return (
    <>
      <div ref={triggerRef} onClick={handleToggle} style={{ cursor: 'pointer', display: 'inline-flex' }}>
        {children}
      </div>
      {popoverContent ? ReactDOM.createPortal(popoverContent, document.body) : null}
    </>
  );
};

export default Popover;