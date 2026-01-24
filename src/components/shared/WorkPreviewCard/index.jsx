// src/components/shared/WorkPreviewCard/index.jsx

import React from 'react';
import { Briefcase, Truck, Bike, Car, User, Package } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Flex from '../../ui/Flex';

const WorkPreviewCard = ({ work }) => {
  if (!work) return null;

  const isDelivery = work.type === 'delivery';

  // Get vehicle icon for delivery
  const getVehicleIcon = (vehicle) => {
    switch (vehicle) {
      case 'Bicycle': return <Bike size={16} className="text-green-500" />;
      case 'Motorcycle': return <Truck size={16} className="text-orange-500" />;
      case 'Car': return <Car size={16} className="text-blue-500" />;
      case 'On foot': return <User size={16} className="text-gray-500" />;
      default: return <Package size={16} className="text-gray-400" />;
    }
  };

  return (
    <Card>
      <Flex variant="start-between" className="mb-4">
        <div className="flex items-center">
          <Flex variant="center"
            className="w-12 h-12 rounded-lg mr-4"
            style={{ backgroundColor: work.color }}
          >
            {isDelivery ? (
              <Truck className="h-6 w-6 text-white" />
            ) : (
              <Briefcase className="h-6 w-6 text-white" />
            )}
          </Flex>
          <div>
            <Flex className="gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{work.name}</h2>
              {isDelivery && (
                <Badge variant="success" size="xs" rounded>
                  Delivery
                </Badge>
              )}
            </Flex>
            {work.description && (
              <p className="text-gray-600 text-sm">{work.description}</p>
            )}
          </div>
        </div>
      </Flex>
      
      {isDelivery ? (
        // Specific information for delivery works
        <div className="space-y-3">
          {work.platform && (
            <Flex>
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="font-semibold">{work.platform}</p>
              </div>
            </Flex>
          )}          
          {work.vehicle && (
            <Flex>
              {getVehicleIcon(work.vehicle)}
              <div className="ml-2">
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">{work.vehicle}</p>
              </div>
            </Flex>
          )}          
          <Flex>
            <Package className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Job type</p>
              <p className="font-semibold">Variable earnings per delivery</p>
            </div>
          </Flex>
        </div>
      ) : (
        // Information for traditional works
        <div className="space-y-3">
          {work.baseRate && (
            <Flex>
              <Briefcase className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Base rate</p>
                <p className="font-semibold">{formatCurrency(work.baseRate)}/hour</p>
              </div>
            </Flex>
          )}          
          {work.rates && (
            <div className="space-y-3 mt-3">
              <p className="text-sm font-medium text-gray-700">Special rates:</p>
              <div className="grid grid-cols-2 gap-2">
                {work.rates.day && (
                  <div className="text-center p-2 bg-yellow-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Day</p>
                    <p className="font-semibold text-sm">{formatCurrency(work.rates.day)}/h</p>
                  </div>
                )}
                
                {work.rates.afternoon && (
                  <div className="text-center p-2 bg-orange-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Afternoon</p>
                    <p className="font-semibold text-sm">{formatCurrency(work.rates.afternoon)}/h</p>
                  </div>
                )}
                
                {work.rates.night && (
                  <div className="text-center p-2 bg-blue-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Night</p>
                    <p className="font-semibold text-sm">{formatCurrency(work.rates.night)}/h</p>
                  </div>
                )}
                
                {work.rates.saturday && (
                  <div className="text-center p-2 bg-purple-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Saturday</p>
                    <p className="font-semibold text-sm">{formatCurrency(work.rates.saturday)}/h</p>
                  </div>
                )}
                
                {work.rates.sunday && (
                  <div className="text-center p-2 bg-red-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Sunday</p>
                    <p className="font-semibold text-sm">{formatCurrency(work.rates.sunday)}/h</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default WorkPreviewCard;