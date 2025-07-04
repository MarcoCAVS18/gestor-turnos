// src/components/delivery/PlatformSelector/index.jsx

import React from 'react';
import { Check } from 'lucide-react';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../../../constants/delivery';
import { useApp } from '../../../contexts/AppContext';

const PlatformButton = ({ platform, isSelected, onClick }) => {
  const { thematicColors } = useApp();
  
  return (
    <button
      type="button"
      onClick={() => onClick(platform.nombre)}
      className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
        isSelected 
          ? 'border-pink-500 bg-pink-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      style={{
        borderColor: isSelected ? thematicColors?.base : undefined,
        backgroundColor: isSelected ? thematicColors?.transparent10 : undefined
      }}
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
        style={{ backgroundColor: platform.color }}
      >
        <span className="text-white font-bold text-sm">
          {platform.nombre.charAt(0)}
        </span>
      </div>
      
      <p className="font-medium text-xs text-center">{platform.nombre}</p>
      
      {isSelected && (
        <div 
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: thematicColors?.base }}
        >
          <Check size={12} className="text-white" />
        </div>
      )}
    </button>
  );
};

const PlatformSelector = ({ selectedPlatform, onPlatformSelect }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Plataforma</h3>
      <div className="grid grid-cols-4 gap-2">
        {DELIVERY_PLATFORMS_AUSTRALIA.map(platform => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isSelected={selectedPlatform === platform.nombre}
            onClick={onPlatformSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;