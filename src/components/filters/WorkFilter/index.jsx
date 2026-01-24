// src/components/filters/WorkFilter/index.jsx

import React from 'react';
import { Briefcase, Truck } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';

const WorkFilter = ({ value, onChange }) => {
  const { works, deliveryWork } = useApp();
  const colors = useThemeColors();
  
  // Combine all works
  const allWorks = [
    ...works.map(t => ({ ...t, type: t.type || 'traditional' })),
    ...deliveryWork.map(t => ({ ...t, type: 'delivery' }))
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by work
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {value !== 'all' ? (
            (() => {
              const selectedWork = allWorks.find(t => t.id === value);
              return selectedWork?.type === 'delivery' ? (
                <Truck size={16} className="text-green-600" />
              ) : (
                <Briefcase size={16} style={{ color: colors.primary }} />
              );
            })()
          ) : (
            <Briefcase size={16} className="text-gray-400" />
          )}
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full py-2 pr-8 border border-gray-300 rounded-lg 
            bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent 
            transition-colors
            pl-10 /* THIS REPLACES THE JSX STYLE */
          `}
          style={{ '--tw-ring-color': colors.primary }}
        >
          <option value="all">All works</option>
          {allWorks.map(work => (
            <option key={work.id} value={work.id}>
              {work.name}
              {work.type === 'delivery' ? ' (Delivery)' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WorkFilter;