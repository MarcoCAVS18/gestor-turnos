// src/components/layout/PageHeader/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
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
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => ***REMOVED***
    // On mount (after loader), if mobile and has action:
    if (isMobile && action) ***REMOVED***
      setIsExpanded(true); // Ensure it starts expanded
      
      const timer = setTimeout(() => ***REMOVED***
        setIsExpanded(false); // Collapse after 2 seconds
      ***REMOVED***, 2000);

      return () => clearTimeout(timer);
    ***REMOVED*** else ***REMOVED***
      setIsExpanded(true);
    ***REMOVED***
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ***REMOVED***, []); 

  // Variants for the full Header entry
  const headerVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.3 ***REMOVED*** ***REMOVED***
  ***REMOVED***;

  const isCollapsed = isMobile && !isExpanded;

  return (
    <motion.div
      className=***REMOVED***`flex items-center space-x-4 $***REMOVED***className***REMOVED***`***REMOVED***
      variants=***REMOVED***headerVariants***REMOVED***
      initial="hidden"
      animate="visible"
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***/* TEXT CONTAINER (Intact) */***REMOVED***
      <div className="flex items-center space-x-3 flex-grow">
        ***REMOVED***Icon && (
          <div 
            className="flex-shrink-0 p-2 rounded-lg transition-colors" 
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
          >
            <Icon className="w-6 h-6" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
          </div>
        )***REMOVED***
        <div className="flex flex-col justify-center min-h-[3.25rem]">
          <h1 className="text-xl font-semibold leading-tight">
            ***REMOVED***title***REMOVED***
          </h1>
          ***REMOVED***subtitle && (
            <p className="text-sm text-gray-600 leading-snug">
              ***REMOVED***subtitle***REMOVED***
            </p>
          )***REMOVED***
        </div>
      </div>
      
      ***REMOVED***/* ACTION BUTTON */***REMOVED***
      ***REMOVED***rightContent ? rightContent : (action && (
        // Remove parent wrapper animations to avoid conflicts.
        // The Button handles its own size.
        <div className="flex-shrink-0 flex justify-end">
          <Button
            onClick=***REMOVED***action.onClick***REMOVED***
            icon=***REMOVED***action.icon***REMOVED***
            themeColor=***REMOVED***action.themeColor || colors.primary***REMOVED***
            collapsed=***REMOVED***isCollapsed***REMOVED*** // Pass state to button
          >
            <span className="hidden sm:inline">***REMOVED***action.label***REMOVED***</span>
            <span className="sm:hidden">***REMOVED***action.mobileLabel || 'New'***REMOVED***</span>
          </Button>
        </div>
      ))***REMOVED***
    </motion.div>
  );
***REMOVED***;

export default PageHeader;