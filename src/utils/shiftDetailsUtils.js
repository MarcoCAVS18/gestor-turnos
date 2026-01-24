// src/utils/shiftDetailsUtils.js

import ***REMOVED*** createSafeDate ***REMOVED*** from './time';

// Function to detect if a shift crosses midnight
export function checkIfShiftCrossesMidnight(shift) ***REMOVED***
  if (!shift.startTime || !shift.endTime) return false;
  
  // If it already has the crossesMidnight property, use it
  if (shift.crossesMidnight !== undefined) ***REMOVED***
    return shift.crossesMidnight;
  ***REMOVED***
  
  // If startDate and endDate are different, it crosses midnight
  if (shift.startDate && shift.endDate && shift.startDate !== shift.endDate) ***REMOVED***
    return true;
  ***REMOVED***
  
  // Calculate based on hours
  const [startHour] = shift.startTime.split(':').map(Number);
  const [endHour] = shift.endTime.split(':').map(Number);
  
  return endHour < startHour;
***REMOVED***

// Function to determine shift type by specific hour
export function getShiftTypeByHour(hour, shiftRanges) ***REMOVED***
  const ranges = shiftRanges || ***REMOVED***
    dayStart: 6, dayEnd: 14,
    afternoonStart: 14, afternoonEnd: 20,
    nightStart: 20
  ***REMOVED***;

  if (hour >= ranges.dayStart && hour < ranges.dayEnd) ***REMOVED***
    return 'day';
  ***REMOVED*** else if (hour >= ranges.afternoonStart && hour < ranges.afternoonEnd) ***REMOVED***
    return 'afternoon';
  ***REMOVED*** else ***REMOVED***
    return 'night';
  ***REMOVED***
***REMOVED***

// Main function to determine shift type - THIS IS THE ONLY ONE YOU SHOULD USE
export function determineShiftType(shift, shiftRanges) ***REMOVED***
  if (!shift) return 'night';
  
  // If it's delivery, return delivery
  if (shift.type === 'delivery') ***REMOVED***
    return 'delivery';
  ***REMOVED***
  
  // Determine by date (weekend)
  const keyDate = shift.startDate || shift.date;
  if (keyDate) ***REMOVED***
    const [year, month, day] = keyDate.split('-');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0) return 'sunday';
    if (dayOfWeek === 6) return 'saturday';
  ***REMOVED***
  
  // Determine by start and end time to detect mixed shifts
  if (shift.startTime && shift.endTime) ***REMOVED***
    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    let endMinutes = endHour * 60 + endMinute;
    
    // If crosses midnight
    if (endMinutes <= startMinutes) ***REMOVED***
      endMinutes += 24 * 60;
    ***REMOVED***
    
    const foundTypes = new Set();
    
    // Check each hour of the shift to see if type changes
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) ***REMOVED***
      const currentHour = Math.floor((minutes % (24 * 60)) / 60);
      const type = getShiftTypeByHour(currentHour, shiftRanges);
      foundTypes.add(type);
    ***REMOVED***
    
    // If there is more than one type, it is mixed
    if (foundTypes.size > 1) ***REMOVED***
      return 'mixed';
    ***REMOVED***
    
    // If there is only one type, return that type
    return Array.from(foundTypes)[0] || 'night';
  ***REMOVED***
  
  return 'night';
***REMOVED***

// Function that returns the readable label
export function getShiftTypeLabel(type) ***REMOVED***
  const labels = ***REMOVED***
    day: 'Day',
    afternoon: 'Afternoon', 
    night: 'Night',
    saturday: 'Saturday',
    sunday: 'Sunday',
    delivery: 'Delivery',
    mixed: 'Mixed'
  ***REMOVED***;
  
  return labels[type] || 'Night';
***REMOVED***

// ✅ New function to pluralize "shifts"
export function formatShifts(quantity) ***REMOVED***
  return `$***REMOVED***quantity***REMOVED*** $***REMOVED***quantity === 1 ? 'SHIFT' : 'SHIFTS'***REMOVED***`;
***REMOVED***

// Function to generate shift details for the deletion modal
export function generateShiftDetails(shift, allJobs) ***REMOVED***
  if (!shift) return [];

  const work = allJobs.find(w => w.id === shift.workId);

  // Check if the shift crosses midnight
  const crossesMidnight = checkIfShiftCrossesMidnight(shift);
  
  let dateText = '';
  
  if (crossesMidnight) ***REMOVED***
    // Shift that crosses midnight - show both dates
    let startDate, endDate;
    
    if (shift.startDate && shift.endDate && shift.startDate !== shift.endDate) ***REMOVED***
      // Use existing dates if different
      startDate = createSafeDate(shift.startDate);
      endDate = createSafeDate(shift.endDate);
    ***REMOVED*** else ***REMOVED***
      // Calculate end date based on start date
      const baseDate = shift.startDate || shift.date;
      startDate = createSafeDate(baseDate);
      endDate = createSafeDate(baseDate); // Create from base date
      endDate.setDate(endDate.getDate() + 1); // Add 1 day
    ***REMOVED***
    
    const startDateStr = startDate.toLocaleDateString('en-US', ***REMOVED***
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    ***REMOVED***);
    
    const endDateStr = endDate.toLocaleDateString('en-US', ***REMOVED***
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    ***REMOVED***);
    
    dateText = `$***REMOVED***startDateStr***REMOVED*** - $***REMOVED***endDateStr***REMOVED***`;
  ***REMOVED*** else ***REMOVED***
    // Normal shift on a single day
    const dateStr = shift.startDate || shift.date;
    if (dateStr) ***REMOVED***
      const date = createSafeDate(dateStr);
      dateText = date.toLocaleDateString('en-US', ***REMOVED***
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      dateText = 'Date not available';
    ***REMOVED***
  ***REMOVED***

  const details = [
    work?.name || 'Work not found',
    dateText,
    `$***REMOVED***shift.startTime***REMOVED*** - $***REMOVED***shift.endTime***REMOVED***`
  ];

  if (shift.type === 'delivery') ***REMOVED***
    details.push(`$***REMOVED***shift.numberOfOrders || 0***REMOVED*** orders`);
  ***REMOVED***

  return details;
***REMOVED***
