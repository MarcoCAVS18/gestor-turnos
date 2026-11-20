// src/utils/shiftDetailsUtils.js

import { createSafeDate } from './time';
import i18n from '../i18n';
import { getLocaleFromI18n } from './locale';
import { formatCurrencyExact } from './currency';

// Texts follow the app language (the delete dialog used to be English only)
const t = (key, options) => i18n.t(key, options);
const currentLocale = () => getLocaleFromI18n(i18n.language);

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
    
    // If crosses midnight (equal times = zero duration)
    if (endMinutes < startMinutes) {
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
  const known = ['day', 'afternoon', 'night', 'saturday', 'sunday', 'delivery', 'mixed'];
  return t(`deleteDetails.types.${known.includes(type) ? type : 'night'}`);
}

export function formatShifts(quantity) {
  return `${quantity} ${quantity === 1 ? 'SHIFT' : 'SHIFTS'}`;
}

// Function to calculate shift duration in hours
function calculateDuration(startTime, endTime, crossesMidnight) {
  if (!startTime || !endTime) return null;

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let startMinutes = startHour * 60 + startMinute;
  let endMinutes = endHour * 60 + endMinute;

  if (endMinutes < startMinutes || (crossesMidnight && endMinutes === startMinutes)) {
    endMinutes += 24 * 60;
  }

  const totalMinutes = endMinutes - startMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes, totalMinutes };
}

// Function to generate shift details for the deletion modal
export function generateShiftDetails(shift, allJobs, shiftRanges) {
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

    const startDateStr = startDate.toLocaleDateString(currentLocale(), {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    const endDateStr = endDate.toLocaleDateString(currentLocale(), {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    dateText = `${startDateStr} → ${endDateStr}`;
  } else {
    // Normal shift on a single day
    const dateStr = shift.startDate || shift.date;
    if (dateStr) {
      const date = createSafeDate(dateStr);
      dateText = date.toLocaleDateString(currentLocale(), {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } else {
      dateText = t('deleteDetails.dateNotAvailable');
    }
  }

  // Calculate duration
  const duration = calculateDuration(shift.startTime, shift.endTime, crossesMidnight);
  let durationText = '';
  if (duration) {
    durationText = duration.hours > 0
      ? `${duration.hours}h ${duration.minutes}min`
      : `${duration.minutes}min`;
  }

  // Determine shift type
  const shiftType = determineShiftType(shift, shiftRanges);
  const shiftTypeLabel = getShiftTypeLabel(shiftType);

  // Build details array
  const details = [
    work?.name || t('deleteDetails.workNotFound'),
    `${dateText}`,
    `${shift.startTime} - ${shift.endTime} (${durationText})`,
  ];

  // Add shift type for regular shifts
  if (shift.type !== 'delivery') {
    details.push(shiftTypeLabel);
  }

  // Add break info if applicable
  if (shift.hadBreak !== undefined) {
    details.push(shift.hadBreak
      ? t('deleteDetails.breakYes', { minutes: shift.breakMinutes || 0 })
      : t('deleteDetails.breakNo'));
  }

  // Add delivery-specific info
  if (shift.type === 'delivery') {
    details.push(t('deleteDetails.orders', { count: shift.orderCount || 0 }));
    if (shift.totalEarnings) {
      details.push(formatCurrencyExact(shift.totalEarnings));
    }
  }

  // Add live mode indicator
  if (shift.isLive) {
    details.push(t('deleteDetails.liveTracked'));
  }

  return details;
}
