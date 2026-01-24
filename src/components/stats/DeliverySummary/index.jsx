// src/components/stats/DeliverySummary/index.jsx

import React from 'react';
import ***REMOVED*** TrendingUp ***REMOVED*** from 'lucide-react';
// FIXED IMPORTS: Assuming the formatting functions are in statsCalculations.js or pluralization.js
// If you get an error for formatCurrency, try changing the path to '../../../utils/statsCalculations'
import ***REMOVED*** formatCurrency, formatHours ***REMOVED*** from '../../../utils/statsCalculations'; 
import ***REMOVED*** formatShiftsCount ***REMOVED*** from '../../../utils/pluralization';

import ***REMOVED*** Card ***REMOVED*** from '../../ui/Card';

const DeliverySummary = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  if (!deliveryStats) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Delivery Summary</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Total Earnings:</span>
          </span>
          <span className="font-bold text-gray-900">***REMOVED***formatCurrency(deliveryStats.totalEarned)***REMOVED***</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        ***REMOVED***/* Total Shifts */***REMOVED***
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Shifts</p>
          <p className="text-2xl font-bold text-gray-900">***REMOVED***deliveryStats.totalShifts***REMOVED***</p>
        </div>

        ***REMOVED***/* Total Hours */***REMOVED***
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">***REMOVED***formatHours(deliveryStats.totalHours)***REMOVED***</p>
        </div>
      </div>

      ***REMOVED***/* Detailed Stats */***REMOVED***
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Orders</span>
          <span className="font-semibold">***REMOVED***deliveryStats.totalOrders***REMOVED***</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Tips</span>
          <span className="font-semibold">***REMOVED***formatCurrency(deliveryStats.totalTips)***REMOVED***</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Net Earnings</span>`
          <span className="font-semibold text-gray-900">***REMOVED***formatCurrency(deliveryStats.netEarnings)***REMOVED***</span>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default DeliverySummary;