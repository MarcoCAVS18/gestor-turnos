// src/components/delivery/PlatformSelector/index.jsx

import React from 'react';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../constants/delivery';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const PlatformSelector = (***REMOVED*** selectedPlatform, onPlatformSelect ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Platform</h3>
      <select
        value=***REMOVED***selectedPlatform || ''***REMOVED***
        onChange=***REMOVED***(e) => onPlatformSelect(e.target.value)***REMOVED***
        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:border-transparent bg-white"
        style=***REMOVED******REMOVED***
          '--tw-ring-color': colors.primary
        ***REMOVED******REMOVED***
      >
        <option value="">Select a platform</option>
        ***REMOVED***DELIVERY_PLATFORMS_AUSTRALIA.map(platform => (
          <option key=***REMOVED***platform.id***REMOVED*** value=***REMOVED***platform.name***REMOVED***>
            ***REMOVED***platform.name***REMOVED***
          </option>
        ))***REMOVED***
      </select>
      
      ***REMOVED***/* Visual indicator of the selected platform */***REMOVED***
      ***REMOVED***selectedPlatform && (
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Flex variant="center"
            className="w-6 h-6 rounded-full mr-3"
            style=***REMOVED******REMOVED*** 
              backgroundColor: DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name === selectedPlatform)?.color || '#6B7280' 
            ***REMOVED******REMOVED***
          >
            <span className="text-white font-bold text-xs">
              ***REMOVED***selectedPlatform.charAt(0)***REMOVED***
            </span>
          </Flex>
          <span className="text-sm text-gray-700 font-medium">
            ***REMOVED***selectedPlatform***REMOVED***
          </span>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default PlatformSelector;