// src/components/layout/PageHeader/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className={`flex justify-between items-center ${className}`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      <div className="flex items-center space-x-3">
        {Icon && (
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: colors.transparent10 }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: colors.primary }}
            />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
      
      {rightContent ? rightContent : (action && (
        <Button
          onClick={action.onClick}
          className="flex items-center space-x-2 shadow-sm hover:shadow-md"
          icon={action.icon}
          themeColor={action.themeColor || colors.primary}
        >
          <span className="hidden sm:inline">{action.label}</span>
          <span className="sm:hidden">{action.mobileLabel || 'Nuevo'}</span>
        </Button>
      ))}
    </motion.div>
  );
};

export default PageHeader;