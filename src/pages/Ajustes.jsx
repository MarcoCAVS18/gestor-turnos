// src/pages/Ajustes.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ProfileSection from '../components/settings/ProfileSection';
import CustomizationSection from '../components/settings/CustomizationSection';
import TurnRangeSection from '../components/settings/TurnRangeSection';
import GoalsSection from '../components/settings/GoalsSection';
import PreferencesSection from '../components/settings/PreferencesSection';
import SessionSection from '../components/settings/SessionSection';
import NotificationBanner from '../components/ui/NotificationBanner';
import DeliverySection from '../components/settings/DeliverySection';

const Ajustes = () => ***REMOVED***
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSuccess = (msg) => ***REMOVED***
    setMessage(msg);
    setError('');
    setTimeout(() => setMessage(''), 4000);
  ***REMOVED***;

  const handleError = (err) => ***REMOVED***
    setError(err);
    setMessage('');
    setTimeout(() => setError(''), 6000);
  ***REMOVED***;

  const clearMessages = () => ***REMOVED***
    setMessage('');
    setError('');
  ***REMOVED***;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Ajustes</h1>
      
      <NotificationBanner 
        message=***REMOVED***message***REMOVED*** 
        type="success" 
        onClose=***REMOVED***clearMessages***REMOVED*** 
      />
      
      <NotificationBanner 
        message=***REMOVED***error***REMOVED*** 
        type="error" 
        onClose=***REMOVED***clearMessages***REMOVED*** 
      />
      
      <ProfileSection 
        onError=***REMOVED***handleError***REMOVED*** 
        onSuccess=***REMOVED***handleSuccess***REMOVED*** 
      />
      
      <CustomizationSection />

      <DeliverySection />

      <GoalsSection />
      
      <TurnRangeSection 
        onError=***REMOVED***handleError***REMOVED*** 
        onSuccess=***REMOVED***handleSuccess***REMOVED*** 
      />
      
      <PreferencesSection 
        onError=***REMOVED***handleError***REMOVED*** 
        onSuccess=***REMOVED***handleSuccess***REMOVED*** 
      />
      
      <SessionSection 
        onError=***REMOVED***handleError***REMOVED*** 
      />
    </div>
  );
***REMOVED***;

export default Ajustes;