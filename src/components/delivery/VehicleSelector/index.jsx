// src/components/delivery/VehicleSelector/index.jsx

import React from 'react';
import ***REMOVED*** Check, Bike, Car, Truck, User ***REMOVED*** from 'lucide-react';
import ***REMOVED*** DELIVERY_VEHICLES ***REMOVED*** from '../../../constants/delivery';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const VehicleButton = (***REMOVED*** vehicle, isSelected, onClick ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  const getVehicleIcon = (vehicleId) => ***REMOVED***
    const icons = ***REMOVED***
      'bicicleta': Bike,
      'moto': Truck, 
      'auto': Car,
      'a_pie': User
    ***REMOVED***;
    return icons[vehicleId] || Car; 
  ***REMOVED***;
  
  const Icon = getVehicleIcon(vehicle.id); 
  
  return (
    <button
      type="button"
      onClick=***REMOVED***() => onClick(vehicle.nombre)***REMOVED*** 
      className=***REMOVED***`relative p-4 rounded-lg border-2 transition-all duration-200 $***REMOVED***
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
        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
        style=***REMOVED******REMOVED*** backgroundColor: vehicle.color + '20' ***REMOVED******REMOVED*** 
      >
        <Icon size=***REMOVED***24***REMOVED*** style=***REMOVED******REMOVED*** color: vehicle.color ***REMOVED******REMOVED*** />
      </div>
      
      <p className="font-medium text-sm text-center">***REMOVED***vehicle.nombre***REMOVED***</p>
      
      ***REMOVED***isSelected && (
        <div 
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base ***REMOVED******REMOVED***
        >
          <Check size=***REMOVED***14***REMOVED*** className="text-white" />
        </div>
      )***REMOVED***
    </button>
  );
***REMOVED***;

const VehicleSelector = (***REMOVED*** selectedVehicle, onVehicleSelect, title = "Selecciona tu vehículo" ***REMOVED***) => ***REMOVED***
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">***REMOVED***title***REMOVED***</h3>
      <div className="grid grid-cols-2 gap-3">
        ***REMOVED***DELIVERY_VEHICLES.map(vehicle => (
          <VehicleButton
            key=***REMOVED***vehicle.id***REMOVED*** 
            vehicle=***REMOVED***vehicle***REMOVED*** 
            isSelected=***REMOVED***selectedVehicle === vehicle.nombre***REMOVED***
            onClick=***REMOVED***onVehicleSelect***REMOVED***
          />
        ))***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default VehicleSelector;