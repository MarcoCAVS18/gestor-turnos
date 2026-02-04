// src/components/stats/DeliverySummary/index.jsx

import React from 'react';
import { TrendingUp, Package } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
// FIXED IMPORTS: Assuming the formatting functions are in statsCalculations.js or pluralization.js
// If you get an error for formatCurrency, try changing the path to '../../../utils/statsCalculations'
import { formatCurrency, formatHours } from '../../../utils/statsCalculations'; 

import Card from '../../ui/Card';

const DeliverySummary = ({ deliveryStats }) => {
  const colors = useThemeColors();

  if (!deliveryStats) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Package size={20} style={{ color: colors.primary }} />
          Delivery Summary
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Total Earnings:</span>
          </span>
          <span className="font-bold text-gray-900">{formatCurrency(deliveryStats.totalEarned)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Total Shifts */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Shifts</p>
          <p className="text-2xl font-bold text-gray-900">{deliveryStats.shiftsCompleted}</p>
        </div>

        {/* Total Hours */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">{formatHours(deliveryStats.totalHours)}</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Orders</span>
          <span className="font-semibold">{deliveryStats.totalOrders}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Tips</span>
          <span className="font-semibold">{formatCurrency(deliveryStats.totalTips)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Net Earnings</span>`
          <span className="font-semibold text-gray-900">{formatCurrency(deliveryStats.netEarnings)}</span>
        </div>
      </div>
    </Card>
  );
};

export default DeliverySummary;