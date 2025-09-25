// src/pages/Ajustes.jsx

import React, { useState } from 'react';
import ProfileSection from '../components/settings/ProfileSection';
import CustomizationSection from '../components/settings/CustomizationSection';
import TurnRangeSection from '../components/settings/TurnRangeSection';
import GoalsSection from '../components/settings/GoalsSection';
import PreferencesSection from '../components/settings/PreferencesSection';
import SessionSection from '../components/settings/SessionSection';
import FooterSection from '../components/settings/FooterSection'; 
import NotificationBanner from '../components/ui/NotificationBanner';
import DeliverySection from '../components/settings/DeliverySection';
import SmokoSection from '../components/settings/SmokoSection'; // NUEVO

const Ajustes = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSuccess = (msg) => {
    setMessage(msg);
    setError('');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleError = (err) => {
    setError(err);
    setMessage('');
    setTimeout(() => setError(''), 6000);
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Ajustes</h1>
      
      <NotificationBanner 
        message={message} 
        type="success" 
        onClose={clearMessages} 
      />
      
      <NotificationBanner 
        message={error} 
        type="error" 
        onClose={clearMessages} 
      />
      
      <ProfileSection 
        onError={handleError} 
        onSuccess={handleSuccess} 
      />
      
      <CustomizationSection />

      <DeliverySection />

      <SmokoSection 
        onError={handleError} 
        onSuccess={handleSuccess} 
      />

      <GoalsSection />
      
      <TurnRangeSection 
        onError={handleError} 
        onSuccess={handleSuccess} 
      />
      
      <PreferencesSection 
        onError={handleError} 
        onSuccess={handleSuccess} 
      />
      
      <SessionSection 
        onError={handleError} 
      />

      <FooterSection />
    </div>
  );
};

export default Ajustes;