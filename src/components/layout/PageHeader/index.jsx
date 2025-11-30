// src/components/layout/PageHeader/index.jsx
import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** motion, AnimatePresence ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';
import Button from '../../ui/Button';

const PageHeader = (***REMOVED***
  icon: Icon,
  title,
  subtitle,
  action,
  rightContent,
  className = '',
  ...props
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  // Iniciamos expanded en true por defecto
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => ***REMOVED***
    // Si estamos en mobile y hay una acción, activamos el timer
    if (isMobile && action) ***REMOVED***
      // Reiniciamos a expandido por si cambiamos de vista y volvemos
      setIsExpanded(true);
      
      const timer = setTimeout(() => ***REMOVED***
        setIsExpanded(false);
      ***REMOVED***, 2000); // 2 segundos es un tiempo de lectura estándar

      return () => clearTimeout(timer);
    ***REMOVED*** else ***REMOVED***
      // En desktop siempre expandido
      setIsExpanded(true);
    ***REMOVED***
  ***REMOVED***, [isMobile, action]); // Dependencias limpias

  const headerVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.3 ***REMOVED*** ***REMOVED***
  ***REMOVED***;

  // Variantes para el contenedor del botón
  const buttonWrapperVariants = ***REMOVED***
    expanded: ***REMOVED*** 
      width: "auto",
      transition: ***REMOVED*** type: "spring", stiffness: 300, damping: 30 ***REMOVED***
    ***REMOVED***,
    collapsed: ***REMOVED*** 
      width: "44px", // Ancho fijo del botón circular (ajustar según tu UI)
      transition: ***REMOVED*** type: "spring", stiffness: 300, damping: 30 ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

  const isCollapsed = isMobile && !isExpanded;

  return (
    <motion.div
      className=***REMOVED***`flex justify-between items-center gap-4 $***REMOVED***className***REMOVED***`***REMOVED***
      variants=***REMOVED***headerVariants***REMOVED***
      initial="hidden"
      animate="visible"
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***/* TEXT CONTAINER:
         - flex-1: Toma todo el espacio disponible.
         - min-w-0: CRUCIAL. Permite que el flex item se encoja más allá de su contenido 
           (necesario para que truncate funcione).
      */***REMOVED***
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        ***REMOVED***Icon && (
          <div 
            className="flex-shrink-0 p-2 rounded-lg transition-colors" 
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
          >
            <Icon className="w-6 h-6" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
          </div>
        )***REMOVED***
        <div className="min-w-0 flex flex-col justify-center min-h-[3.25rem]">
          <h1 className="text-xl font-semibold truncate pr-2 leading-tight">
            ***REMOVED***title***REMOVED***
          </h1>
          ***REMOVED***subtitle && (
            <p className="text-sm text-gray-600 pr-2 leading-snug whitespace-normal line-clamp-2">
              ***REMOVED***subtitle***REMOVED***
            </p>
          )***REMOVED***
        </div>
      </div>
      
      ***REMOVED***rightContent ? rightContent : (action && (
        <motion.div
          layout // Ayuda a Framer Motion a manejar el layout externo
          initial="expanded"
          animate=***REMOVED***isCollapsed ? 'collapsed' : 'expanded'***REMOVED***
          variants=***REMOVED***buttonWrapperVariants***REMOVED***
          className="flex-shrink-0 overflow-hidden relative flex justify-end"
        >
          <Button
            onClick=***REMOVED***action.onClick***REMOVED***
            icon=***REMOVED***action.icon***REMOVED***
            themeColor=***REMOVED***action.themeColor || colors.primary***REMOVED***
            className=***REMOVED***`flex items-center justify-center shadow-sm hover:shadow-md h-[44px] whitespace-nowrap`***REMOVED***
            // Animamos los estilos inline para mayor suavidad
            style=***REMOVED******REMOVED*** 
              borderRadius: isCollapsed ? '50%' : '12px', 
              // En Framer Motion es mejor no animar padding con clases, sino con style si es dinámico
              paddingLeft: isCollapsed ? '0' : '1rem',
              paddingRight: isCollapsed ? '0' : '1rem',
              width: isCollapsed ? '44px' : 'auto', // Asegura que el botón llene el wrapper o se ajuste
              transition: 'all 1s ease-in-out' // Transición CSS para propiedades no manejadas por motion wrapper
            ***REMOVED******REMOVED***
          >
            <AnimatePresence mode="wait">
              ***REMOVED***!isCollapsed && (
                <motion.span
                  key="label"
                  initial=***REMOVED******REMOVED*** opacity: 0, width: 0 ***REMOVED******REMOVED***
                  animate=***REMOVED******REMOVED*** opacity: 1, width: "auto" ***REMOVED******REMOVED***
                  exit=***REMOVED******REMOVED*** opacity: 0, width: 0 ***REMOVED******REMOVED***
                  transition=***REMOVED******REMOVED*** duration: 0.4 ***REMOVED******REMOVED***
                  className="ml-2 overflow-hidden block"
                >
                  <span className="hidden sm:inline">***REMOVED***action.label***REMOVED***</span>
                  <span className="sm:hidden">***REMOVED***action.mobileLabel || 'Nuevo'***REMOVED***</span>
                </motion.span>
              )***REMOVED***
            </AnimatePresence>
          </Button>
        </motion.div>
      ))***REMOVED***
    </motion.div>
  );
***REMOVED***;

export default PageHeader;