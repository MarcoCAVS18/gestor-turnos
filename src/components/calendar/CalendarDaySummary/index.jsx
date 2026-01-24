// src/components/calendar/CalendarDaySummary/index.jsx

import React, { useMemo } from 'react';
import { PlusCircle, Calendar, Clock, DollarSign, SearchX } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { formatCurrency } from '../../../utils/currency';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { createSafeDate } from '../../../utils/time';
import ShiftCard from '../../cards/shift/ShiftCard';
import DeliveryShiftCard from '../../cards/shift/DeliveryShiftCard';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import { getShiftGrossEarnings } from '../../../utils/shiftUtils';

const CalendarDaySummary = ({ 
  selectedDate, 
  shifts, 
  formatDate, 
  onNewShift,
  onEdit,
  onDelete
}) => {
  const { allWorks, calculatePayment, thematicColors } = useApp();
  const isMobile = useIsMobile();

  // Function to calculate day total
  const calculateDayTotal = (shiftsList) => {
    if (!Array.isArray(shiftsList)) return 0;
    
    return shiftsList.reduce((total, shift) => {
      if (!shift) return total;
      
      try {
        if (shift.type === 'delivery') {
          return total + getShiftGrossEarnings(shift);
        } else {
          const result = calculatePayment ? calculatePayment(shift) : { totalWithDiscount: 0 };
          return total + (result.totalWithDiscount || 0);
        }
      } catch (error) {
        console.warn('Error calculating payment for shift:', shift.id, error);
        return total;
      }
    }, 0);
  };

  // Function to get work safely
  const getWork = (workId) => {
    if (!allWorks || !Array.isArray(allWorks)) return null;
    return allWorks.find(w => w && w.id === workId) || null;
  };

  const shortFormattedDate = useMemo(() => {
    if (!selectedDate) return '';

    const dateObj = createSafeDate(selectedDate);
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    let prefix = '';
    if (dateObj.toDateString() === today.toDateString()) {
        prefix = 'Today, ';
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
        prefix = 'Yesterday, ';
    }

    const formatted = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    return prefix + formatted;
  }, [selectedDate]);



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
      
      {safeShiftsOfDay.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          {/* Day header */}
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
          >
            <Flex variant="between" className="flex items-center">
              <div className="flex items-center">
                <Calendar size={18} style={{ color: thematicColors?.base || '#EC4899' }} className="mr-2" />
                <h3 className="font-semibold">
                  {isMobile ? shortFormattedDate : (formatDate ? formatDate(selectedDate) : selectedDate)}
                </h3>
              </div>
              <div className="flex items-center text-sm">
                <Clock size={14} className="mr-1 text-blue-500" />
                <span className="mr-3">{safeShiftsOfDay.length} shift{safeShiftsOfDay.length !== 1 ? 's' : ''}</span>
                <DollarSign size={14} className="mr-1 text-green-500" />
                <span className="font-medium">{formatCurrency(dayTotal)}</span>
              </div>
            </Flex>
          </div>
          
          {/* Shifts grid - 3 columns */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeShiftsOfDay.map(shift => {
              const work = getWork(shift.workId);
              
              // If we don't find the work, show limited information
              if (!work) {
                return (
                  <div key={shift.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Flex variant="between">
                      <div>
                        <p className="font-medium text-gray-600">Work deleted</p>
                        <p className="text-sm text-gray-500">
                          {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {shift.type === 'delivery' ? formatCurrency(shift.totalEarning || 0) : '--'}
                      </span>
                    </Flex>
                  </div>
                );
              }
              
              // Determine which component to use
              const CardComponent = (shift.type === 'delivery' || work.type === 'delivery') 
                ? DeliveryShiftCard 
                : ShiftCard;
              
              return (
                <div key={shift.id} className="w-full">
                  <CardComponent
                    shift={shift}
                    work={work}
                    date={selectedDate}
                    onEdit={() => onEdit(shift)}
                    onDelete={() => onDelete(shift)}
                    variant="compact"
                  />
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6">
          <SearchX size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">
            No shifts for {
              formatDate ? (
                (() => {
                  const formattedDate = formatDate(selectedDate);
                  if (formattedDate.startsWith('Today') || formattedDate.startsWith('Yesterday')) {
                    return formattedDate;
                  }
                  return `the ${formattedDate}`;
                })()
              ) : 'this date'
            }
          </p>
          <Button
            onClick={() => onNewShift?.(new Date(selectedDate + 'T12:00:00'))}
            className="flex items-center gap-2 mx-auto"
            icon={PlusCircle}
            themeColor={thematicColors?.base}
          >
            Add shift
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CalendarDaySummary;