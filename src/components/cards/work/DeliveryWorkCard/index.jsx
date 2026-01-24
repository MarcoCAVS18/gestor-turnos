// src/components/cards/DeliveryWorkCard/index.jsx

import React from 'react';
import { Calendar, Bike, Car, User } from 'lucide-react';
import MotorbikeIcon from '../../../icons/MotorbikeIcon';
import BaseWorkCard from '../../base/BaseWorkCard';
import { useApp } from '../../../../contexts/AppContext';
import Flex from '../../../ui/Flex';

const DeliveryWorkCard = (props) => {
  const { work } = props;
  const { deliveryShifts } = useApp();

  // Count shifts for this work
  const shiftsCount = deliveryShifts?.filter(shift => shift.workId === work.id)?.length || 0;

  // Get vehicle icon
  const getVehicleIcon = (vehicle) => {
    switch (vehicle) {
      case 'Bicycle': return <Bike size={14} className="text-green-500" />;
      case 'Motorbike': return <MotorbikeIcon size={14} className="text-orange-500" />;
      case 'Car': return <Car size={14} className="text-blue-500" />;
      case 'On foot': return <User size={14} className="text-gray-500" />;
      default: return <Calendar size={14} className="text-gray-400" />;
    }
  };

  const workColor = work?.color || work?.avatarColor || '#10b981';

  return (
    <BaseWorkCard {...props} type="delivery">
      <div className="space-y-3">
        {/* Shifts counter */}
        <Flex variant="between" className="text-sm">
          <Flex variant="center">
            <Calendar size={14} style={{ color: workColor }} className="mr-2" />
            <span className="text-gray-600">Shifts:</span>
          </Flex>
          <span className="font-semibold text-lg" style={{ color: workColor }}>
            {shiftsCount}
          </span>
        </Flex>

        {/* Vehicle info */}
        {work?.vehicle && (
          <Flex variant="between" className="text-xs pt-2 border-t border-gray-100">
            <Flex variant="center">
              {getVehicleIcon(work.vehicle)}
              <span className="text-gray-600 ml-2">Vehicle:</span>
            </Flex>
            <span className="font-medium">{work.vehicle}</span>
          </Flex>
        )}
      </div>
    </BaseWorkCard>
  );
};

export default DeliveryWorkCard;