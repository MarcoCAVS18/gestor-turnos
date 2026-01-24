// src/components/cards/StatCard/index.jsx

import React from 'react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendLabel,
  size = 'md',
  className = '',
  onClick 
}) => {
  const colors = useThemeColors();
  
  const getSizeClasses = () => {
    const sizes = {
      sm: 'p-3',
      md: 'p-4', 
      lg: 'p-6'
    };
    return sizes[size] || sizes.md;
  };
  
  const getValueSize = () => {
    const sizes = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl'
    };
    return sizes[size] || sizes.md;
  };
  
  const isClickable = !!onClick;
  
  return (
    <Card 
      className={`transition-all ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''} ${className}`}
      padding="none"
      onClick={onClick}
    >
      <div className={getSizeClasses()}>
        
        {/* Header with title and icon */}
        <Flex variant="between" className="mb-2">
          <span className="text-sm text-gray-600">{title}</span>
          {Icon && (
            <Icon 
              size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
              style={{ color: colors.primary }} 
            />
          )}
        </Flex>
        
        {/* Main value */}
        <p 
          className={`${getValueSize()} font-bold mb-1`}
          style={{ color: colors.primary }}
        >
          {value}
        </p>
        
        {/* Subtitle and trend */}
        <Flex variant="between">
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
          
          {trend !== undefined && (
            <div className={`flex items-center text-xs ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend > 0 && '↗'}
              {trend < 0 && '↘'}
              {trend === 0 && '→'}
              <span className="ml-1">
                {trend > 0 && '+'}
                {trend !== 0 ? `${trend.toFixed(1)}%` : 'No change'}
                {trendLabel && ` ${trendLabel}`}
              </span>
            </div>
          )}
        </Flex>
      </div>
    </Card>
  );
};

export default StatCard;