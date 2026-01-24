// src/components/delivery/VehicleSelector/index.jsx

import React from 'react';
import ***REMOVED*** Check, Bike, Car, User ***REMOVED*** from 'lucide-react';
import MotorbikeIcon from '../../icons/MotorbikeIcon';
import ***REMOVED*** DELIVERY_VEHICLES ***REMOVED*** from '../../../constants/delivery';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const VehicleButton = (***REMOVED*** vehicle, isSelected, onClick, colors ***REMOVED***) => ***REMOVED***
  const getVehicleIcon = (vehicleId) => ***REMOVED***
    const icons = ***REMOVED***
      'bicycle': Bike,
      'motorbike': MotorbikeIcon, 
      'car': Car,
      'on_foot': User
    ***REMOVED***;
    return icons[vehicleId] || Car; 
  ***REMOVED***;
  
  const Icon = getVehicleIcon(vehicle.id); 
  
  return (
    <button
      type="button"
      onClick=***REMOVED***() => onClick(vehicle.name)***REMOVED*** 
      className=***REMOVED***`relative p-3 rounded-lg border-2 transition-all duration-200 w-full h-16 flex flex-col items-center justify-center $***REMOVED***
        isSelected 
          ? 'border-pink-500 bg-pink-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
      ***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED***
        borderColor: isSelected ? colors.primary : undefined,
        backgroundColor: isSelected ? colors.transparent10 : undefined
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Horizontal layout for compactness */***REMOVED***
      <div className="flex items-center space-x-2">
        ***REMOVED***/* Smaller icon container */***REMOVED***
        <Flex variant="center" 
          className="w-6 h-6 rounded flex-shrink-0"
          style=***REMOVED******REMOVED*** backgroundColor: vehicle.color + '20' ***REMOVED******REMOVED*** 
        >
          <Icon size=***REMOVED***14***REMOVED*** style=***REMOVED******REMOVED*** color: vehicle.color ***REMOVED******REMOVED*** />
        </Flex>
        
        ***REMOVED***/* Vehicle name */***REMOVED***
        <p className="font-medium text-xs text-center leading-tight text-gray-800 truncate">
          ***REMOVED***vehicle.name***REMOVED***
        </p>
      </div>
      
      ***REMOVED***/* Smaller selection check */***REMOVED***
      ***REMOVED***isSelected && (
        <Flex variant="center"
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full shadow-sm"
          style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
        >
          <Check size=***REMOVED***10***REMOVED*** className="text-white" />
        </Flex>
      )***REMOVED***
    </button>
  );
***REMOVED***;

const VehicleSelector = (***REMOVED*** 
  selectedVehicle, 
  onVehicleSelect, 
  title = "Select your vehicle",
  className = "" 
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  return (
    <div className=***REMOVED***`space-y-3 $***REMOVED***className***REMOVED***`***REMOVED***>
      <h3 className="text-sm font-medium text-gray-700">***REMOVED***title***REMOVED***</h3>
      
      ***REMOVED***/* Grid 2x2 - two columns on all sizes */***REMOVED***
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        ***REMOVED***DELIVERY_VEHICLES.map(vehicle => (
          <VehicleButton
            key=***REMOVED***vehicle.id***REMOVED*** 
            vehicle=***REMOVED***vehicle***REMOVED*** 
            isSelected=***REMOVED***selectedVehicle === vehicle.name***REMOVED***
            onClick=***REMOVED***onVehicleSelect***REMOVED***
            colors=***REMOVED***colors***REMOVED***
          />
        ))***REMOVED***
      </div>
      
      ***REMOVED***/* Optional help text */***REMOVED***
      <p className="text-xs text-gray-500 text-center mt-2">
        Select the vehicle you will use for your deliveries
      </p>
    </div>
  );
***REMOVED***;

export default VehicleSelector;
