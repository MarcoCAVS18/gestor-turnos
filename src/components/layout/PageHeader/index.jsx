// src/components/layout/PageHeader/index.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import Button from '../../ui/Button';

const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  rightContent,
  className = '',
  ...props
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  // Iniciamos expanded en true por defecto
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Si estamos en mobile y hay una acción, activamos el timer
    if (isMobile && action) {
      // Reiniciamos a expandido por si cambiamos de vista y volvemos
      setIsExpanded(true);
      
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 2000); // 2 segundos es un tiempo de lectura estándar

      return () => clearTimeout(timer);
    } else {
      // En desktop siempre expandido
      setIsExpanded(true);
    }
  }, [isMobile, action]); // Dependencias limpias

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Variantes para el contenedor del botón
  const buttonWrapperVariants = {
    expanded: { 
      width: "auto",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    collapsed: { 
      width: "44px", // Ancho fijo del botón circular (ajustar según tu UI)
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const isCollapsed = isMobile && !isExpanded;

  return (
    <motion.div
      className={`flex justify-between items-center gap-4 ${className}`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {/* TEXT CONTAINER:
         - flex-1: Toma todo el espacio disponible.
         - min-w-0: CRUCIAL. Permite que el flex item se encoja más allá de su contenido 
           (necesario para que truncate funcione).
      */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {Icon && (
          <div 
            className="flex-shrink-0 p-2 rounded-lg transition-colors" 
            style={{ backgroundColor: colors.transparent10 }}
          >
            <Icon className="w-6 h-6" style={{ color: colors.primary }} />
          </div>
        )}
        <div className="min-w-0 flex flex-col justify-center min-h-[3.25rem]">
          <h1 className="text-xl font-semibold truncate pr-2 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 pr-2 leading-snug whitespace-normal line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {rightContent ? rightContent : (action && (
        <motion.div
          layout // Ayuda a Framer Motion a manejar el layout externo
          initial="expanded"
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          variants={buttonWrapperVariants}
          className="flex-shrink-0 overflow-hidden relative flex justify-end"
        >
          <Button
            onClick={action.onClick}
            icon={action.icon}
            themeColor={action.themeColor || colors.primary}
            className={`flex items-center justify-center shadow-sm hover:shadow-md h-[44px] whitespace-nowrap`}
            // Animamos los estilos inline para mayor suavidad
            style={{ 
              borderRadius: isCollapsed ? '50%' : '12px', 
              // En Framer Motion es mejor no animar padding con clases, sino con style si es dinámico
              paddingLeft: isCollapsed ? '0' : '1rem',
              paddingRight: isCollapsed ? '0' : '1rem',
              width: isCollapsed ? '44px' : 'auto', // Asegura que el botón llene el wrapper o se ajuste
              transition: 'all 1s ease-in-out' // Transición CSS para propiedades no manejadas por motion wrapper
            }}
          >
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4 }}
                  className="ml-2 overflow-hidden block"
                >
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.mobileLabel || 'Nuevo'}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PageHeader;