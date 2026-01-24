// src/components/shared/WorkPreviewCard/index.jsx

import React from 'react';
import ***REMOVED*** Briefcase, Truck, Bike, Car, User, Package ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Flex from '../../ui/Flex';

const WorkPreviewCard = (***REMOVED*** work ***REMOVED***) => ***REMOVED***
  if (!work) return null;

  const isDelivery = work.type === 'delivery';

  // Get vehicle icon for delivery
  const getVehicleIcon = (vehicle) => ***REMOVED***
    switch (vehicle) ***REMOVED***
      case 'Bicycle': return <Bike size=***REMOVED***16***REMOVED*** className="text-green-500" />;
      case 'Motorcycle': return <Truck size=***REMOVED***16***REMOVED*** className="text-orange-500" />;
      case 'Car': return <Car size=***REMOVED***16***REMOVED*** className="text-blue-500" />;
      case 'On foot': return <User size=***REMOVED***16***REMOVED*** className="text-gray-500" />;
      default: return <Package size=***REMOVED***16***REMOVED*** className="text-gray-400" />;
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card>
      <Flex variant="start-between" className="mb-4">
        <div className="flex items-center">
          <Flex variant="center"
            className="w-12 h-12 rounded-lg mr-4"
            style=***REMOVED******REMOVED*** backgroundColor: work.color ***REMOVED******REMOVED***
          >
            ***REMOVED***isDelivery ? (
              <Truck className="h-6 w-6 text-white" />
            ) : (
              <Briefcase className="h-6 w-6 text-white" />
            )***REMOVED***
          </Flex>
          <div>
            <Flex className="gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">***REMOVED***work.name***REMOVED***</h2>
              ***REMOVED***isDelivery && (
                <Badge variant="success" size="xs" rounded>
                  Delivery
                </Badge>
              )***REMOVED***
            </Flex>
            ***REMOVED***work.description && (
              <p className="text-gray-600 text-sm">***REMOVED***work.description***REMOVED***</p>
            )***REMOVED***
          </div>
        </div>
      </Flex>
      
      ***REMOVED***isDelivery ? (
        // Specific information for delivery works
        <div className="space-y-3">
          ***REMOVED***work.platform && (
            <Flex>
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="font-semibold">***REMOVED***work.platform***REMOVED***</p>
              </div>
            </Flex>
          )***REMOVED***          
          ***REMOVED***work.vehicle && (
            <Flex>
              ***REMOVED***getVehicleIcon(work.vehicle)***REMOVED***
              <div className="ml-2">
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">***REMOVED***work.vehicle***REMOVED***</p>
              </div>
            </Flex>
          )***REMOVED***          
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
          ***REMOVED***work.baseRate && (
            <Flex>
              <Briefcase className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Base rate</p>
                <p className="font-semibold">***REMOVED***formatCurrency(work.baseRate)***REMOVED***/hour</p>
              </div>
            </Flex>
          )***REMOVED***          
          ***REMOVED***work.rates && (
            <div className="space-y-3 mt-3">
              <p className="text-sm font-medium text-gray-700">Special rates:</p>
              <div className="grid grid-cols-2 gap-2">
                ***REMOVED***work.rates.day && (
                  <div className="text-center p-2 bg-yellow-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Day</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(work.rates.day)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***work.rates.afternoon && (
                  <div className="text-center p-2 bg-orange-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Afternoon</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(work.rates.afternoon)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***work.rates.night && (
                  <div className="text-center p-2 bg-blue-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Night</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(work.rates.night)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***work.rates.saturday && (
                  <div className="text-center p-2 bg-purple-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Saturday</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(work.rates.saturday)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***work.rates.sunday && (
                  <div className="text-center p-2 bg-red-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Sunday</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(work.rates.sunday)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
              </div>
            </div>
          )***REMOVED***
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default WorkPreviewCard;