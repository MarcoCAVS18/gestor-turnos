// src/components/work/WorkRates/index.jsx

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';

const WorkRates = ({ work }) => {
  // Defensive validation
  if (!work) {
    return (
      <div className="text-xs text-gray-500">
        No rate information
      </div>
    );
  }

  const baseRate = work.baseRate || work.salary || 0;
  const nightRate = work.rates?.night || work.baseRate || work.salary || 0;
  const hasNightRate = nightRate !== baseRate && nightRate > 0;

  return (
    <div className="space-y-1">
      {/* Base rate */}
      <div className="flex items-center">
        <Sun size={14} className="text-yellow-500 mr-1" />
        <span className="text-sm font-medium">{formatCurrency(baseRate)}/hour</span>
        <span className="text-xs text-gray-500 ml-1">(base)</span>
      </div>
      
      {/* Night rate if different */}
      {hasNightRate && (
        <div className="flex items-center">
          <Moon size={14} className="text-indigo-500 mr-1" />
          <span className="text-sm font-medium">{formatCurrency(nightRate)}/hour</span>
          <span className="text-xs text-gray-500 ml-1">(night)</span>
        </div>
      )}
    </div>
  );
};

export default WorkRates;