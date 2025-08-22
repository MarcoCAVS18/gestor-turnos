// src/components/delivery/PlatformSelector/index.jsx - REFACTORIZADO

import React from 'react';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../../../constants/delivery';
import { useThemeColors } from '../../../hooks/useThemeColors';

const PlatformSelector = ({ selectedPlatform, onPlatformSelect }) => {
  const colors = useThemeColors();
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Plataforma</h3>
      <select
        value={selectedPlatform || ''}
        onChange={(e) => onPlatformSelect(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:border-transparent bg-white"
        style={{
          '--tw-ring-color': colors.primary
        }}
      >
        <option value="">Selecciona una plataforma</option>
        {DELIVERY_PLATFORMS_AUSTRALIA.map(platform => (
          <option key={platform.id} value={platform.nombre}>
            {platform.nombre}
          </option>
        ))}
      </select>
      
      {/* Indicador visual de la plataforma seleccionada */}
      {selectedPlatform && (
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
            style={{ 
              backgroundColor: DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.nombre === selectedPlatform)?.color || '#6B7280' 
            }}
          >
            <span className="text-white font-bold text-xs">
              {selectedPlatform.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-700 font-medium">
            {selectedPlatform}
          </span>
        </div>
      )}
    </div>
  );
};

export default PlatformSelector;