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
        // For delivery jobs, use specific color
        if (job.type === 'delivery' || shift.type === 'delivery') {
          uniqueColors.add(job.avatarColor || job.color || '#10B981');
        } else {
          // For traditional jobs
          uniqueColors.add(job.color || '#EC4899');
        }
      } else {
        // If job is not found, use default color based on type
        if (shift.type === 'delivery') {
          uniqueColors.add('#10B981'); // Green for delivery
        } else {
          uniqueColors.add('#EC4899'); // Pink for traditional
        }
      }
    });

    return Array.from(uniqueColors).slice(0, 3); // Maximum 3 colors
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
          const workColors = getJobColors(day.shiftsOfTheDay, jobs);

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