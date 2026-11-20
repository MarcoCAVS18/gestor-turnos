// src/components/modals/liveMode/LiveModeForgottenModal/index.jsx
// Shown when a Live Mode session has been open for FORGOTTEN_SESSION_HOURS:
// asks when the shift really ended and saves it with that end time, instead
// of a 14-24 hour shift. The user can also discard the session or keep it
// running (the prompt then stays hidden until the app is reopened).

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import BaseModal from '../../base/BaseModal';
import { useLiveModeContext, MAX_SHIFT_MS } from '../../../../contexts/LiveModeContext';
import { toLocalDateKey } from '../../../../utils/time';
import { getLocaleFromI18n } from '../../../../utils/locale';

const TYPICAL_SHIFT_MS = 8 * 60 * 60 * 1000;
const FORM_ID = 'live-forgotten-form';

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  return new Date(value);
};
// <input type="datetime-local"> wants local "YYYY-MM-DDTHH:mm"
const toInputValue = (date) =>
  `${toLocalDateKey(date)}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const LiveModeForgottenModal = () => {
  const { t, i18n } = useTranslation();
  const live = useLiveModeContext();
  const { liveSession, isForgotten, selectedWork, finishSession, cancelSession, loading } = live || {};
  const [dismissedId, setDismissedId] = useState(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const start = toDate(liveSession?.startedAt);
  const isOpen = !!(isForgotten && liveSession?.id && start && dismissedId !== liveSession.id);

  // Suggest start + 8 h (capped to now) each time the prompt opens
  useEffect(() => {
    if (!isOpen) return;
    const suggestion = new Date(Math.min(start.getTime() + TYPICAL_SHIFT_MS, Date.now()));
    setValue(toInputValue(suggestion));
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, liveSession?.id]);

  if (!isOpen) return null;

  const latest = new Date(Math.min(start.getTime() + MAX_SHIFT_MS, Date.now()));
  const locale = getLocaleFromI18n(i18n.language);
  const startLabel = start.toLocaleString(locale, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const hoursOpen = Math.floor((Date.now() - start.getTime()) / 3600000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const end = new Date(value); // datetime-local without offset = local time
    if (Number.isNaN(end.getTime()) || end <= start || end > new Date(Date.now() + 60000) || end - start > MAX_SHIFT_MS) {
      setError(t('liveMode.forgotten.invalid'));
      return;
    }
    try {
      await finishSession(0, end);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDiscard = async () => {
    try {
      await cancelSession();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <BaseModal
      isOpen
      onClose={() => setDismissedId(liveSession.id)}
      onCancel={() => setDismissedId(liveSession.id)}
      title={t('liveMode.forgotten.title')}
      icon={Clock}
      maxWidth="md"
      showActions
      formId={FORM_ID}
      saveText={t('liveMode.forgotten.save')}
      cancelText={t('liveMode.forgotten.keep')}
      loading={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('liveMode.forgotten.body', { work: selectedWork?.name || '', start: startLabel, hours: hoursOpen })}
        </p>
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t('liveMode.forgotten.endLabel')}</span>
          <input
            type="datetime-local"
            value={value}
            min={toInputValue(start)}
            max={toInputValue(latest)}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-base text-gray-900 dark:text-white"
            required
          />
        </label>
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="button"
          onClick={handleDiscard}
          disabled={loading}
          className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
        >
          {t('liveMode.forgotten.discard')}
        </button>
      </form>
    </BaseModal>
  );
};

export default LiveModeForgottenModal;
