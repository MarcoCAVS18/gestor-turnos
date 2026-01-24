// src/components/calendar/CalendarGrid/index.jsx

import React from 'react';
import CalendarDayCell from '../CalendarDayCell';
import ***REMOVED*** localDateToISO ***REMOVED*** from '../../../utils/calendarUtils';

const CalendarGrid = (***REMOVED*** 
  days, 
  currentDate, 
  currentSelectedDay, 
  jobs, 
  thematicColors, 
  onDayClick 
***REMOVED***) => ***REMOVED***
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDateISO = localDateToISO(currentDate);

  // Function to get job colors
  const getJobColors = (dayShifts, allJobs) => ***REMOVED***
    const uniqueColors = new Set();
    
    if (!dayShifts || dayShifts.length === 0) ***REMOVED***
      return [];
    ***REMOVED***
    
    dayShifts.forEach(shift => ***REMOVED***
      const job = allJobs.find(t => t.id === shift.jobId);
      if (job) ***REMOVED***
        // For delivery jobs, use specific color
        if (job.type === 'delivery' || shift.type === 'delivery') ***REMOVED***
          uniqueColors.add(job.avatarColor || job.color || '#10B981');
        ***REMOVED*** else ***REMOVED***
          // For traditional jobs
          uniqueColors.add(job.color || '#EC4899');
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        // If job is not found, use default color based on type
        if (shift.type === 'delivery') ***REMOVED***
          uniqueColors.add('#10B981'); // Green for delivery
        ***REMOVED*** else ***REMOVED***
          uniqueColors.add('#EC4899'); // Pink for traditional
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
    
    return Array.from(uniqueColors).slice(0, 3); // Maximum 3 colors
  ***REMOVED***;

  return (
    <>
      ***REMOVED***/* Day headers */***REMOVED***
      <div className="grid grid-cols-7 bg-gray-100">
        ***REMOVED***weekDays.map(day => (
          <div key=***REMOVED***day***REMOVED*** className="py-2 text-center text-gray-600 text-sm font-medium">
            ***REMOVED***day***REMOVED***
          </div>
        ))***REMOVED***
      </div>

      ***REMOVED***/* Days grid */***REMOVED***
      <div className="grid grid-cols-7">
        ***REMOVED***days.map((day, index) => ***REMOVED***
          const dayDateISO = localDateToISO(day.date);
          const isToday = dayDateISO === currentDateISO;
          const isSelected = dayDateISO === currentSelectedDay;
          
          // Get colors correctly
          const workColors = getJobColors(day.shiftsOfTheDay, jobs);

          return (
            <CalendarDayCell
              key=***REMOVED***index***REMOVED***
              day=***REMOVED***day***REMOVED***
              isToday=***REMOVED***isToday***REMOVED***
              isSelected=***REMOVED***isSelected***REMOVED***
              workColors=***REMOVED***workColors***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
              onClick=***REMOVED***() => onDayClick(day.date)***REMOVED***
            />
          );
        ***REMOVED***)***REMOVED***
      </div>
    </>
  );
***REMOVED***;

export default CalendarGrid;