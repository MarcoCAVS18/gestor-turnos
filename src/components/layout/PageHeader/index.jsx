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
      width: "120px", 
      transition: { type: "spring", stiffness: 100, damping: 10 } // Adjusted spring values
    },
    collapsed: { 
      width: "44px", 
      transition: { type: "spring", stiffness: 100, damping: 10 } // Adjusted spring values
    }
  };

  const isCollapsed = isMobile && !isExpanded;

  return (
    <motion.div
      className={`flex items-center space-x-4 ${className}`} // Removed justify-between and gap, added space-x
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {/* TEXT CONTAINER */}
      <div className="flex items-center space-x-3 flex-grow"> {/* Changed flex-1 to flex-grow */}
        {Icon && (
          <div 
            className="flex-shrink-0 p-2 rounded-lg transition-colors" 
            style={{ backgroundColor: colors.transparent10 }}
          >
            <Icon className="w-6 h-6" style={{ color: colors.primary }} />
          </div>
        )}
        <div className="flex flex-col justify-center min-h-[3.25rem]">
          <h1 className="text-xl font-semibold leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {rightContent ? rightContent : (action && (
        <motion.div
          // Removed layout prop
          initial="expanded"
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          variants={buttonWrapperVariants}
          className="flex-shrink-0 overflow-hidden relative flex justify-end"
          style={{ minWidth: '120px' }} // Reserve max space for the button
        >
          <Button
            onClick={action.onClick}
            icon={action.icon}
            themeColor={action.themeColor || colors.primary}
            className={`flex items-center justify-center shadow-sm hover:shadow-md h-[44px] whitespace-nowrap`}
            style={{ 
              borderRadius: isCollapsed ? '50%' : '12px', 
              paddingLeft: isCollapsed ? '0' : '1rem',
              paddingRight: isCollapsed ? '0' : '1rem',
              width: isCollapsed ? '44px' : 'auto', // Re-added width
            }}
          >
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
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