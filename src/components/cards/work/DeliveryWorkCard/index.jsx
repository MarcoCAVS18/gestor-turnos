// src/components/cards/DeliveryWorkCard/index.jsx

import React from 'react';
import { Package, Bike, Car, User } from 'lucide-react';
import MotorbikeIcon from '../../../icons/MotorbikeIcon';
import BaseWorkCard from '../../base/BaseWorkCard';
import Flex from '../../../ui/Flex';

const DeliveryWorkCard = (props) => {
  const { work } = props;

  // Get vehicle icon
  const getVehicleIcon = (vehicle) => {
    switch (vehicle) {
      case 'Bicycle': return <Bike size={16} className="text-green-500" />;
      case 'Motorbike': return <MotorbikeIcon size={16} className="text-orange-500" />;
      case 'Car': return <Car size={16} className="text-blue-500" />;
      case 'On foot': return <User size={16} className="text-gray-500" />;
      default: return <Package size={16} className="text-gray-400" />;
    }
  };

  return (
    <BaseWorkCard {...props} type="delivery">
      {/* Delivery job information */}
      <div className="space-y-2">
        {/* Platform */}
        {work?.platform && (
          <Flex variant="between">
            <Flex variant="center">
              <Package size={14} className="text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Platform:</span>
            </Flex>
            <span className="text-sm font-medium">{work.platform}</span>
          </Flex>
        )}

        {/* Vehicle */}
        {work?.vehicle && (
          <Flex variant="between">
            <Flex variant="center">
              {getVehicleIcon(work.vehicle)}
              <span className="text-sm text-gray-600 ml-2">Vehicle:</span>
            </Flex>
            <span className="text-sm font-medium">{work.vehicle}</span>
          </Flex>
        )}

        {/* Information about variable earnings */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Flex variant="center" className="text-xs text-gray-500 italic">
            <Package size={14} className="text-gray-400 mr-2" />
            <span>Variable earnings per order</span>
          </Flex>
        </div>
      </div>
    </BaseWorkCard>
  );
};

export default DeliveryWorkCard;