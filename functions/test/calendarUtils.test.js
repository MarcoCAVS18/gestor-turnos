const test = require('node:test');
const assert = require('node:assert/strict');
const c = require('../calendarUtils');

test('timezone validation', () => {
  assert.equal(c.isValidTimeZone('Australia/Sydney'), true);
  assert.equal(c.isValidTimeZone('UTC'), true);
  assert.equal(c.isValidTimeZone('Not/AZone'), false);
  assert.equal(c.isValidTimeZone('X\r\nDESCRIPTION:injected'), false);
  assert.equal(c.isValidTimeZone(''), false);
});

test('shift end date: same day, overnight, legacy overnight stored with endDate === startDate', () => {
  assert.equal(c.getShiftEndDate({ startDate: '2026-11-13', startTime: '07:00', endTime: '15:30' }), '2026-11-13');
  assert.equal(c.getShiftEndDate({ startDate: '2026-11-13', endDate: '2026-11-14', startTime: '22:00', endTime: '02:00' }), '2026-11-14');
  assert.equal(c.getShiftEndDate({ startDate: '2026-11-13', endDate: '2026-11-13', startTime: '22:00', endTime: '02:00' }), '2026-11-14');
  assert.equal(c.getShiftEndDate({ date: '2026-12-31', startTime: '23:00', endTime: '05:00' }), '2027-01-01');
});

test('ICS: overnight event ends the next day, shifts without times are skipped, bad timezone falls back to UTC', () => {
  const ics = c.generateICS([
    { id: 'a', startDate: '2026-11-13', endDate: '2026-11-13', startTime: '22:00', endTime: '02:00', workId: 'w' },
    { id: 'b', startDate: '2026-11-14', startTime: null, endTime: null, workId: 'w' },
    { id: 'c', startDate: '2026-11-15', startTime: '07:00', endTime: '15:30', workId: 'gone', notes: 'line1\nline2, ok;' },
  ], { w: { name: 'Farm, Inc' } }, 'Australia/Sydney', new Date('2026-11-18T00:00:00Z'));
  assert.match(ics, /DTSTART;TZID=Australia\/Sydney:20261113T220000/);
  assert.match(ics, /DTEND;TZID=Australia\/Sydney:20261114T020000/);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 2);
  assert.match(ics, /SUMMARY:Farm\\, Inc/);
  assert.match(ics, /DESCRIPTION:line1\\nline2\\, ok\;/);
  assert.match(c.generateICS([], {}, 'Bad\r\nZone'), /X-WR-TIMEZONE:UTC/);
});

test('equal start and end times end the same day (zero length, not 24 h)', () => {
  assert.equal(c.getShiftEndDate({ startDate: '2026-11-20', startTime: '01:57', endTime: '01:57' }), '2026-11-20');
});
