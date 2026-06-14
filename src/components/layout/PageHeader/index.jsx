// src/components/layout/PageHeader/index.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);
  const didAnimate = useRef(false);

  useEffect(() => {
    if (title) {
      document.title = `${title} - Orary`;
    }
    return () => { document.title = 'Orary - Shift Management & Earnings Tracker'; };
  }, [title]);

  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(true);
      didAnimate.current = false;
      return;
    }
    if (action && !didAnimate.current) {
      didAnimate.current = true;
      const timer = setTimeout(() => setIsExpanded(false), 1500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

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
      {/* TEXT CONTAINER — flex-1 min-w-0 keeps it stable when button resizes */}
      <div className="flex items-center space-x-3 flex-1 min-w-0 overflow-hidden">
        {Icon && (
          <div
            className="flex-shrink-0 p-2 rounded-lg transition-colors"
            style={{ backgroundColor: colors.transparent10 }}
          >
            <Icon className="w-6 h-6" style={{ color: colors.primary }} />
          </div>
        )}
        <div className="flex flex-col justify-center min-h-[3.25rem] overflow-hidden">
          <h1 className="text-xl font-semibold leading-tight overflow-hidden">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 leading-snug overflow-hidden">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ACTION BUTTON — fixed-width wrapper so text container never reflows */}
      {rightContent ? rightContent : (action && (
        <div className="flex-shrink-0 flex justify-end" style={{ width: '7.5rem' }}>
          <Button
            onClick={action.onClick}
            icon={action.icon}
            themeColor={action.themeColor || colors.primary}
            collapsed={isCollapsed}
            expandedWidth="7.5rem"
          >
            <span className="hidden sm:inline">{action.label}</span>
            <span className="sm:hidden">{action.mobileLabel || t('common.new')}</span>
          </Button>
        </div>
      ))}
    </motion.div>
  );
};

export default PageHeader;