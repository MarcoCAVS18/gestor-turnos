// src/pages/Integrations.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Puzzle,
  Bell,
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
  Smartphone,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Switch from '../components/ui/Switch';
import Button from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

// Cloud Functions base URL - always use production URL
// Local emulator would be: http://localhost:5001/gestionturnos-7ec99/us-central1
const FUNCTIONS_URL = 'https://us-central1-gestionturnos-7ec99.cloudfunctions.net';

const Integrations = () => {
  const { thematicColors } = useApp();
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
      navigate('/integraciones', { replace: true });
    } else if (calendarStatus === 'error') {
      setGoogleCalendar(prev => ({
        ...prev,
        error: 'Failed to connect. Please try again.',
        loading: false,
        initialLoading: false
      }));
      navigate('/integraciones', { replace: true });
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
          setGoogleCalendar(prev => ({
            ...prev,
            connected: data.googleCalendarConnected || false,
            loading: false,
            initialLoading: false
          }));
        } else {
          setGoogleCalendar(prev => ({ ...prev, loading: false, initialLoading: false }));
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

      const { synced, total } = await response.json();

      setGoogleCalendar(prev => ({
        ...prev,
        syncing: false,
        syncMessage: `Synced ${synced} of ${total} shifts`
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
      {/* Back link */}
      <Link
        to="/settings"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Settings
      </Link>

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
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Remind me</span>
                <select
                  value={shiftReminders.minutesBefore}
                  onChange={(e) => setShiftReminders(prev => ({
                    ...prev,
                    minutesBefore: parseInt(e.target.value)
                  }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
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
              <div className="space-y-2">
                {/* Sync button */}
                <Button
                  variant="secondary"
                  icon={googleCalendar.syncing ? Loader2 : RefreshCw}
                  onClick={handleSyncAllShifts}
                  disabled={googleCalendar.syncing}
                  className={`w-full justify-center ${googleCalendar.syncing ? 'animate-pulse' : ''}`}
                >
                  {googleCalendar.syncing ? 'Syncing...' : 'Sync All Shifts'}
                </Button>

                {/* Disconnect button */}
                <Button
                  variant="ghost"
                  icon={ExternalLink}
                  onClick={handleGoogleCalendarDisconnect}
                  disabled={googleCalendar.loading}
                  className="w-full justify-center text-gray-500 hover:text-red-500"
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
                {googleCalendar.loading ? 'Connecting...' : 'Connect Google Calendar'}
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
