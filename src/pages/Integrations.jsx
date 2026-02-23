// src/pages/Integrations.jsx

import { useState, useEffect, useCallback } from 'react';
import {
  Puzzle,
  Bell,
  Calendar,
  Clock,
  ExternalLink,
  Smartphone,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Fingerprint
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackLink from '../components/ui/BackLink';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Switch from '../components/ui/Switch';
import Button from '../components/ui/Button';
import { useConfigContext } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
  checkBiometricSupport,
  isBiometricEnabledOnDevice,
  registerBiometric,
  removeBiometricCredential,
} from '../services/biometricService';
import { db } from '../services/firebase';
import logger from '../utils/logger';

// Cloud Functions base URL - always use production URL
// Local emulator would be: http://localhost:5001/gestionturnos-7ec99/us-central1
const FUNCTIONS_URL = 'https://us-central1-gestionturnos-7ec99.cloudfunctions.net';

const Integrations = () => {
  const { thematicColors } = useConfigContext();
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Integration states
  const [notifications, setNotifications] = useState({
    enabled: false,
    permission: 'default'
  });
  const [shiftReminders, setShiftReminders] = useState({
    enabled: false,
    minutesBefore: 15
  });
  const [googleCalendar, setGoogleCalendar] = useState({
    connected: false,
    loading: false,
    initialLoading: true,
    syncing: false,
    error: null
  });
  const [biometric, setBiometric] = useState({
    supported: null,
    enabled: false,
    loading: false,
  });
  const [pwaTab, setPwaTab] = useState('ios');

  // Check URL params for calendar connection status
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const calendarStatus = params.get('calendar');

    if (calendarStatus === 'connected') {
      setGoogleCalendar(prev => ({ ...prev, connected: true, loading: false, initialLoading: false }));
      // Clean up URL
      navigate('/integrations', { replace: true });
    } else if (calendarStatus === 'error') {
      setGoogleCalendar(prev => ({
        ...prev,
        error: 'Failed to connect. Please try again.',
        loading: false,
        initialLoading: false
      }));
      navigate('/integrations', { replace: true });
    }
  }, [location.search, navigate]);

  // Subscribe to user's calendar connection status
  useEffect(() => {
    // Safety timeout - if no user after 3 seconds, stop loading
    const timeout = setTimeout(() => {
      setGoogleCalendar(prev => {
        if (prev.initialLoading) {
          return { ...prev, initialLoading: false };
        }
        return prev;
      });
    }, 3000);

    if (!currentUser?.uid) {
      return () => clearTimeout(timeout);
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (docSnap) => {
        clearTimeout(timeout);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const isConnected = data.googleCalendarConnected || false;

          // Only update if the connection status actually changed
          setGoogleCalendar(prev => {
            if (prev.connected === isConnected && !prev.initialLoading) {
              return prev; // No change, don't trigger re-render
            }
            return {
              ...prev,
              connected: isConnected,
              loading: false,
              initialLoading: false
            };
          });
        } else {
          setGoogleCalendar(prev => {
            if (!prev.initialLoading && !prev.loading) {
              return prev; // Already in final state
            }
            return { ...prev, loading: false, initialLoading: false };
          });
        }
      },
      (error) => {
        clearTimeout(timeout);
        logger.error('Error listening to user:', error);
        setGoogleCalendar(prev => ({ ...prev, loading: false, initialLoading: false }));
      }
    );

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [currentUser?.uid]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotifications(prev => ({
        ...prev,
        permission: Notification.permission,
        enabled: Notification.permission === 'granted'
      }));
    }
  }, []);

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
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    if (value) {
      const permission = await Notification.requestPermission();
      setNotifications({
        enabled: permission === 'granted',
        permission
      });

      if (permission === 'granted') {
        new Notification('Notifications enabled!', {
          body: 'You will now receive shift reminders.',
          icon: '/favicon.ico'
        });
      }
    } else {
      setNotifications(prev => ({ ...prev, enabled: false }));
    }
  };

  // Handle shift reminders toggle
  const handleShiftRemindersToggle = (value) => {
    if (value && !notifications.enabled) {
      handleNotificationToggle(true).then(() => {
        setShiftReminders(prev => ({ ...prev, enabled: true }));
      });
    } else {
      setShiftReminders(prev => ({ ...prev, enabled: value }));
    }
  };

  // Handle Google Calendar connection
  const handleGoogleCalendarConnect = async () => {
    try {
      setGoogleCalendar(prev => ({ ...prev, loading: true, error: null }));

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${FUNCTIONS_URL}/getGoogleAuthUrl`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }

      const { url } = await response.json();

      // Redirect to Google OAuth
      window.location.href = url;
    } catch (error) {
      logger.error('Error connecting Google Calendar:', error);
      setGoogleCalendar(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to start connection. Please try again.'
      }));
    }
  };

  // Handle Google Calendar disconnection
  const handleGoogleCalendarDisconnect = async () => {
    try {
      setGoogleCalendar(prev => ({ ...prev, loading: true, error: null }));

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${FUNCTIONS_URL}/disconnectGoogleCalendar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setGoogleCalendar(prev => ({
        ...prev,
        connected: false,
        loading: false
      }));
    } catch (error) {
      logger.error('Error disconnecting Google Calendar:', error);
      setGoogleCalendar(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to disconnect. Please try again.'
      }));
    }
  };

  // Sync all existing shifts to calendar
  const handleSyncAllShifts = async () => {
    try {
      setGoogleCalendar(prev => ({ ...prev, syncing: true, error: null }));

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${FUNCTIONS_URL}/syncAllShiftsToCalendar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sync');
      }

      const result = await response.json();
      const { synced = 0, total, message } = result;

      // Build appropriate message based on response
      let syncMessage;
      if (message) {
        // Use message from backend if provided (e.g., "All shifts already synced")
        syncMessage = message;
      } else if (total !== undefined) {
        syncMessage = `Synced ${synced} of ${total} shifts`;
      } else {
        syncMessage = synced > 0 ? `Synced ${synced} shifts` : 'All shifts are already synced';
      }

      setGoogleCalendar(prev => ({
        ...prev,
        syncing: false,
        syncMessage
      }));

      // Clear message after 3 seconds
      setTimeout(() => {
        setGoogleCalendar(prev => ({ ...prev, syncMessage: null }));
      }, 3000);
    } catch (error) {
      logger.error('Error syncing shifts:', error);
      setGoogleCalendar(prev => ({
        ...prev,
        syncing: false,
        error: 'Failed to sync shifts. Please try again.'
      }));
    }
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
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {title}
            </h3>
            {status && (
              <span className={`text-xs px-2 py-0.5 rounded-full bg-${statusColor}-100 text-${statusColor}-600`}>
                {status}
              </span>
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
      <BackLink to="/settings">Back to Settings</BackLink>

      <PageHeader
        title="Integrations"
        subtitle="Connect external services and configure notifications"
        icon={Puzzle}
      />

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Browser Notifications */}
        <IntegrationCard
          icon={Bell}
          title="Browser Notifications"
          description="Receive notifications directly in your browser when important events occur."
          status={notifications.enabled ? 'Active' : 'Inactive'}
          statusColor={notifications.enabled ? 'green' : 'gray'}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {notifications.permission === 'denied'
                ? 'Blocked by browser'
                : 'Enable notifications'}
            </span>
            <Switch
              checked={notifications.enabled}
              onChange={handleNotificationToggle}
              disabled={notifications.permission === 'denied'}
            />
          </div>
          {notifications.permission === 'denied' && (
            <p className="text-xs text-amber-600 mt-2">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </IntegrationCard>

        {/* Shift Reminders */}
        <IntegrationCard
          icon={Clock}
          title="Shift Reminders"
          description="Get notified before your shifts start so you never miss one."
          status={shiftReminders.enabled ? 'Active' : 'Inactive'}
          statusColor={shiftReminders.enabled ? 'green' : 'gray'}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Enable reminders</span>
              <Switch
                checked={shiftReminders.enabled}
                onChange={handleShiftRemindersToggle}
              />
            </div>

            {shiftReminders.enabled && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Remind me</span>
                <select
                  value={shiftReminders.minutesBefore}
                  onChange={(e) => setShiftReminders(prev => ({
                    ...prev,
                    minutesBefore: parseInt(e.target.value)
                  }))}
                  className="w-full sm:w-auto text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  <option value={5}>5 minutes before</option>
                  <option value={10}>10 minutes before</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                </select>
              </div>
            )}
          </div>
        </IntegrationCard>

        {/* Biometric Login */}
        <IntegrationCard
          icon={Fingerprint}
          title="Biometric Login"
          description="Use Touch ID, Face ID, or Windows Hello to quickly unlock the app when you return."
          status={biometric.supported === null ? 'Checking...' : biometric.enabled ? 'Active' : 'Inactive'}
          statusColor={biometric.enabled ? 'green' : 'gray'}
        >
          {biometric.supported === false ? (
            <p className="text-sm text-amber-600">Not supported on this device or browser.</p>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {biometric.enabled ? 'Biometric login is active on this device' : 'Enable for this device'}
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
          title="Mobile App"
          description="Get push notifications and manage your shifts on the go with our mobile app."
          status="Coming Soon"
          statusColor="blue"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-400">iOS & Android</span>
            </div>
          </div>
        </IntegrationCard>

        {/* Google Calendar */}
        <IntegrationCard
          icon={Calendar}
          title="Google Calendar"
          description="Sync your shifts automatically with Google Calendar for easy access across devices."
          status={
            googleCalendar.initialLoading
              ? 'Loading...'
              : googleCalendar.connected
                ? 'Connected'
                : 'Not connected'
          }
          statusColor={googleCalendar.connected ? 'green' : 'gray'}
        >
          <div className="space-y-3">
            {googleCalendar.error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <XCircle size={16} />
                {googleCalendar.error}
              </div>
            )}
            {googleCalendar.syncMessage && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <CheckCircle size={16} />
                {googleCalendar.syncMessage}
              </div>
            )}
            {googleCalendar.initialLoading ? (
              <Button variant="secondary" icon={Loader2} disabled className="w-full justify-center animate-pulse">
                Loading...
              </Button>
            ) : googleCalendar.connected ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  icon={googleCalendar.syncing ? Loader2 : RefreshCw}
                  onClick={handleSyncAllShifts}
                  disabled={googleCalendar.syncing}
                  className={`flex-1 justify-center ${googleCalendar.syncing ? 'animate-pulse' : ''}`}
                >
                  {googleCalendar.syncing ? 'Syncing...' : 'Sync All'}
                </Button>
                <Button
                  variant="ghost"
                  icon={ExternalLink}
                  onClick={handleGoogleCalendarDisconnect}
                  disabled={googleCalendar.loading}
                  className="flex-1 justify-center text-gray-500 hover:text-red-500"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                icon={googleCalendar.loading ? Loader2 : Calendar}
                onClick={handleGoogleCalendarConnect}
                disabled={googleCalendar.loading}
                className={`w-full justify-center ${googleCalendar.loading ? 'animate-pulse' : ''}`}
              >
                {googleCalendar.loading ? 'Connecting...' : 'Connect Calendar'}
              </Button>
            )}
            <p className="text-xs text-gray-400 text-center">
              New shifts will sync automatically once connected
            </p>
          </div>
        </IntegrationCard>

        {/* About Google Calendar Sync */}
        <Card padding="lg" variant="ghost" className="bg-gray-50 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">About Google Calendar Sync</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> New shifts are automatically added when created</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> Edits and deletions sync in real-time</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> Use "Sync All" to import shifts created before connecting</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>



      {/* Install Orary */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-5">
          <img
            src="/assets/SVG/logo.svg"
            alt="Orary Logo"
            className="w-10 h-10"
            style={{ filter: `brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1653%) hue-rotate(305deg) brightness(93%) contrast(101%)` }}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Install Orary</h2>
            <p className="text-sm text-gray-500">Add it to your home screen — works like a native app, no App Store needed</p>
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
            iPhone / iPad
          </button>
          <button
            onClick={() => setPwaTab('android')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pwaTab === 'android' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h2v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
            </svg>
            Android
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
              <p className="text-sm text-blue-700">
                <strong>Only works in Safari.</strong> If you're using Chrome or Firefox on iPhone, open this page in Safari first.
              </p>
            </div>

            <div className="p-5 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>1</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Open this page in <strong>Safari</strong></p>
                  <p className="text-xs text-gray-500">If you're already in Safari, you're good to go!</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>2</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Tap the <strong>Share</strong> button at the bottom of Safari</p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-600">Share</span>
                  </div>
                </div>
              </div>

              {/* Step 3 — critical scroll step */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Find <strong>"Add to Home Screen"</strong> in the share menu</p>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 mb-2">
                    <span className="text-amber-500 text-base leading-none flex-shrink-0 mt-0.5">⚠️</span>
                    <p className="text-xs text-amber-800">
                      <strong>Scroll down!</strong> This option is NOT at the top of the share sheet — it's hidden below. Keep swiping down through the icons row until you see the <strong>"Add to Home Screen"</strong> icon with a plus symbol.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-600">Add to Home Screen</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>4</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Tap <strong>"Add"</strong> in the top-right corner</p>
                  <p className="text-xs text-gray-500">Orary will appear on your home screen — open it just like any app.</p>
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
              <p className="text-sm text-green-700"><strong>Works best in Chrome.</strong> Samsung Browser also supports it.</p>
            </div>

            <div className="p-5 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>1</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Tap the <strong>menu</strong> icon at the top-right of Chrome</p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-600">⋮ Menu</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>2</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></p>
                  <p className="text-xs text-gray-500">The label may vary depending on your Chrome version.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: thematicColors?.base || '#EC4899' }}>3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Tap <strong>"Install"</strong> to confirm</p>
                  <p className="text-xs text-gray-500">Orary will appear on your home screen and in your app drawer.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
