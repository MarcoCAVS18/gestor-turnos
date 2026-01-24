// src/components/shifts/WeeklyShiftsSection/index.jsx

import React from 'react';
import { Calendar } from 'lucide-react';
import ShiftCard from '../../cards/shift/ShiftCard';
import DeliveryShiftCard from '../../cards/shift/DeliveryShiftCard';
import { createSafeDate } from '../../../utils/time';

const WeeklyShiftsSection = ({ weekRange, shifts, allJobs, onEditShift, onDeleteShift, thematicColors }) => {
  // Get dates of shifts and sort them
  const dates = Object.keys(shifts || {}).sort((a, b) => new Date(b) - new Date(a));

  if (!dates || dates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Week header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar size={20} style={{ color: thematicColors?.base || '#EC4899' }} />
          <h3 className="font-semibold text-gray-900">
            {weekRange}
          </h3>
        </div>
      </div>

      {/* Days with shifts */}
      {dates.map(date => {
        const dateObj = createSafeDate(date);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        const dayShifts = shifts[date] || [];

        return (
          <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Day header */}
            <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: thematicColors?.transparent5 }}>
              <div className="flex items-center gap-2">
                <Calendar size={20} style={{ color: thematicColors?.base }} />
                <h3 className="font-semibold text-gray-900 capitalize">
                  {dayOfWeek}, {formattedDate}
                </h3>
              </div>
            </div>

            {/* Shift cards for this day - Grid layout */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayShifts.map(shift => {
                const work = allJobs.find(w => w.id === shift.workId);

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
      })}
    </div>
  );
};

export default WeeklyShiftsSection;