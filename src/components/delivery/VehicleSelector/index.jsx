// src/components/delivery/VehicleSelector/index.jsx

import React from 'react';
import { Check, Bike, Car, Truck, User } from 'lucide-react';
import { DELIVERY_VEHICLES } from '../../../constants/delivery';
import { useApp } from '../../../contexts/AppContext';

const VehicleButton = ({ vehicle, isSelected, onClick }) => {
  const { coloresTemáticos } = useApp();
  
  const getVehicleIcon = (vehicleId) => {
    const icons = {
      'bicicleta': Bike,
      'moto': Truck, 
      'auto': Car,
      'a_pie': User
    };
    return icons[vehicleId] || Car; 
  };
  
  const Icon = getVehicleIcon(vehicle.id); 
  
  return (
    <button
      type="button"
      onClick={() => onClick(vehicle.nombre)} 
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
        isSelected 
          ? 'border-pink-500 bg-pink-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      style={{
        borderColor: isSelected ? coloresTemáticos?.base : undefined,
        backgroundColor: isSelected ? coloresTemáticos?.transparent10 : undefined
      }}
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
        style={{ backgroundColor: vehicle.color + '20' }} 
      >
        <Icon size={24} style={{ color: vehicle.color }} />
      </div>
      
      <p className="font-medium text-sm text-center">{vehicle.nombre}</p>
      
      {isSelected && (
        <div 
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: coloresTemáticos?.base }}
        >
          <Check size={14} className="text-white" />
        </div>
      )}
    </button>
  );
};

const VehicleSelector = ({ selectedVehicle, onVehicleSelect, title = "Selecciona tu vehículo" }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {DELIVERY_VEHICLES.map(vehicle => (
          <VehicleButton
            key={vehicle.id} 
            vehicle={vehicle} 
            isSelected={selectedVehicle === vehicle.nombre}
            onClick={onVehicleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default VehicleSelector;