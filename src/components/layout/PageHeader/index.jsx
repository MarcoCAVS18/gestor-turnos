// src/components/layout/PageHeader/index.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [isExpanded, setIsExpanded] = useState(true);

  // Dynamic page title for SEO
  useEffect(() => {
    if (title) {
      document.title = `${title} - Orary`;
    }
    return () => { document.title = 'Orary - Shift Management & Earnings Tracker'; };
  }, [title]);

  useEffect(() => {
    // On mount (after loader), if mobile and has action:
    if (isMobile && action) {
      setIsExpanded(true); // Ensure it starts expanded

      const timer = setTimeout(() => {
        setIsExpanded(false); // Collapse after 2 seconds
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsExpanded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Variants for the full Header entry
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const isCollapsed = isMobile && !isExpanded;

  return (
    <motion.div
      className={`flex items-center space-x-4 ${className}`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {/* TEXT CONTAINER (Intact) */}
      <div className="flex items-center space-x-3 flex-grow">
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
      
      {/* ACTION BUTTON */}
      {rightContent ? rightContent : (action && (
        // Remove parent wrapper animations to avoid conflicts.
        // The Button handles its own size.
        <div className="flex-shrink-0 flex justify-end">
          <Button
            onClick={action.onClick}
            icon={action.icon}
            themeColor={action.themeColor || colors.primary}
            collapsed={isCollapsed} // Pass state to button
          >
            <span className="hidden sm:inline">{action.label}</span>
            <span className="sm:hidden">{action.mobileLabel || 'New'}</span>
          </Button>
        </div>
      ))}
    </motion.div>
  );
};

export default PageHeader;