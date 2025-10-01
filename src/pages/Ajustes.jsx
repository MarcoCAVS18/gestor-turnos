// src/pages/Ajustes.jsx

import React, { useState } from 'react';
import ProfileSection from '../components/settings/ProfileSection';
import ProfilePhotoSection from '../components/settings/ProfilePhotoSection';
import CustomizationSection from '../components/settings/CustomizationSection';
import TurnRangeSection from '../components/settings/TurnRangeSection';
import GoalsSection from '../components/settings/GoalsSection';
import PreferencesSection from '../components/settings/PreferencesSection';
import SessionSection from '../components/settings/SessionSection';
import FooterSection from '../components/settings/FooterSection';
import NotificationBanner from '../components/ui/NotificationBanner';
import DeliverySection from '../components/settings/DeliverySection';
import SmokoSection from '../components/settings/SmokoSection';

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
    <div className="px-4 py-6 space-y-6">
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

      {/* LAYOUT RESPONSIVO PRINCIPAL */}
      <div className="space-y-6">

        {/* DESKTOP: Grid dinámico con diferentes distribuciones */}
        <div className="hidden lg:block space-y-6">

          {/* PRIMERA FILA: 3 columnas con contenedores verticales */}
          <div className="grid grid-cols-3 gap-6">
            {/* CONTENEDOR 1: Foto de perfil + Perfil + Objetivos */}
            <div className="space-y-6">
              <ProfilePhotoSection
                onError={handleError}
                onSuccess={handleSuccess}
              />
              <ProfileSection
                onError={handleError}
                onSuccess={handleSuccess}
              />
              <GoalsSection />
            </div>

            {/* CONTENEDOR 2: Personalización */}
            <div className="space-y-6">
              <CustomizationSection />
            </div>

            {/* CONTENEDOR 3: Configuración de trabajo + Delivery */}
            <div className="space-y-6">
              <PreferencesSection
                onError={handleError}
                onSuccess={handleSuccess}
              />
              <DeliverySection />
            </div>
          </div>

          {/* SEGUNDA FILA: 2 columnas - Smoko + Rango de Turnos */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <SmokoSection
                onError={handleError}
                onSuccess={handleSuccess}
              />
            </div>

            <TurnRangeSection
              onError={handleError}
              onSuccess={handleSuccess}
            />
          </div>

          {/* TERCERA FILA: Sesión (full width) */}
          <SessionSection
            onError={handleError}
          />

        </div>

        {/* MÓVIL: Stack vertical */}
        <div className="block lg:hidden space-y-6">
          <ProfilePhotoSection
            onError={handleError}
            onSuccess={handleSuccess}
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
        </div>

      </div>

      <FooterSection />
    </div>
  );
};

export default Ajustes;