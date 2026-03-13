// src/pages/Integrations.jsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Puzzle,
  Bell,
  Calendar,
  Clock,
  Smartphone,
  Fingerprint,
  Link2,
  Check,
  Copy,
  Smartphone as NativeIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BackLink from '../components/ui/BackLink';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Switch from '../components/ui/Switch';
import Button from '../components/ui/Button';
import { useConfigContext } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { useDataContext } from '../contexts/DataContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import {
  checkBiometricSupport,
  isBiometricEnabledOnDevice,
  registerBiometric,
  removeBiometricCredential,
} from '../services/biometricService';
import { db, functions } from '../services/firebase';
import {
  isNotificationSupported,
  checkNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
} from '../services/native/nativeNotifications';
import {
  scheduleShiftReminders,
  cancelShiftReminders,
} from '../services/native/shiftReminderService';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import logger from '../utils/logger';

// Cloud Functions base URL - always use production URL
// Local emulator would be: http://localhost:5001/gestionturnos-7ec99/us-central1
const FUNCTIONS_URL = 'https://us-central1-gestionturnos-7ec99.cloudfunctions.net';

const Integrations = () => {
  const { t } = useTranslation();
  const { thematicColors } = useConfigContext();
  const { currentUser } = useAuth();
  const { shifts, works } = useDataContext();

  const isNative = Capacitor.isNativePlatform();

  // Works as a map for quick lookup in scheduler
  const worksMap = useMemo(
    () => Object.fromEntries((works || []).map(w => [w.id, w])),
    [works]
  );

  // Integration states
  const [notifications, setNotifications] = useState({
    enabled: false,
    permission: 'default'
  });
  const [shiftReminders, setShiftReminders] = useState({
    enabled: false,
    minutesBefore: 15,
    loading: true,   // true while loading from Firestore
    scheduledCount: null,
  });
  const [calendarFeed, setCalendarFeed] = useState({
    loading: false,
    url: null,
    copied: false,
    error: null,
  });
  const [biometric, setBiometric] = useState({
    supported: null,
    enabled: false,
    loading: false,
  });
  const [pwaTab, setPwaTab] = useState('ios');

  // Check notification permission on mount and when tab becomes visible
  useEffect(() => {
    const checkPermissions = async () => {
      const permission = await checkNotificationPermission();
      setNotifications(prev => ({
        ...prev,
        permission,
        enabled: permission === 'granted'
      }));
    };

    checkPermissions();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkPermissions();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Load shift reminder preference from Firestore on mount
  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setShiftReminders(prev => ({
            ...prev,
            enabled: data.shiftRemindersEnabled || false,
            minutesBefore: data.shiftReminderMinutes || 15,
            loading: false,
          }));
        } else {
          setShiftReminders(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        logger.warn('[Integrations] Failed to load reminder preference:', err);
        setShiftReminders(prev => ({ ...prev, loading: false }));
      }
    };
    load();
  }, [currentUser]);

  // Auto-reschedule when shifts change (if reminders are enabled and on native)
  useEffect(() => {
    if (!shiftReminders.enabled || shiftReminders.loading || !isNative) return;
    scheduleShiftReminders(shifts, worksMap, shiftReminders.minutesBefore).then(({ scheduled }) => {
      setShiftReminders(prev => ({ ...prev, scheduledCount: scheduled }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts, shiftReminders.enabled, shiftReminders.minutesBefore, shiftReminders.loading]);

  // Check biometric support and load device state on mount
  useEffect(() => {
    checkBiometricSupport().then(supported => {
      setBiometric(prev => ({
        ...prev,
        supported,
        enabled: currentUser ? isBiometricEnabledOnDevice(currentUser.uid) : false,
      }));
    });
  }, [currentUser]);

  // Handle biometric toggle
  const handleBiometricToggle = async (value) => {
    setBiometric(prev => ({ ...prev, loading: true }));
    try {
      if (value) {
        await registerBiometric(currentUser.uid, currentUser.email);
        await updateDoc(doc(db, 'users', currentUser.uid), { biometricEnabled: true });
        setBiometric(prev => ({ ...prev, enabled: true, loading: false }));
        
        // Send MFA enrollment notification email
        try {
          const sendMFANotification = httpsCallable(functions, 'sendMFAEnrollmentNotification');
          await sendMFANotification({
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email
          });
        } catch (emailErr) {
          // Silently fail - don't block UX if email fails
          logger.warn('Failed to send MFA notification email:', emailErr);
        }
      } else {
        removeBiometricCredential(currentUser.uid);
        await updateDoc(doc(db, 'users', currentUser.uid), { biometricEnabled: false });
        setBiometric(prev => ({ ...prev, enabled: false, loading: false }));
      }
    } catch (err) {
      logger.error('Biometric toggle error:', err);
      setBiometric(prev => ({ ...prev, loading: false }));
    }
  };

  // Get Firebase auth token
  const getAuthToken = useCallback(async () => {
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  }, [currentUser]);

  // Handle notification toggle
  const handleNotificationToggle = async (value) => {
    if (!isNotificationSupported()) return;

    if (value) {
      const permission = await requestNotificationPermission();
      setNotifications({ enabled: permission === 'granted', permission });
      if (permission === 'granted') {
        await sendLocalNotification(
          t('integrations.notifications.enabledTitle'),
          t('integrations.notifications.enabledMessage')
        );
      }
    } else {
      setNotifications(prev => ({ ...prev, enabled: false }));
    }
  };

  // Handle shift reminders toggle — persists to Firestore + schedules/cancels
  const handleShiftRemindersToggle = async (value) => {
    if (!currentUser) return;

    // If enabling but notifications not granted, request first
    if (value && !notifications.enabled) {
      const permission = await requestNotificationPermission();
      setNotifications({ enabled: permission === 'granted', permission });
      if (permission !== 'granted') return;
    }

    setShiftReminders(prev => ({ ...prev, enabled: value, scheduledCount: null }));

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { shiftRemindersEnabled: value });
    } catch (err) {
      logger.warn('[Integrations] Failed to save reminder preference:', err);
    }

    if (value && isNative) {
      const { scheduled } = await scheduleShiftReminders(shifts, worksMap, shiftReminders.minutesBefore);
      setShiftReminders(prev => ({ ...prev, scheduledCount: scheduled }));
    } else if (!value) {
      await cancelShiftReminders();
      setShiftReminders(prev => ({ ...prev, scheduledCount: null }));
    }
  };

  // Handle minutes change — persists + reschedules if active
  const handleMinutesChange = async (minutes) => {
    setShiftReminders(prev => ({ ...prev, minutesBefore: minutes, scheduledCount: null }));

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { shiftReminderMinutes: minutes });
    } catch (err) {
      logger.warn('[Integrations] Failed to save reminder minutes:', err);
    }

    if (shiftReminders.enabled && isNative) {
      const { scheduled } = await scheduleShiftReminders(shifts, worksMap, minutes);
      setShiftReminders(prev => ({ ...prev, scheduledCount: scheduled }));
    }
  };

  // Get or create calendar subscription URL and open in the appropriate calendar app
  const handleSubscribeCalendar = async () => {
    try {
      setCalendarFeed(prev => ({ ...prev, loading: true, error: null }));

      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const response = await fetch(`${FUNCTIONS_URL}/getCalendarToken`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timezone }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => response.status);
        throw new Error(`Server error: ${errText}`);
      }

      const { url } = await response.json();
      setCalendarFeed(prev => ({ ...prev, loading: false, url }));

      const webcalUrl = url.replace('https://', 'webcal://');
      const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

      if (platform === 'ios') {
        // Native iOS: navigate to webcal:// — WKWebView passes custom URL schemes to iOS,
        // which opens the Calendar app. window.open('_system') is Cordova-only, broken in Capacitor.
        window.location.href = webcalUrl;
      } else if (platform === 'android') {
        // Native Android: open Google Calendar subscription via in-app browser (Browser.open).
        // window.open('_system') does NOT work in Capacitor — use @capacitor/browser instead.
        const googleCalUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
        await Browser.open({ url: googleCalUrl });
      } else {
        // Web: detect iOS Safari by user agent (webcal:// works natively)
        const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOSSafari) {
          window.location.href = webcalUrl;
        } else {
          const googleCalUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
          window.open(googleCalUrl, '_blank');
        }
      }
    } catch (error) {
      logger.error('Error subscribing to calendar:', error);
      setCalendarFeed(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  // Copy the webcal:// URL to clipboard (for other calendar apps)
  const handleCopyLink = async () => {
    if (!calendarFeed.url) return;
    const webcalUrl = calendarFeed.url.replace('https://', 'webcal://');
    await navigator.clipboard.writeText(webcalUrl);
    setCalendarFeed(prev => ({ ...prev, copied: true }));
    setTimeout(() => setCalendarFeed(prev => ({ ...prev, copied: false })), 2000);
  };

  const IntegrationCard = ({
    icon: Icon,
    title,
    description,
    children,
    status,
    statusColor = 'gray'
  }) => (
    <Card padding="lg" className="relative overflow-hidden">
      {/* Decorative accent */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ backgroundColor: thematicColors?.base || '#EC4899' }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${thematicColors?.base || '#EC4899'}15` }}
        >
          <Icon
            size={24}
            style={{ color: thematicColors?.base || '#EC4899' }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-nowrap">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate min-w-0">
              {title}
            </h3>
            {status && (
              <Badge
                variant={statusColor}
                size="xs"
                rounded
                className="whitespace-nowrap flex-shrink-0"
              >
                {status}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {description}
          </p>
          {children}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink to="/settings">{t('integrations.backToSettings')}</BackLink>

      <PageHeader
        title={t('nav.integrations')}
        subtitle={t('integrations.subtitle')}
        icon={Puzzle}
      />

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Browser Notifications */}
        <IntegrationCard
          icon={Bell}
          title={t('integrations.notifications.title')}
          description={t('integrations.notifications.description')}
          status={notifications.enabled ? t('integrations.status.active') : t('integrations.status.inactive')}
          statusColor={notifications.enabled ? 'success' : 'default'}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {notifications.permission === 'denied'
                ? t('integrations.notifications.blocked')
                : t('integrations.notifications.enable')}
            </span>
            <Switch
              checked={notifications.enabled}
              onChange={handleNotificationToggle}
              disabled={notifications.permission === 'denied'}
            />
          </div>
          {notifications.permission === 'denied' && (
            <p className="text-xs text-amber-600 mt-2">
              {t('integrations.notifications.blockedHelp')}
            </p>
          )}
        </IntegrationCard>

        {/* Shift Reminders */}
        <IntegrationCard
          icon={Clock}
          title={t('integrations.reminders.title')}
          description={t('integrations.reminders.description')}
          status={shiftReminders.loading ? t('integrations.status.checking') : shiftReminders.enabled ? t('integrations.status.active') : t('integrations.status.inactive')}
          statusColor={shiftReminders.enabled ? 'success' : 'default'}
        >
          <div className="space-y-3">
            {/* Native-only notice on web */}
            {!isNative && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                <NativeIcon size={14} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {t('integrations.reminders.nativeOnly')}
                </p>
              </div>
            )}

            {/* Toggle row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('integrations.reminders.enable')}
              </span>
              <Switch
                checked={shiftReminders.enabled}
                onChange={handleShiftRemindersToggle}
                disabled={shiftReminders.loading}
              />
            </div>

            {/* Minutes selector (only when enabled) */}
            {shiftReminders.enabled && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('integrations.reminders.remindMe')}
                </span>
                <select
                  value={shiftReminders.minutesBefore}
                  onChange={(e) => handleMinutesChange(parseInt(e.target.value))}
                  className="w-full sm:w-auto text-sm border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  <option value={5}>{t('integrations.reminders.minutes', { count: 5 })}</option>
                  <option value={10}>{t('integrations.reminders.minutes', { count: 10 })}</option>
                  <option value={15}>{t('integrations.reminders.minutes', { count: 15 })}</option>
                  <option value={30}>{t('integrations.reminders.minutes', { count: 30 })}</option>
                  <option value={60}>{t('integrations.reminders.hour')}</option>
                </select>
              </div>
            )}

            {/* Scheduled count feedback (native only) */}
            {isNative && shiftReminders.enabled && shiftReminders.scheduledCount !== null && (
              <p className="text-xs text-green-600 dark:text-green-400">
                {shiftReminders.scheduledCount === 0
                  ? t('integrations.reminders.noUpcoming')
                  : t('integrations.reminders.scheduled', { count: shiftReminders.scheduledCount })}
              </p>
            )}
          </div>
        </IntegrationCard>

        {/* Biometric Login */}
        <IntegrationCard
          icon={Fingerprint}
          title={t('integrations.biometric.title')}
          description={t('integrations.biometric.description')}
          status={biometric.supported === null ? t('integrations.status.checking') : biometric.enabled ? t('integrations.status.active') : t('integrations.status.inactive')}
          statusColor={biometric.enabled ? 'success' : 'default'}
        >
          {biometric.supported === false ? (
            <p className="text-sm text-amber-600">{t('integrations.biometric.notSupported')}</p>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {biometric.enabled ? t('integrations.biometric.active') : t('integrations.biometric.enable')}
              </span>
              <Switch
                checked={biometric.enabled}
                onChange={handleBiometricToggle}
                disabled={biometric.loading || biometric.supported === null}
              />
            </div>
          )}
        </IntegrationCard>

        {/* Mobile App - Coming Soon */}
        <IntegrationCard
          icon={Smartphone}
          title={t('integrations.mobile.title')}
          description={t('integrations.mobile.description')}
          status={t('integrations.status.soon')}
          statusColor="primary"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-400">{t('integrations.mobile.platforms')}</span>
            </div>
          </div>
        </IntegrationCard>

        {/* Calendar Subscription */}
        <IntegrationCard
          icon={Calendar}
          title={t('integrations.calendar.title')}
          description={t('integrations.calendar.description')}
        >
          <div className="space-y-3">
            <Button
              themeColor={thematicColors?.base}
              icon={Calendar}
              iconPosition="left"
              onClick={handleSubscribeCalendar}
              loading={calendarFeed.loading}
              loadingText={t('integrations.calendar.opening')}
              className="w-full justify-center"
            >
              {t('integrations.calendar.subscribe')}
            </Button>

            {calendarFeed.error && (
              <p className="text-xs text-red-500 text-center">
                {t('integrations.calendar.error')}
              </p>
            )}

            {calendarFeed.url && (
              <Button
                variant="ghost"
                themeColor={thematicColors?.base}
                icon={calendarFeed.copied ? Check : Copy}
                iconPosition="left"
                onClick={handleCopyLink}
                className="w-full justify-center"
              >
                {calendarFeed.copied ? t('integrations.calendar.copied') : t('integrations.calendar.copyLink')}
              </Button>
            )}

            <p className="text-xs text-gray-400 text-center">
              {t('integrations.calendar.note')}
            </p>
          </div>
        </IntegrationCard>

        {/* How it works */}
        <Card padding="lg" variant="transparent" className="bg-gray-50 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Link2 size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">{t('integrations.howItWorks.title')}</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2"><Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> {t('integrations.howItWorks.step1')}</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> {t('integrations.howItWorks.step2')}</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> {t('integrations.howItWorks.step3')}</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>



      {/* Install Orary - only show on web, not on native iOS/Android */}
      {!Capacitor.isNativePlatform() && <div className="mt-8">
        <div className="flex items-center gap-3 mb-5">
          <img
            src="/assets/SVG/logo.svg"
            alt="Orary Logo"
            className="w-10 h-10"
            style={{ filter: `brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1653%) hue-rotate(305deg) brightness(93%) contrast(101%)` }}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">{t('integrations.install.title')}</h2>
            <p className="text-sm text-gray-500">{t('integrations.install.description')}</p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-5 w-fit">
          <button
            onClick={() => setPwaTab('ios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pwaTab === 'ios' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            {t('integrations.install.iosTab')}
          </button>
          <button
            onClick={() => setPwaTab('android')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pwaTab === 'android' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h2v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
            </svg>
            {t('integrations.install.androidTab')}
          </button>
        </div>

        {/* iOS Safari Instructions */}
        {pwaTab === 'ios' && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {/* Safari-only notice */}
            <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 border-b border-blue-100">
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-blue-700"
                 dangerouslySetInnerHTML={{ __html: t('integrations.install.ios.safariOnly') }}>
              </p>
            </div>

            <div className="p-5 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>1</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1"
                     dangerouslySetInnerHTML={{ __html: t('integrations.install.ios.step1') }}>
                  </p>
                  <p className="text-xs text-gray-500">{t('integrations.install.ios.step1Note')}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>2</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2"
                     dangerouslySetInnerHTML={{ __html: t('integrations.install.ios.step2') }}>
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-600">{t('integrations.install.share')}</span>
                  </div>
                </div>
              </div>

              {/* Step 3 — critical scroll step */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2"
                     dangerouslySetInnerHTML={{ __html: t('integrations.install.ios.step3') }}>
                  </p>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 mb-2">
                    <span className="text-amber-500 text-base leading-none flex-shrink-0 mt-0.5">⚠️</span>
                    <p className="text-xs text-amber-800"
                       dangerouslySetInnerHTML={{ __html: t('integrations.install.ios.step3Warning') }}>
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-600">{t('integrations.install.addToHome')}</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>4</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1"
                     dangerouslySetInnerHTML={{ __html: t('integrations.install.ios.step4') }}>
                  </p>
                  <p className="text-xs text-gray-500">{t('integrations.install.ios.step4Note')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Android Chrome Instructions */}
        {pwaTab === 'android' && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-green-50 border-b border-green-100">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-green-700"
                 dangerouslySetInnerHTML={{ __html: t('integrations.install.android.chromeOnly') }}>
              </p>
            </div>

            <div className="p-5 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>1</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2"
                     dangerouslySetInnerHTML={{ __html: t('integrations.install.android.step1') }}>
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-600">⋮ {t('integrations.install.menu')}</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>2</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1"
                     dangerouslySetInnerHTML={{ __html: t('integrations.install.android.step2') }}>
                  </p>
                  <p className="text-xs text-gray-500">{t('integrations.install.android.step2Note')}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1"
                     dangerouslySetInnerHTML={{ __html: t('integrations.install.android.step3') }}>
                  </p>
                  <p className="text-xs text-gray-500">{t('integrations.install.android.step3Note')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>}
    </div>
  );
};

export default Integrations;
