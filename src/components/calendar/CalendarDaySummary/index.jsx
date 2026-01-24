// src/components/calendar/CalendarDaySummary/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** PlusCircle, Calendar, Clock, DollarSign, SearchX ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../utils/time';
import ShiftCard from '../../cards/shift/TarjetaTurno';
import DeliveryShiftCard from '../../cards/shift/TarjetaTurnoDelivery';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import ***REMOVED*** getShiftGrossEarnings ***REMOVED*** from '../../../utils/shiftUtils';

const CalendarDaySummary = (***REMOVED*** 
  selectedDate, 
  shifts, 
  formatDate, 
  onNewShift,
  onEdit,
  onDelete
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** allWorks, calculatePayment, thematicColors ***REMOVED*** = useApp();
  const isMobile = useIsMobile();

  // Function to calculate day total
  const calculateDayTotal = (shiftsList) => ***REMOVED***
    if (!Array.isArray(shiftsList)) return 0;
    
    return shiftsList.reduce((total, shift) => ***REMOVED***
      if (!shift) return total;
      
      try ***REMOVED***
        if (shift.type === 'delivery') ***REMOVED***
          return total + getShiftGrossEarnings(shift);
        ***REMOVED*** else ***REMOVED***
          const result = calculatePayment ? calculatePayment(shift) : ***REMOVED*** totalWithDiscount: 0 ***REMOVED***;
          return total + (result.totalWithDiscount || 0);
        ***REMOVED***
      ***REMOVED*** catch (error) ***REMOVED***
        console.warn('Error calculating payment for shift:', shift.id, error);
        return total;
      ***REMOVED***
    ***REMOVED***, 0);
  ***REMOVED***;

  // Function to get work safely
  const getWork = (workId) => ***REMOVED***
    if (!allWorks || !Array.isArray(allWorks)) return null;
    return allWorks.find(w => w && w.id === workId) || null;
  ***REMOVED***;

  const shortFormattedDate = useMemo(() => ***REMOVED***
    if (!selectedDate) return '';

    const dateObj = createSafeDate(selectedDate);
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    let prefix = '';
    if (dateObj.toDateString() === today.toDateString()) ***REMOVED***
        prefix = 'Today, ';
    ***REMOVED*** else if (dateObj.toDateString() === yesterday.toDateString()) ***REMOVED***
        prefix = 'Yesterday, ';
    ***REMOVED***

    const formatted = dateObj.toLocaleDateString('en-US', ***REMOVED***
      month: 'short',
      day: 'numeric'
    ***REMOVED***);
    
    return prefix + formatted;
  ***REMOVED***, [selectedDate]);



  // Validate and filter shifts
  const safeShiftsOfDay = Array.isArray(shifts) ? shifts.filter(shift => shift && shift.id) : [];
  const dayTotal = calculateDayTotal(safeShiftsOfDay);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
          Shifts of the selected day
        </h3>
      </div>
      
      ***REMOVED***safeShiftsOfDay.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          ***REMOVED***/* Day header */***REMOVED***
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
          >
            <Flex variant="between" className="flex items-center">
              <div className="flex items-center">
                <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
                <h3 className="font-semibold">
                  ***REMOVED***isMobile ? shortFormattedDate : (formatDate ? formatDate(selectedDate) : selectedDate)***REMOVED***
                </h3>
              </div>
              <div className="flex items-center text-sm">
                <Clock size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                <span className="mr-3">***REMOVED***safeShiftsOfDay.length***REMOVED*** shift***REMOVED***safeShiftsOfDay.length !== 1 ? 's' : ''***REMOVED***</span>
                <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-500" />
                <span className="font-medium">***REMOVED***formatCurrency(dayTotal)***REMOVED***</span>
              </div>
            </Flex>
          </div>
          
          ***REMOVED***/* Shifts grid - 3 columns */***REMOVED***
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ***REMOVED***safeShiftsOfDay.map(shift => ***REMOVED***
              const work = getWork(shift.workId);
              
              // If we don't find the work, show limited information
              if (!work) ***REMOVED***
                return (
                  <div key=***REMOVED***shift.id***REMOVED*** className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Flex variant="between">
                      <div>
                        <p className="font-medium text-gray-600">Work deleted</p>
                        <p className="text-sm text-gray-500">
                          ***REMOVED***shift.startTime***REMOVED*** - ***REMOVED***shift.endTime***REMOVED***
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">
                        ***REMOVED***shift.type === 'delivery' ? formatCurrency(shift.totalEarning || 0) : '--'***REMOVED***
                      </span>
                    </Flex>
                  </div>
                );
              ***REMOVED***
              
              // Determine which component to use
              const CardComponent = (shift.type === 'delivery' || work.type === 'delivery') 
                ? DeliveryShiftCard 
                : ShiftCard;
              
              return (
                <div key=***REMOVED***shift.id***REMOVED*** className="w-full">
                  <CardComponent
                    shift=***REMOVED***shift***REMOVED***
                    work=***REMOVED***work***REMOVED***
                    date=***REMOVED***selectedDate***REMOVED***
                    onEdit=***REMOVED***() => onEdit(shift)***REMOVED***
                    onDelete=***REMOVED***() => onDelete(shift)***REMOVED***
                    variant="compact"
                  />
                </div>
              );
            ***REMOVED***)***REMOVED***
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6">
          <SearchX size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">
            No shifts for ***REMOVED***
              formatDate ? (
                (() => ***REMOVED***
                  const formattedDate = formatDate(selectedDate);
                  if (formattedDate.startsWith('Today') || formattedDate.startsWith('Yesterday')) ***REMOVED***
                    return formattedDate;
                  ***REMOVED***
                  return `the $***REMOVED***formattedDate***REMOVED***`;
                ***REMOVED***)()
              ) : 'this date'
            ***REMOVED***
          </p>
          <Button
            onClick=***REMOVED***() => onNewShift?.(new Date(selectedDate + 'T12:00:00'))***REMOVED***
            className="flex items-center gap-2 mx-auto"
            icon=***REMOVED***PlusCircle***REMOVED***
            themeColor=***REMOVED***thematicColors?.base***REMOVED***
          >
            Add shift
          </Button>
        </Card>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default CalendarDaySummary;