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
  XCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackLink from '../components/ui/BackLink';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Switch from '../components/ui/Switch';
import Button from '../components/ui/Button';
import { useConfigContext } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

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
        console.error('Error listening to user:', error);
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
      console.error('Error connecting Google Calendar:', error);
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
      console.error('Error disconnecting Google Calendar:', error);
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
      console.error('Error syncing shifts:', error);
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
            {/* Error message */}
            {googleCalendar.error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <XCircle size={16} />
                {googleCalendar.error}
              </div>
            )}

            {/* Success message */}
            {googleCalendar.syncMessage && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <CheckCircle size={16} />
                {googleCalendar.syncMessage}
              </div>
            )}

            {googleCalendar.initialLoading ? (
              <Button
                variant="secondary"
                icon={Loader2}
                disabled
                className="w-full justify-center animate-pulse"
              >
                Loading...
              </Button>
            ) : googleCalendar.connected ? (
              <div className="flex gap-2">
                {/* Sync button */}
                <Button
                  variant="secondary"
                  icon={googleCalendar.syncing ? Loader2 : RefreshCw}
                  onClick={handleSyncAllShifts}
                  disabled={googleCalendar.syncing}
                  className={`flex-1 justify-center ${googleCalendar.syncing ? 'animate-pulse' : ''}`}
                >
                  {googleCalendar.syncing ? 'Syncing...' : 'Sync All'}
                </Button>

                {/* Disconnect button */}
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

      </div>



      {/* PWA Installation Instructions */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/assets/SVG/logo.svg"
            alt="Orary Logo"
            className="w-10 h-10"
            style={{ filter: `brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1653%) hue-rotate(305deg) brightness(93%) contrast(101%)` }}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Install Orary</h2>
            <p className="text-sm text-gray-500">Get the best experience by adding this app to your home screen</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* iOS Safari Instructions */}
          <div className="p-5 rounded-xl border border-gray-200 bg-transparent">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <h3 className="font-semibold text-gray-700">iOS Safari</h3>
            </div>

            <ol className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">1</span>
                <div>
                  <p className="text-sm">Tap the <strong>Share</strong> icon at the bottom of your screen</p>
                  <div className="mt-2 inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    {/* iOS Share Icon */}
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">2</span>
                <div>
                  <p className="text-sm">Scroll down and select <strong>"Add to Home Screen"</strong></p>
                  <div className="mt-2 inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    {/* Plus Square Icon */}
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="12" y1="8" x2="12" y2="16"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">3</span>
                <div>
                  <p className="text-sm">Tap <strong>"Add"</strong> at the top right corner</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Android Chrome Instructions */}
          <div className="p-5 rounded-xl border border-gray-200 bg-transparent">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h2v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
              </svg>
              <h3 className="font-semibold text-gray-700">Android Chrome</h3>
            </div>

            <ol className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">1</span>
                <div>
                  <p className="text-sm">Tap the <strong>Menu</strong> icon (three dots) at the top right</p>
                  <div className="mt-2 inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    {/* Three Dots Vertical Icon */}
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">2</span>
                <div>
                  <p className="text-sm">Select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></p>
                  <div className="mt-2 inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    {/* Mobile with Plus Icon */}
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="8" x2="12" y2="16"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">3</span>
                <div>
                  <p className="text-sm">Confirm by tapping <strong>"Install"</strong></p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
            {/* Info Section */}
      <Card padding="lg" variant="ghost" className="bg-gray-50 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Calendar size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">About Google Calendar Sync</h4>
            <p className="text-sm text-gray-600">
              When connected, new shifts are automatically added to your Google Calendar.
              Updates and deletions are also synced in real-time. Use "Sync All Shifts"
              to add existing shifts that were created before connecting.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Integrations;
