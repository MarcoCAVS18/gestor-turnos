// src/components/stats/VehicleEfficiency/index.jsx

import React from 'react';
import { Car, Zap, Gauge } from 'lucide-react';
import { formatCurrency } from '../../../utils/statsCalculations';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';

const VehicleEfficiency = ({ vehicleStats }) => {
  const colors = useThemeColors();

  if (!vehicleStats) return null;

  // Find most efficient vehicle
  const mostEfficient = Object.values(vehicleStats).sort((a, b) => b.efficiency - a.efficiency)[0];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Gauge size={20} style={{ color: colors.primary }} />
          Vehicle Efficiency
        </h3>
        <div className="text-sm text-gray-500">Cost per KM</div>
      </div>

      {/* Efficiency List */}
      <div className="space-y-3">
        {Object.entries(vehicleStats).map(([vehicleName, stats]) => {
          const isBest = stats.efficiency === mostEfficient.efficiency;
          
          return (
            <div key={vehicleName} className={`p-3 rounded-lg border ${isBest ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{vehicleName}</span>
                </div>
                {isBest && <Zap className="w-4 h-4 text-green-500" />}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Efficiency</p>
                  <p className="font-semibold">{stats.efficiency.toFixed(2)} km/$</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Spent</p>
                  <p className="font-semibold">{formatCurrency(stats.totalExpenses)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default VehicleEfficiency;