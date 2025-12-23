// src/components/delivery/VehicleSelector/index.jsx

import React from 'react';
import { Check, Bike, Car, User } from 'lucide-react';
import MotorbikeIcon from '../../icons/MotorbikeIcon';
import { DELIVERY_VEHICLES } from '../../../constants/delivery';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const VehicleButton = ({ vehicle, isSelected, onClick, colors }) => {
  const getVehicleIcon = (vehicleId) => {
    const icons = {
      'bicicleta': Bike,
      'moto': MotorbikeIcon, 
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
      className={`relative p-3 rounded-lg border-2 transition-all duration-200 w-full h-16 flex flex-col items-center justify-center ${
        isSelected 
          ? 'border-pink-500 bg-pink-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
      }`}
      style={{
        borderColor: isSelected ? colors.primary : undefined,
        backgroundColor: isSelected ? colors.transparent10 : undefined
      }}
    >
      {/* Layout horizontal para compactar */}
      <div className="flex items-center space-x-2">
        {/* Contenedor del ícono más pequeño */}
        <Flex variant="center" 
          className="w-6 h-6 rounded flex-shrink-0"
          style={{ backgroundColor: vehicle.color + '20' }} 
        >
          <Icon size={14} style={{ color: vehicle.color }} />
        </Flex>
        
        {/* Nombre del vehículo */}
        <p className="font-medium text-xs text-center leading-tight text-gray-800 truncate">
          {vehicle.nombre}
        </p>
      </div>
      
      {/* Check de selección más pequeño */}
      {isSelected && (
        <Flex variant="center"
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full shadow-sm"
          style={{ backgroundColor: colors.primary }}
        >
          <Check size={10} className="text-white" />
        </Flex>
      )}
    </button>
  );
};

const VehicleSelector = ({ 
  selectedVehicle, 
  onVehicleSelect, 
  title = "Selecciona tu vehículo",
  className = "" 
}) => {
  const colors = useThemeColors();
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      
      {/* Grid 2x2 - dos columnas en todos los tamaños */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {DELIVERY_VEHICLES.map(vehicle => (
          <VehicleButton
            key={vehicle.id} 
            vehicle={vehicle} 
            isSelected={selectedVehicle === vehicle.nombre}
            onClick={onVehicleSelect}
            colors={colors}
          />
        ))}
      </div>
      
      {/* Texto de ayuda opcional */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Selecciona el vehículo que usarás para tus entregas
      </p>
    </div>
  );
};

export default VehicleSelector;
