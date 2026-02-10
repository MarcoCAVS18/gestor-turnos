// src/components/calendar/CalendarGrid/index.jsx

import React from 'react';
import CalendarDayCell from '../CalendarDayCell';
import { localDateToISO } from '../../../utils/calendarUtils';

const CalendarGrid = ({ 
  days, 
  currentDate, 
  currentSelectedDay, 
  jobs, 
  thematicColors, 
  onDayClick 
}) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDateISO = localDateToISO(currentDate);

  // Function to get job colors
  const getJobColors = (dayShifts, allJobs) => {
    const uniqueColors = new Set();

    if (!dayShifts || dayShifts.length === 0) {
      return [];
    }

    dayShifts.forEach(shift => {
      const job = allJobs.find(t => t.id === shift.workId);

      if (job) {
        // Use job color (prefer avatarColor, then color)
        const jobColor = job.avatarColor || job.color;

        if (jobColor) {
          uniqueColors.add(jobColor);
        } else {
          // Fallback to default only if job has no color defined
          const fallbackColor = (job.type === 'delivery' || shift.type === 'delivery') ? '#10B981' : '#EC4899';
          uniqueColors.add(fallbackColor);
        }
      } else {
        // If job is not found, use default color based on type
        const fallbackColor = shift.type === 'delivery' ? '#10B981' : '#EC4899';
        uniqueColors.add(fallbackColor);
      }
    });

    const colors = Array.from(uniqueColors).slice(0, 3);
    return colors;
  };

  return (
    <>
      {/* Day headers */}
      <div className="grid grid-cols-7 bg-gray-100">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-center text-gray-600 text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayDateISO = localDateToISO(day.date);
          const isToday = dayDateISO === currentDateISO;
          const isSelected = dayDateISO === currentSelectedDay;
          
          // Get colors correctly
          const workColors = getJobColors(day.shiftsOfDay, jobs);

          return (
            <CalendarDayCell
              key={index}
              day={day}
              isToday={isToday}
              isSelected={isSelected}
              workColors={workColors}
              thematicColors={thematicColors}
              onClick={() => onDayClick(day.date)}
            />
          );
        })}
      </div>
    </>
  );
};

export default CalendarGrid;