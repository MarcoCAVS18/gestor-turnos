// src/components/delivery/PlatformSelector/index.jsx

import React from 'react';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../../../constants/delivery';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const PlatformSelector = ({ selectedPlatform, onPlatformSelect }) => {
  const colors = useThemeColors();
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Platform</h3>
      <select
        value={selectedPlatform || ''}
        onChange={(e) => onPlatformSelect(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:border-transparent bg-white"
        style={{
          '--tw-ring-color': colors.primary
        }}
      >
        <option value="">Select a platform</option>
        {DELIVERY_PLATFORMS_AUSTRALIA.map(platform => (
          <option key={platform.id} value={platform.name}>
            {platform.name}
          </option>
        ))}
      </select>
      
      {/* Visual indicator of the selected platform */}
      {selectedPlatform && (
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Flex variant="center"
            className="w-6 h-6 rounded-full mr-3"
            style={{ 
              backgroundColor: DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name === selectedPlatform)?.color || '#6B7280' 
            }}
          >
            <span className="text-white font-bold text-xs">
              {selectedPlatform.charAt(0)}
            </span>
          </Flex>
          <span className="text-sm text-gray-700 font-medium">
            {selectedPlatform}
          </span>
        </div>
      )}
    </div>
  );
};

export default PlatformSelector;