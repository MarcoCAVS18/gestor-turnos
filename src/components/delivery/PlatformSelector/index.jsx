// src/components/delivery/PlatformSelector/index.jsx

import React from 'react';
import ***REMOVED*** Check ***REMOVED*** from 'lucide-react';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../constants/delivery';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const PlatformButton = (***REMOVED*** platform, isSelected, onClick ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  return (
    <button
      type="button"
      onClick=***REMOVED***() => onClick(platform.nombre)***REMOVED***
      className=***REMOVED***`relative p-3 rounded-lg border-2 transition-all duration-200 $***REMOVED***
        isSelected 
          ? 'border-pink-500 bg-pink-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      ***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED***
        borderColor: isSelected ? thematicColors?.base : undefined,
        backgroundColor: isSelected ? thematicColors?.transparent10 : undefined
      ***REMOVED******REMOVED***
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
        style=***REMOVED******REMOVED*** backgroundColor: platform.color ***REMOVED******REMOVED***
      >
        <span className="text-white font-bold text-sm">
          ***REMOVED***platform.nombre.charAt(0)***REMOVED***
        </span>
      </div>
      
      <p className="font-medium text-xs text-center">***REMOVED***platform.nombre***REMOVED***</p>
      
      ***REMOVED***isSelected && (
        <div 
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base ***REMOVED******REMOVED***
        >
          <Check size=***REMOVED***12***REMOVED*** className="text-white" />
        </div>
      )***REMOVED***
    </button>
  );
***REMOVED***;

const PlatformSelector = (***REMOVED*** selectedPlatform, onPlatformSelect ***REMOVED***) => ***REMOVED***
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Plataforma</h3>
      <div className="grid grid-cols-4 gap-2">
        ***REMOVED***DELIVERY_PLATFORMS_AUSTRALIA.map(platform => (
          <PlatformButton
            key=***REMOVED***platform.id***REMOVED***
            platform=***REMOVED***platform***REMOVED***
            isSelected=***REMOVED***selectedPlatform === platform.nombre***REMOVED***
            onClick=***REMOVED***onPlatformSelect***REMOVED***
          />
        ))***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default PlatformSelector;