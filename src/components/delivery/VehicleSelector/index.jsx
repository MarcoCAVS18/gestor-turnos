// src/components/delivery/VehicleSelector/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Bike, Car, User } from 'lucide-react';
import MotorbikeIcon from '../../icons/MotorbikeIcon';
import { DELIVERY_VEHICLES } from '../../../constants/delivery';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const VehicleButton = ({ vehicle, isSelected, onClick, colors, t }) => {
  const getVehicleIcon = (vehicleId) => {
    const icons = {
      'bicycle': Bike,
      'motorbike': MotorbikeIcon, 
      'car': Car,
      'on_foot': User
    };
    return icons[vehicleId] || Car; 
  };
  
  const Icon = getVehicleIcon(vehicle.id); 
  
  return (
    <button
      type="button"
      onClick={() => onClick(vehicle.id)} 
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
      {/* Horizontal layout for compactness */}
      <div className="flex items-center space-x-2">
        {/* Smaller icon container */}
        <Flex variant="center" 
          className="w-6 h-6 rounded flex-shrink-0"
          style={{ backgroundColor: vehicle.color + '20' }} 
        >
          <Icon size={14} style={{ color: vehicle.color }} />
        </Flex>
        
        {/* Vehicle name */}
        <p className="font-medium text-xs text-center leading-tight text-gray-800 truncate">
          {t(`forms.work.delivery.vehicles.${vehicle.id}`)}
        </p>
      </div>
      
      {/* Smaller selection check */}
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
  title,
  className = "" 
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">{title || t('forms.work.delivery.selectVehicle')}</h3>
      
      {/* Grid 2x2 - two columns on all sizes */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {DELIVERY_VEHICLES.map(vehicle => (
          <VehicleButton
            key={vehicle.id} 
            vehicle={vehicle} 
            isSelected={selectedVehicle === vehicle.id || selectedVehicle === vehicle.name}
            onClick={onVehicleSelect}
            colors={colors}
            t={t}
          />
        ))}
      </div>
      
      {/* Help text — only shown when no vehicle is selected yet */}
      {!selectedVehicle && (
        <p className="text-xs text-gray-500 text-center mt-2">
          {t('deliveryVehicle.helpText')}
        </p>
      )}
    </div>
  );
};

export default VehicleSelector;
