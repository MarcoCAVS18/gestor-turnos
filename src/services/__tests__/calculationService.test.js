import {
  calculateHours,
  calculatePayment,
  aggregateDeliveryShifts,
  calculateDeliveryHourlyStats,
  calculateWeeklyHourlyDeliveryStats,
  calculateMonthlyStats,
} from '../calculationService';
import { formatCurrency, formatCurrencyExact } from '../../utils/currency';

// holidayService pulls in date-holidays, whose ESM-only dependencies Jest cannot
// parse. These tests run with automatic holidays off, so a stub is enough.
jest.mock('../holidayService', () => ({ isHoliday: () => false }));

const RANGES = { dayStart: 6, dayEnd: 14, afternoonStart: 14, afternoonEnd: 20, nightStart: 20 };
const farm = { id: 'farm', name: 'Farm', baseRate: 30, rates: { day: 30, afternoon: 32, night: 36, saturday: 40, sunday: 50, holidays: 75 } };
const pay = (shift, { discount = 0, smoko = false, smokoMinutes = 30, taxes = {} } = {}) =>
  calculatePayment({ workId: 'farm', type: 'regular', ...shift }, [farm], RANGES, discount, taxes, smoko, smokoMinutes, {});

describe('calculateHours', () => {
  test('same-day and overnight', () => {
    expect(calculateHours('07:00', '15:30')).toBe(8.5);
    expect(calculateHours('22:00', '02:00')).toBe(4);
    expect(calculateHours(null, '02:00')).toBe(0);
  });
});

describe('calculatePayment', () => {
  // 2026-11-17 is a Tuesday, 2026-11-20 a Friday, 2026-11-21 a Saturday, 2026-11-22 a Sunday.
  test('weekday shift inside the day range', () => {
    const r = pay({ startDate: '2026-11-17', startTime: '07:00', endTime: '13:00' });
    expect(r.hours).toBe(6);
    expect(r.total).toBeCloseTo(180, 5);
  });

  test('weekday shift spanning day and afternoon rates', () => {
    // 07:00-14:00 at 30 (210) + 14:00-15:30 at 32 (48)
    const r = pay({ startDate: '2026-11-17', startTime: '07:00', endTime: '15:30' });
    expect(r.total).toBeCloseTo(258, 5);
    expect(r.breakdown.day).toBeCloseTo(210, 5);
    expect(r.breakdown.afternoon).toBeCloseTo(48, 5);
  });

  test('Saturday and Sunday use their own flat rate', () => {
    expect(pay({ startDate: '2026-11-21', startTime: '07:00', endTime: '12:00' }).total).toBeCloseTo(200, 5);
    expect(pay({ startDate: '2026-11-22', startTime: '07:00', endTime: '12:00' }).total).toBeCloseTo(250, 5);
  });

  test('overnight Friday -> Saturday splits at midnight', () => {
    // Fri 22:00-24:00 night (2 h x 36) + Sat 00:00-02:00 (2 h x 40)
    const r = pay({ startDate: '2026-11-20', startTime: '22:00', endTime: '02:00' });
    expect(r.hours).toBe(4);
    expect(r.total).toBeCloseTo(152, 5);
    expect(r.isNightShift).toBe(true);
  });

  test('unpaid break is deducted only when breaks are enabled and the shift had one', () => {
    const shift = { startDate: '2026-11-17', startTime: '07:00', endTime: '13:00' };
    expect(pay(shift, { smoko: true }).hours).toBe(5.5);
    expect(pay(shift, { smoko: true }).total).toBeCloseTo(165, 5);
    expect(pay({ ...shift, hadBreak: false }, { smoko: true }).hours).toBe(6);
    expect(pay({ ...shift, breakMinutes: 60 }, { smoko: true }).hours).toBe(5);
    expect(pay(shift, { smoko: false }).hours).toBe(6);
  });

  test('Live Mode pauses are deducted even with breaks disabled, and replace the smoko check', () => {
    // 07:00-13:00 with 45 min paused -> 5.25 h, at the day rate 30
    const shift = { startDate: '2026-11-17', startTime: '07:00', endTime: '13:00', hadBreak: false, breakMinutes: 0, pausedMinutes: 45 };
    const off = pay(shift, { smoko: false });
    expect(off.hours).toBe(5.25);
    expect(off.total).toBeCloseTo(157.5, 5);
    expect(off.pausedMinutes).toBe(45);
    expect(pay(shift, { smoko: true }).hours).toBe(5.25);
    // a pause can never exceed the shift
    expect(pay({ ...shift, pausedMinutes: 999 }).hours).toBe(0);
  });

  test('tax: per-job override wins over the default', () => {
    const shift = { startDate: '2026-11-17', startTime: '07:00', endTime: '13:00' };
    expect(pay(shift, { discount: 15 }).totalWithDiscount).toBeCloseTo(153, 5);
    expect(pay(shift, { discount: 15, taxes: { farm: 32.5 } }).totalWithDiscount).toBeCloseTo(121.5, 5);
  });

  test('unknown job or missing times yield zero instead of throwing', () => {
    expect(calculatePayment({ workId: 'gone', startDate: '2026-11-17', startTime: '07:00', endTime: '13:00' }, [farm], RANGES, 0, {}, false, 30, {}).total).toBe(0);
    expect(pay({ startDate: '2026-11-17', startTime: null, endTime: null }).total).toBe(0);
  });
});

