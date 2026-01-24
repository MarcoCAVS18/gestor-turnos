// src/components/cards/DeliveryWorkCard/index.jsx

import React from 'react';
import ***REMOVED*** Package, Bike, Car, User ***REMOVED*** from 'lucide-react';
import MotorbikeIcon from '../../../icons/MotorbikeIcon';
import BaseWorkCard from '../../base/BaseWorkCard';
import Flex from '../../../ui/Flex';

const DeliveryWorkCard = (props) => ***REMOVED***
  const ***REMOVED*** work ***REMOVED*** = props;

  // Get vehicle icon
  const getVehicleIcon = (vehicle) => ***REMOVED***
    switch (vehicle) ***REMOVED***
      case 'Bicycle': return <Bike size=***REMOVED***16***REMOVED*** className="text-green-500" />;
      case 'Motorbike': return <MotorbikeIcon size=***REMOVED***16***REMOVED*** className="text-orange-500" />;
      case 'Car': return <Car size=***REMOVED***16***REMOVED*** className="text-blue-500" />;
      case 'On foot': return <User size=***REMOVED***16***REMOVED*** className="text-gray-500" />;
      default: return <Package size=***REMOVED***16***REMOVED*** className="text-gray-400" />;
    ***REMOVED***
  ***REMOVED***;

  return (
    <BaseWorkCard ***REMOVED***...props***REMOVED*** type="delivery">
      ***REMOVED***/* Delivery job information */***REMOVED***
      <div className="space-y-2">
        ***REMOVED***/* Platform */***REMOVED***
        ***REMOVED***work?.platform && (
          <Flex variant="between">
            <Flex variant="center">
              <Package size=***REMOVED***14***REMOVED*** className="text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Platform:</span>
            </Flex>
            <span className="text-sm font-medium">***REMOVED***work.platform***REMOVED***</span>
          </Flex>
        )***REMOVED***

        ***REMOVED***/* Vehicle */***REMOVED***
        ***REMOVED***work?.vehicle && (
          <Flex variant="between">
            <Flex variant="center">
              ***REMOVED***getVehicleIcon(work.vehicle)***REMOVED***
              <span className="text-sm text-gray-600 ml-2">Vehicle:</span>
            </Flex>
            <span className="text-sm font-medium">***REMOVED***work.vehicle***REMOVED***</span>
          </Flex>
        )***REMOVED***

        ***REMOVED***/* Information about variable earnings */***REMOVED***
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Flex variant="center" className="text-xs text-gray-500 italic">
            <Package size=***REMOVED***14***REMOVED*** className="text-gray-400 mr-2" />
            <span>Variable earnings per order</span>
          </Flex>
        </div>
      </div>
    </BaseWorkCard>
  );
***REMOVED***;

export default DeliveryWorkCard;