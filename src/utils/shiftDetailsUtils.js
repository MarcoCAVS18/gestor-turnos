// src/utils/shiftDetailsUtils.js

import { createSafeDate } from './time';

// Function to detect if a shift crosses midnight
export function checkIfShiftCrossesMidnight(shift) {
  if (!shift.startTime || !shift.endTime) return false;
  
  // If it already has the crossesMidnight property, use it
  if (shift.crossesMidnight !== undefined) {
    return shift.crossesMidnight;
  }
  
  // If startDate and endDate are different, it crosses midnight
  if (shift.startDate && shift.endDate && shift.startDate !== shift.endDate) {
    return true;
  }
  
  // Calculate based on hours
  const [startHour] = shift.startTime.split(':').map(Number);
  const [endHour] = shift.endTime.split(':').map(Number);
  
  return endHour < startHour;
}

// Function to determine shift type by specific hour
export function getShiftTypeByHour(hour, shiftRanges) {
  const ranges = shiftRanges || {
    dayStart: 6, dayEnd: 14,
    afternoonStart: 14, afternoonEnd: 20,
    nightStart: 20
  };

  if (hour >= ranges.dayStart && hour < ranges.dayEnd) {
    return 'day';
  } else if (hour >= ranges.afternoonStart && hour < ranges.afternoonEnd) {
    return 'afternoon';
  } else {
    return 'night';
  }
}

// Main function to determine shift type - THIS IS THE ONLY ONE YOU SHOULD USE
export function determineShiftType(shift, shiftRanges) {
  if (!shift) return 'night';
  
  // If it's delivery, return delivery
  if (shift.type === 'delivery') {
    return 'delivery';
  }
  
  // Determine by date (weekend)
  const keyDate = shift.startDate || shift.date;
  if (keyDate) {
    const [year, month, day] = keyDate.split('-');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0) return 'sunday';
    if (dayOfWeek === 6) return 'saturday';
  }
  
  // Determine by start and end time to detect mixed shifts
  if (shift.startTime && shift.endTime) {
    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    let endMinutes = endHour * 60 + endMinute;
    
    // If crosses midnight
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const foundTypes = new Set();
    
    // Check each hour of the shift to see if type changes
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
      const currentHour = Math.floor((minutes % (24 * 60)) / 60);
      const type = getShiftTypeByHour(currentHour, shiftRanges);
      foundTypes.add(type);
    }
    
    // If there is more than one type, it is mixed
    if (foundTypes.size > 1) {
      return 'mixed';
    }
    
    // If there is only one type, return that type
    return Array.from(foundTypes)[0] || 'night';
  }
  
  return 'night';
}

// Function that returns the readable label
export function getShiftTypeLabel(type) {
  const labels = {
    day: 'Day',
    afternoon: 'Afternoon', 
    night: 'Night',
    saturday: 'Saturday',
    sunday: 'Sunday',
    delivery: 'Delivery',
    mixed: 'Mixed'
  };
  
  return labels[type] || 'Night';
}

export function formatShifts(quantity) {
  return `${quantity} ${quantity === 1 ? 'SHIFT' : 'SHIFTS'}`;
}

// Function to generate shift details for the deletion modal
export function generateShiftDetails(shift, allJobs) {
  if (!shift) return [];

  const work = allJobs.find(w => w.id === shift.workId);

  // Check if the shift crosses midnight
  const crossesMidnight = checkIfShiftCrossesMidnight(shift);
  
  let dateText = '';
  
  if (crossesMidnight) {
    // Shift that crosses midnight - show both dates
    let startDate, endDate;
    
    if (shift.startDate && shift.endDate && shift.startDate !== shift.endDate) {
      // Use existing dates if different
      startDate = createSafeDate(shift.startDate);
      endDate = createSafeDate(shift.endDate);
    } else {
      // Calculate end date based on start date
      const baseDate = shift.startDate || shift.date;
      startDate = createSafeDate(baseDate);
      endDate = createSafeDate(baseDate);
      endDate.setDate(endDate.getDate() + 1); 
    }
    
    const startDateStr = startDate.toLocaleDateString('en-US', {
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    });
    
    const endDateStr = endDate.toLocaleDateString('en-US', {
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    });
    
    dateText = `${startDateStr} - ${endDateStr}`;
  } else {
    // Normal shift on a single day
    const dateStr = shift.startDate || shift.date;
    if (dateStr) {
      const date = createSafeDate(dateStr);
      dateText = date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } else {
      dateText = 'Date not available';
    }
  }

  const details = [
    work?.name || 'Work not found',
    dateText,
    `${shift.startTime} - ${shift.endTime}`
  ];

  if (shift.type === 'delivery') {
    details.push(`${shift.orderCount || 0} orders`);
  }

  return details;
}
