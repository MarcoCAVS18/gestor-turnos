// src/components/cards/DeliveryWorkCard/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Bike, Car, User } from 'lucide-react';
import MotorbikeIcon from '../../../icons/MotorbikeIcon';
import BaseWorkCard from '../../base/BaseWorkCard';
import { useApp } from '../../../../contexts/AppContext';
import Flex from '../../../ui/Flex';

const DeliveryWorkCard = (props) => {
  const { work } = props;
  const { t } = useTranslation();
  const { deliveryShifts } = useApp();

  // Count shifts for this work
  const shiftsCount = deliveryShifts?.filter(shift => shift.workId === work.id)?.length || 0;

  // Get vehicle icon
  const getVehicleIcon = (vehicleId) => {
    switch (vehicleId) {
      case 'bicycle': return <Bike size={14} className="text-green-500" />;
      case 'motorbike': return <MotorbikeIcon size={14} className="text-orange-500" />;
      case 'car': return <Car size={14} className="text-blue-500" />;
      case 'on_foot': return <User size={14} className="text-gray-500" />;
      default: return <Calendar size={14} className="text-gray-400" />;
    }
  };

  // Map vehicle name to ID for translation
  const getVehicleId = (vehicleName) => {
    const vehicleMap = {
      'Bicycle': 'bicycle',
      'Bicicleta': 'bicycle',
      'Vélo': 'bicycle',
      'Motorbike': 'motorbike',
      'Moto': 'motorbike',
      'Car': 'car',
      'Auto': 'car',
      'Voiture': 'car',
      'On foot': 'on_foot',
      'A pie': 'on_foot',
      'À pied': 'on_foot'
    };
    return vehicleMap[vehicleName] || vehicleName?.toLowerCase()?.replace(' ', '_') || '';
  };

  const workColor = work?.color || work?.avatarColor || '#10b981';

  return (
    <BaseWorkCard {...props} type="delivery">
      <div className="space-y-3">
        {/* Shifts counter */}
        <Flex variant="between" className="text-sm">
          <Flex variant="center">
            <Calendar size={14} style={{ color: workColor }} className="mr-2" />
            <span className="text-gray-600">{t('cards.deliveryWork.shifts')}:</span>
          </Flex>
          <span className="font-semibold text-lg" style={{ color: workColor }}>
            {shiftsCount}
          </span>
        </Flex>

        {/* Vehicle info */}
        {work?.vehicle && (
          <Flex variant="between" className="text-xs pt-2 border-t border-gray-100">
            <Flex variant="center">
              {getVehicleIcon(getVehicleId(work.vehicle))}
              <span className="text-gray-600 ml-2">{t('cards.deliveryWork.vehicle')}:</span>
            </Flex>
            <span className="font-medium">{t(`forms.work.delivery.vehicles.${getVehicleId(work.vehicle)}`)}</span>
          </Flex>
        )}
      </div>
    </BaseWorkCard>
  );
};

export default DeliveryWorkCard;