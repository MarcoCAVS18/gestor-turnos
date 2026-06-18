// src/components/settings/NotificationsSection/index.jsx
//
// Opt-in daily "log your shift" reminder. The schedule is native-only
// (iOS/Android via Capacitor); on web the preference is saved but no
// notification fires (the web has no persistent scheduling API).

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Flex from '../../ui/Flex';
import Switch from '../../ui/Switch';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../../../services/native/nativeNotifications';

const NotificationsSection = ({ onError, className }) => {
  const { t } = useTranslation();
  const {
    dailyReminderEnabled = false,
    dailyReminderTime = '19:00',
    savePreferences,
  } = useApp();

  const [enabled, setEnabled] = useState(dailyReminderEnabled);
  const [time, setTime] = useState(dailyReminderTime);

  useEffect(() => {
    setEnabled(dailyReminderEnabled);
    setTime(dailyReminderTime);
  }, [dailyReminderEnabled, dailyReminderTime]);

  const persist = async (newEnabled, newTime) => {
    try {
      await savePreferences({ dailyReminderEnabled: newEnabled, dailyReminderTime: newTime });
    } catch (error) {
      onError?.('Error saving notification settings: ' + error.message);
    }
  };

  const handleToggle = async (newEnabled) => {
    setEnabled(newEnabled);
    if (newEnabled) {
      await requestNotificationPermission();
      await scheduleDailyReminder(time);
    } else {
      await cancelDailyReminder();
    }
    persist(newEnabled, time);
  };

  const handleTimeChange = async (newTime) => {
    setTime(newTime);
    if (enabled) await scheduleDailyReminder(newTime);
    persist(enabled, newTime);
  };

  return (
    <div id="notifications-section">
      <SettingsSection icon={Bell} title={t('settings.notifications.title')} className={className}>
        <div className="space-y-6">
          <Flex variant="between">
            <div className="flex-1 pr-4">
              <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications.dailyReminder')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.notifications.dailyReminderDesc')}</p>
            </div>
            <Switch checked={enabled} onChange={handleToggle} />
          </Flex>

          {enabled && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.notifications.time')}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2"
              />
            </div>
          )}
        </div>
      </SettingsSection>
    </div>
  );
};

export default NotificationsSection;
