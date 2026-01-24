// src/components/shifts/WeeklyShiftsSection/index.jsx

import React from 'react';
import ***REMOVED*** Calendar ***REMOVED*** from 'lucide-react';
import ShiftCard from '../../cards/shift/TarjetaTurno';
import DeliveryShiftCard from '../../cards/shift/TarjetaTurnoDelivery';
import ***REMOVED*** formatTurnosCount ***REMOVED*** from '../../../utils/pluralization';
import Flex from '../../ui/Flex';

const WeeklyShiftsSection = (***REMOVED*** 
  weekRange, 
  shifts, 
  totalShifts, 
  allJobs, 
  onEditShift, 
  onDeleteShift, 
  thematicColors 
***REMOVED***) => ***REMOVED***
  
  // Convert shifts object to array sorted by date
  const sortedShifts = Object.entries(shifts)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .flatMap(([date, shiftsOfDay]) => 
      shiftsOfDay.map(shift => (***REMOVED*** ...shift, date ***REMOVED***))
    );

  // Calculate week statistics
  const weekStats = React.useMemo(() => ***REMOVED***
    let totalEarnings = 0;
    let totalHours = 0;

    sortedShifts.forEach(shift => ***REMOVED***
      // For delivery shifts
      if (shift.type === 'delivery') ***REMOVED***
        totalEarnings += shift.totalEarning || 0;
        
        // Calculate hours for delivery
        if (shift.startTime && shift.endTime) ***REMOVED***
          const [startHour, startMinute] = shift.startTime.split(':').map(Number);
          const [endHour, endMinute] = shift.endTime.split(':').map(Number);
          let hours = (endHour + endMinute/60) - (startHour + startMinute/60);
          if (hours < 0) hours += 24;
          totalHours += hours;
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        // For traditional shifts, we would need to calculate with the rates
        // For simplicity, we estimate based on hours
        if (shift.startTime && shift.endTime) ***REMOVED***
          const [startHour, startMinute] = shift.startTime.split(':').map(Number);
          const [endHour, endMinute] = shift.endTime.split(':').map(Number);
          let hours = (endHour + endMinute/60) - (startHour + startMinute/60);
          if (hours < 0) hours += 24;
          totalHours += hours;
          
          // Earning estimation (this can be improved)
          const job = allJobs.find(j => j.id === shift.jobId);
          if (job) ***REMOVED***
            totalEarnings += hours * (job.baseRate || 0);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);

    return ***REMOVED***
      totalEarnings,
      totalHours,
      averagePerHour: totalHours > 0 ? totalEarnings / totalHours : 0
    ***REMOVED***;
  ***REMOVED***, [sortedShifts, allJobs]);

  // Function to render the correct shift according to the type
  const renderShift = (shift, index) => ***REMOVED***
    const job = allJobs.find(j => j.id === shift.jobId);
    
    // Common props for both card types
    const commonProps = ***REMOVED***
      shift: shift,
      work: job,
      date: shift.date,
      onEdit: () => onEditShift(shift),
      onDelete: () => onDeleteShift(shift),
      variant: 'default',
      compact: true
    ***REMOVED***;

    // Determine if it is delivery and render the appropriate component
    if (shift.type === 'delivery') ***REMOVED***
      return <DeliveryShiftCard key=***REMOVED***`$***REMOVED***shift.id***REMOVED***-$***REMOVED***index***REMOVED***`***REMOVED*** ***REMOVED***...commonProps***REMOVED*** />;
    ***REMOVED***
    
    return <ShiftCard key=***REMOVED***`$***REMOVED***shift.id***REMOVED***-$***REMOVED***index***REMOVED***`***REMOVED*** ***REMOVED***...commonProps***REMOVED*** />;
  ***REMOVED***;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      ***REMOVED***/* Week Header */***REMOVED***
      <div 
        className="px-6 py-4 border-b"
        style=***REMOVED******REMOVED*** 
          backgroundColor: thematicColors?.transparent5,
          borderBottomColor: thematicColors?.transparent20
        ***REMOVED******REMOVED***
      >
        <Flex variant="between">
          <Flex className="space-x-3">
            <Calendar 
              size=***REMOVED***20***REMOVED*** 
              style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
            />
            <div>
              <h3 
                className="font-semibold text-lg"
                style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
              >
                Week ***REMOVED***weekRange***REMOVED***
              </h3>
              <p className="text-sm text-gray-600">
                ***REMOVED***formatTurnosCount(totalShifts)***REMOVED***
              </p>
            </div>
          </Flex>

          ***REMOVED***/* Week statistics */***REMOVED***
          <div className="text-right">
            <Flex className="space-x-2 text-sm text-gray-600">
              <span>$***REMOVED***weekStats.totalEarnings.toFixed(2)***REMOVED***</span>
            </Flex>
            <p className="text-xs text-gray-500">
              ***REMOVED***weekStats.totalHours.toFixed(1)***REMOVED***h
            </p>
          </div>
        </Flex>
      </div>

      ***REMOVED***/* Shifts grid - 3 columns with new components */***REMOVED***
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ***REMOVED***sortedShifts.map((shift, index) => renderShift(shift, index))***REMOVED***
        </div>

        ***REMOVED***/* Message if there are no shifts */***REMOVED***
        ***REMOVED***sortedShifts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar size=***REMOVED***32***REMOVED*** className="mx-auto mb-2 text-gray-300" />
            <p>No shifts this week</p>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default WeeklyShiftsSection;