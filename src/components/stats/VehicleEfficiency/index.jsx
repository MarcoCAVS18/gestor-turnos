// src/components/stats/VehicleEfficiency/index.jsx

import React from 'react';
import ***REMOVED*** Car, TrendingUp, Zap ***REMOVED*** from 'lucide-react';
// FIXED IMPORTS: Assuming calculateCostPerKm and calculateVehicleEarningsPerHour are in statsCalculations.js
import ***REMOVED*** calculateCostPerKm ***REMOVED*** from '../../../utils/statsCalculations'; 
import ***REMOVED*** calculateAveragePerHour ***REMOVED*** from '../../../utils/statsCalculations';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/statsCalculations'; // Assuming formatCurrency is here now
import ***REMOVED*** Card ***REMOVED*** from '../../ui/Card';

const VehicleEfficiency = (***REMOVED*** vehicleStats ***REMOVED***) => ***REMOVED***
  if (!vehicleStats) return null;

  // Find most efficient vehicle
  const mostEfficient = Object.values(vehicleStats).sort((a, b) => b.efficiency - a.efficiency)[0];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Vehicle Efficiency</h3>
        <div className="text-sm text-gray-500">Cost per KM</div>
      </div>

      ***REMOVED***/* Efficiency List */***REMOVED***
      <div className="space-y-3">
        ***REMOVED***Object.entries(vehicleStats).map(([vehicleName, stats]) => ***REMOVED***
          const isBest = stats.efficiency === mostEfficient.efficiency;
          
          return (
            <div key=***REMOVED***vehicleName***REMOVED*** className=***REMOVED***`p-3 rounded-lg border $***REMOVED***isBest ? 'border-green-500 bg-green-50' : 'border-gray-200'***REMOVED***`***REMOVED***>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">***REMOVED***vehicleName***REMOVED***</span>
                </div>
                ***REMOVED***isBest && <Zap className="w-4 h-4 text-green-500" />***REMOVED***
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Efficiency</p>
                  <p className="font-semibold">***REMOVED***stats.efficiency.toFixed(2)***REMOVED*** km/$</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Spent</p>
                  <p className="font-semibold">***REMOVED***formatCurrency(stats.totalExpenses)***REMOVED***</p>
                </div>
              </div>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default VehicleEfficiency;