describe('delivery aggregation', () => {
  const current = { type: 'delivery', workId: 'uber', date: '2026-11-15', startDate: '2026-11-15', endDate: '2026-11-15',
    startTime: '18:00', endTime: '21:00', baseEarnings: 80, tips: 10, totalEarnings: 90, fuelExpense: 6, orderCount: 9, kilometers: 30, platform: 'Uber Eats' };
  const legacy = { type: 'delivery', workId: 'uber', date: '2026-11-14', startDate: '2026-11-14', endDate: '2026-11-14',
    startTime: '18:00', endTime: '20:00', totalEarnings: 50, tips: 5, expenses: 4, orderCount: 5, kilometers: 12, platform: 'Uber Eats' };

  test('a shift without times does not crash and adds no hours', () => {
    const noTimes = { ...current, startTime: null, endTime: null };
    const r = aggregateDeliveryShifts([current, noTimes], []);
    expect(r.totalEarned).toBe(180);
    expect(r.totalHours).toBe(3);
    expect(r.shiftsCompleted).toBe(2);
  });

  test('hourly stats count tips once (current shape) and add them for legacy shifts', () => {
    const [slot] = calculateDeliveryHourlyStats([current]);
    expect(slot.earnings).toBe(84); // 90 gross (tips included) - 6 fuel
    expect(slot.hours).toBe(3);

    const [legacySlot] = calculateDeliveryHourlyStats([legacy]);
    expect(legacySlot.earnings).toBe(51); // 50 + 5 tips - 4 fuel
  });

  test('weekly hourly grid distributes the same net amount', () => {
    const grid = calculateWeeklyHourlyDeliveryStats([current]);
    const total = grid.reduce((sum, day) => sum + day.hourlyData.reduce((s, h) => s + h.totalProfit, 0), 0);
    expect(total).toBeCloseTo(84, 5);
  });

  test('hourly stats skip shifts without times', () => {
    expect(calculateDeliveryHourlyStats([{ ...current, startTime: null, endTime: null }])).toEqual([]);
  });
});

describe('money formatting', () => {
  test('exact formatter keeps cents only when there are any', () => {
    expect(formatCurrencyExact(28.5)).toBe('$28.50');
    expect(formatCurrencyExact(30.13)).toBe('$30.13');
    expect(formatCurrencyExact(30)).toBe('$30');
    expect(formatCurrencyExact(1204.88)).toBe('$1,204.88');
    expect(formatCurrencyExact(undefined)).toBe('$0');
  });

  test('rounded formatter is unchanged', () => {
    expect(formatCurrency(28.5)).toBe('$29');
    expect(formatCurrency(12234.4)).toBe('$12,234');
  });
});

describe('calculateMonthlyStats uses the same "earned" as the rest of the app', () => {
  test('after tax for hourly jobs, net of fuel for delivery, gross reported apart', () => {
    const regular = [{ workId: 'farm', type: 'regular', date: '2026-11-17', startDate: '2026-11-17', startTime: '07:00', endTime: '13:00' }];
    const delivery = [{ type: 'delivery', date: '2026-11-15', startDate: '2026-11-15', startTime: '18:00', endTime: '21:00', baseEarnings: 80, tips: 10, totalEarnings: 90, fuelExpense: 6 }];
    const payFn = (shift) => pay(shift, { discount: 15 });
    const m = calculateMonthlyStats(2026, 10, regular, delivery, payFn);
    expect(m.totalEarnings).toBeCloseTo(153 + 84, 5); // 180 after 15 % + (90 - 6)
    expect(m.totalGross).toBeCloseTo(180 + 90, 5);
    expect(m.netEarnings).toBe(m.totalEarnings);
    expect(m.totalHours).toBe(9);
  });
});
