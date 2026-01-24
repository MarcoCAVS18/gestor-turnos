// src/components/stats/FuelEfficiency/index.jsx

import React from 'react';
import ***REMOVED*** Fuel, AlertTriangle ***REMOVED*** from 'lucide-react';

import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const FuelEfficiency = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***


  // Default values to avoid errors
  const totalExpenses = deliveryStats?.totalExpenses || 0;
  const totalKilometers = deliveryStats?.totalKilometers || 0;
  const totalEarnings = deliveryStats?.totalEarned || 0;
  
  const efficiency = totalExpenses > 0 ? totalKilometers / totalExpenses : 0;
  const expensesPercentage = totalEarnings > 0 ? (totalExpenses / totalEarnings) * 100 : 0;

  // CHANGE: We remove the return null so it always renders
  
  return (
    <Card className="bg-red-50/50 border border-red-100">
      <Flex variant="between" className="mb-2">
        <h3 className="text-sm font-semibold flex items-center text-gray-700">
          <Fuel size=***REMOVED***16***REMOVED*** className="mr-2 text-red-500" />
          Fuel Control
        </h3>
        ***REMOVED***expensesPercentage > 25 && (
           <div className="flex items-center text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
             <AlertTriangle size=***REMOVED***10***REMOVED*** className="mr-1" />
             High consumption
           </div>
        )***REMOVED***
      </Flex>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Total Expense</span>
          <span className="text-lg font-bold text-red-600">***REMOVED***formatCurrency(totalExpenses)***REMOVED***</span>
        </div>
        
        <div className="flex flex-col text-right border-l border-red-100 pl-4">
          <span className="text-xs text-gray-500">Performance</span>
          <span className="text-lg font-bold text-gray-800">
            ***REMOVED***totalExpenses > 0 ? efficiency.toFixed(1) : '-'***REMOVED*** <span className="text-xs font-normal text-gray-500">km/$</span>
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-red-100/50">
        <p className="text-xs text-center text-gray-500">
          Represents <span className="font-semibold text-gray-700">***REMOVED***expensesPercentage.toFixed(1)***REMOVED***%</span> of your earnings
        </p>
      </div>
    </Card>
  );
***REMOVED***;

export default FuelEfficiency;