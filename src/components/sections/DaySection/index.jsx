// src/components/sections/DaySection/index.jsx

import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import ShiftCard from '../../cards/shift/ShiftCard';
import DeliveryShiftCard from '../../cards/shift/DeliveryShiftCard';
import { createSafeDate } from '../../../utils/time';

const DaySection = forwardRef(({ date, shifts, works, onEditShift, onDeleteShift }, ref) => {
  const { thematicColors } = useApp();

  const dateObj = createSafeDate(date);
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div ref={ref} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200" style={{ backgroundColor: thematicColors?.transparent5 }}>
        <div className="flex items-center gap-2">
          <Calendar size={20} style={{ color: thematicColors?.base }} />
          <h3 className="font-semibold text-gray-900 capitalize">
            {dayOfWeek}, {formattedDate}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {shifts.map(shift => {
          const work = works.find(w => w.id === shift.workId);
          
          if (shift.type === 'delivery') {
            return (
              <DeliveryShiftCard
                key={shift.id}
                shift={shift}
                work={work}
                onEdit={onEditShift}
                onDelete={onDeleteShift}
              />
            );
          }
          
          return (
            <ShiftCard
              key={shift.id}
              shift={shift}
              work={work}
              onEdit={onEditShift}
              onDelete={onDeleteShift}
            />
          );
        })}
      </div>
    </div>
  );
});

export default DaySection;