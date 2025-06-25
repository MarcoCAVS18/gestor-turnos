// src/components/delivery/VehicleSelector/index.jsx

import React from 'react';
import ***REMOVED*** Check, Bike, Car, Truck, User ***REMOVED*** from 'lucide-react';
import ***REMOVED*** DELIVERY_VEHICLES ***REMOVED*** from '../../../constants/delivery'; // Asegúrate de que esta ruta sea correcta
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const VehicleButton = (***REMOVED*** vehicle, isSelected, onClick ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  const getVehicleIcon = (vehicleId) => ***REMOVED***
    const icons = ***REMOVED***
      'bicicleta': Bike,
      'moto': Truck, // Si 'moto' debe ser 'Truck' (camión), déjalo así. Si quieres una moto de verdad, busca otro icono o usa 'Bike'
      'auto': Car,
      'a_pie': User
    ***REMOVED***;
    return icons[vehicleId] || Car; // Fallback a 'Car' si no encuentra el ID
  ***REMOVED***;
  
  // vehicle.id ahora existe porque DELIVERY_VEHICLES son objetos
  const Icon = getVehicleIcon(vehicle.id); 
  
  return (
    <button
      type="button"
      onClick=***REMOVED***() => onClick(vehicle.nombre)***REMOVED*** // Sigue pasando el nombre a onVehicleSelect
      className=***REMOVED***`relative p-4 rounded-lg border-2 transition-all duration-200 $***REMOVED***
        isSelected 
          ? 'border-pink-500 bg-pink-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      ***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED***
        borderColor: isSelected ? coloresTemáticos?.base : undefined,
        backgroundColor: isSelected ? coloresTemáticos?.transparent10 : undefined
      ***REMOVED******REMOVED***
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
        style=***REMOVED******REMOVED*** backgroundColor: vehicle.color + '20' ***REMOVED******REMOVED*** // vehicle.color ahora existe
      >
        <Icon size=***REMOVED***24***REMOVED*** style=***REMOVED******REMOVED*** color: vehicle.color ***REMOVED******REMOVED*** />
      </div>
      
      <p className="font-medium text-sm text-center">***REMOVED***vehicle.nombre***REMOVED***</p>
      
      ***REMOVED***isSelected && (
        <div 
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base ***REMOVED******REMOVED***
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
        ***REMOVED***/* Aquí la clave ahora funciona correctamente */***REMOVED***
        ***REMOVED***DELIVERY_VEHICLES.map(vehicle => (
          <VehicleButton
            key=***REMOVED***vehicle.id***REMOVED*** // Ahora vehicle.id es un string único como 'bicicleta', 'moto', etc.
            vehicle=***REMOVED***vehicle***REMOVED*** // Pasamos el objeto completo 'vehicle'
            isSelected=***REMOVED***selectedVehicle === vehicle.nombre***REMOVED*** // Comparamos por el nombre seleccionado
            onClick=***REMOVED***onVehicleSelect***REMOVED***
          />
        ))***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default VehicleSelector;