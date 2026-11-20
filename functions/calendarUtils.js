// functions/calendarUtils.js
// Pure helpers for the ICS calendar feed (no Firebase dependencies, unit-tested).

const isValidDateKey = (key) => typeof key === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(key);
const isValidTime = (time) => typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

const isValidTimeZone = (tz) => {
  if (typeof tz !== 'string' || !tz || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

/** Adds days to a "YYYY-MM-DD" key. UTC arithmetic on a date-only key is timezone-safe. */
const addDaysToKey = (key, days) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/**
 * End date of a shift. Overnight shifts (end time not after start time) end the
 * next day; older documents may carry endDate === startDate for those, so a
 * stored endDate is only trusted when it is after the start.
 */
const getShiftEndDate = (shift) => {
  const start = shift.startDate || shift.date;
  const overnight = shift.endTime < shift.startTime;
  if (!overnight) return start;
  return isValidDateKey(shift.endDate) && shift.endDate > start ? shift.endDate : addDaysToKey(start, 1);
};

const formatICSDateTime = (dateKey, time) => `${dateKey.replace(/-/g, '')}T${time.replace(':', '')}00`;

const escapeICSText = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\;')
    .replace(/\r?\n/g, '\\n');
};

/**
 * Builds the ICS document. Shifts without a valid date and start/end time are
 * skipped (one bad document must not break the whole feed).
 * @param {Array} shifts - { id, startDate|date, endDate, startTime, endTime, notes, workId }
 * @param {Object} worksMap - { [workId]: { name } }
 * @param {string} timezone - IANA timezone; invalid values fall back to UTC
 * @param {Date} [stamp]
 */
const generateICS = (shifts, worksMap, timezone, stamp = new Date()) => {
  const tz = isValidTimeZone(timezone) ? timezone : 'UTC';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Orary//Shift Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Orary - My Shifts',
    `X-WR-TIMEZONE:${tz}`,
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
  ];
  const dtstamp = stamp.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  for (const shift of shifts) {
    const start = shift.startDate || shift.date;
    if (!isValidDateKey(start) || !isValidTime(shift.startTime) || !isValidTime(shift.endTime)) continue;
    const workName = worksMap[shift.workId]?.name || 'Shift';
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:shift-${shift.id}@orary.app`);
    // TZID so calendar apps show the shift at the local time it was logged in
    lines.push(`DTSTART;TZID=${tz}:${formatICSDateTime(start, shift.startTime)}`);
    lines.push(`DTEND;TZID=${tz}:${formatICSDateTime(getShiftEndDate(shift), shift.endTime)}`);
    lines.push(`SUMMARY:${escapeICSText(workName)}`);
    if (shift.notes) lines.push(`DESCRIPTION:${escapeICSText(shift.notes)}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};

module.exports = { isValidDateKey, isValidTime, isValidTimeZone, addDaysToKey, getShiftEndDate, escapeICSText, generateICS };
