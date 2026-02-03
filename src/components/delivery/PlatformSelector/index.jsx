// src/components/delivery/PlatformSelector/index.jsx

import { useThemeColors } from '../../../hooks/useThemeColors';
import { useApp } from '../../../contexts/AppContext';
import Flex from '../../ui/Flex';

const PlatformSelector = ({ selectedPlatform, onPlatformSelect }) => {
  const colors = useThemeColors();
  const { deliveryPlatforms, defaultDeliveryPlatform } = useApp();

  // Get the default platform name for placeholder
  const defaultPlatform = deliveryPlatforms.find(p => p.id === defaultDeliveryPlatform);

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
        <option value="">
          {defaultPlatform ? `Select (default: ${defaultPlatform.name})` : 'Select a platform'}
        </option>
        {deliveryPlatforms.map(platform => (
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
              backgroundColor: deliveryPlatforms.find(p => p.name === selectedPlatform)?.color || '#6B7280'
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