// The delete dialog details follow the app language (they were English only).
import i18n from '../../i18n';
import { generateShiftDetails } from '../shiftDetailsUtils';
import { generateWorkDetails } from '../workUtils';

const works = [{ id: 'farm', name: 'Sunny Ridge Farm', type: 'regular', baseRate: 30.13 }];
const liveShift = { workId: 'farm', type: 'regular', startDate: '2026-11-20', endDate: '2026-11-20', startTime: '01:57', endTime: '01:57', crossesMidnight: false, hadBreak: false, isLive: true };

afterAll(() => i18n.changeLanguage('en'));

test('Spanish: no English text, zero duration for equal times', async () => {
  await i18n.changeLanguage('es');
  const details = generateShiftDetails(liveShift, works).join(' | ');
  expect(details).toMatch(/viernes/i);
  expect(details).toMatch(/Descanso: no/);
  expect(details).toMatch(/Registrado con Modo Live/);
  expect(details).not.toMatch(/Friday|Break|Live tracked|Mixed|shift/);
  expect(details).not.toMatch(/24h/);
  expect(generateWorkDetails(works[0]).join(' | ')).toMatch(/Tarifa: \$30\.13\/h/);
});

test('French and English variants', async () => {
  await i18n.changeLanguage('fr');
  expect(generateShiftDetails({ ...liveShift, hadBreak: true, breakMinutes: 30 }, works).join(' | ')).toMatch(/Pause : 30 min/);
  await i18n.changeLanguage('en');
  expect(generateShiftDetails(liveShift, works).join(' | ')).toMatch(/Tracked with Live Mode/);
});
