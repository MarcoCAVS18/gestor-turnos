// src/components/cards/StatCard/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const StatCard = (***REMOVED*** 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendLabel,
  size = 'md',
  className = '',
  onClick 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      sm: 'p-3',
      md: 'p-4', 
      lg: 'p-6'
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;
  
  const getValueSize = () => ***REMOVED***
    const sizes = ***REMOVED***
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl'
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;
  
  const isClickable = !!onClick;
  
  return (
    <Card 
      className=***REMOVED***`transition-all $***REMOVED***isClickable ? 'cursor-pointer hover:shadow-lg' : ''***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***
      padding="none"
      onClick=***REMOVED***onClick***REMOVED***
    >
      <div className=***REMOVED***getSizeClasses()***REMOVED***>
        ***REMOVED***/* Header con título e ícono */***REMOVED***
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">***REMOVED***title***REMOVED***</span>
          ***REMOVED***Icon && (
            <Icon 
              size=***REMOVED***size === 'sm' ? 16 : size === 'lg' ? 24 : 20***REMOVED*** 
              style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** 
            />
          )***REMOVED***
        </div>
        
        ***REMOVED***/* Valor principal */***REMOVED***
        <p 
          className=***REMOVED***`$***REMOVED***getValueSize()***REMOVED*** font-bold mb-1`***REMOVED***
          style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
        >
          ***REMOVED***value***REMOVED***
        </p>
        
        ***REMOVED***/* Subtítulo y tendencia */***REMOVED***
        <div className="flex items-center justify-between">
          ***REMOVED***subtitle && (
            <span className="text-xs text-gray-500">***REMOVED***subtitle***REMOVED***</span>
          )***REMOVED***
          
          ***REMOVED***trend !== undefined && (
            <div className=***REMOVED***`flex items-center text-xs $***REMOVED***
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            ***REMOVED***`***REMOVED***>
              ***REMOVED***trend > 0 && '↗'***REMOVED***
              ***REMOVED***trend < 0 && '↘'***REMOVED***
              ***REMOVED***trend === 0 && '→'***REMOVED***
              <span className="ml-1">
                ***REMOVED***trend > 0 && '+'***REMOVED***
                ***REMOVED***trend !== 0 ? `$***REMOVED***trend.toFixed(1)***REMOVED***%` : 'Sin cambios'***REMOVED***
                ***REMOVED***trendLabel && ` $***REMOVED***trendLabel***REMOVED***`***REMOVED***
              </span>
            </div>
          )***REMOVED***
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default StatCard;