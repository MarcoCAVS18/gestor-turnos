// src/components/work/WorkRates/index.jsx - Version with defensive validations

import React from 'react';
import ***REMOVED*** Sun, Moon ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const WorkRates = (***REMOVED*** work ***REMOVED***) => ***REMOVED***
  // Defensive validation
  if (!work) ***REMOVED***
    return (
      <div className="text-xs text-gray-500">
        No rate information
      </div>
    );
  ***REMOVED***

  const baseRate = work.baseRate || work.salary || 0;
  const nightRate = work.rates?.night || work.baseRate || work.salary || 0;
  const hasNightRate = nightRate !== baseRate && nightRate > 0;

  return (
    <div className="space-y-1">
      ***REMOVED***/* Base rate */***REMOVED***
      <div className="flex items-center">
        <Sun size=***REMOVED***14***REMOVED*** className="text-yellow-500 mr-1" />
        <span className="text-sm font-medium">***REMOVED***formatCurrency(baseRate)***REMOVED***/hour</span>
        <span className="text-xs text-gray-500 ml-1">(base)</span>
      </div>
      
      ***REMOVED***/* Night rate if different */***REMOVED***
      ***REMOVED***hasNightRate && (
        <div className="flex items-center">
          <Moon size=***REMOVED***14***REMOVED*** className="text-indigo-500 mr-1" />
          <span className="text-sm font-medium">***REMOVED***formatCurrency(nightRate)***REMOVED***/hour</span>
          <span className="text-xs text-gray-500 ml-1">(night)</span>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default WorkRates;