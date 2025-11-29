// src/components/layout/PageHeader/index.jsx

import React from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
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

  const headerVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.3 ***REMOVED*** ***REMOVED***
  ***REMOVED***;

  return (
    <motion.div
      className=***REMOVED***`flex justify-between items-center $***REMOVED***className***REMOVED***`***REMOVED***
      variants=***REMOVED***headerVariants***REMOVED***
      initial="hidden"
      animate="visible"
      ***REMOVED***...props***REMOVED***
    >
      <div className="flex items-center space-x-3">
        ***REMOVED***Icon && (
          <div
            className="p-2 rounded-lg"
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
          >
            <Icon
              className="w-6 h-6"
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            />
          </div>
        )***REMOVED***
        <div>
          <h1 className="text-xl font-semibold">***REMOVED***title***REMOVED***</h1>
          ***REMOVED***subtitle && (
            <p className="text-sm text-gray-600">***REMOVED***subtitle***REMOVED***</p>
          )***REMOVED***
        </div>
      </div>
      
      ***REMOVED***rightContent ? rightContent : (action && (
        <Button
          onClick=***REMOVED***action.onClick***REMOVED***
          className="flex items-center space-x-2 shadow-sm hover:shadow-md"
          icon=***REMOVED***action.icon***REMOVED***
          themeColor=***REMOVED***action.themeColor || colors.primary***REMOVED***
        >
          <span className="hidden sm:inline">***REMOVED***action.label***REMOVED***</span>
          <span className="sm:hidden">***REMOVED***action.mobileLabel || 'Nuevo'***REMOVED***</span>
        </Button>
      ))***REMOVED***
    </motion.div>
  );
***REMOVED***;

export default PageHeader;