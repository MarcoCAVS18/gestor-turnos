// src/pages/Ajustes.jsx

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
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
import ChangeLog from '../components/changelog/ChangeLog';

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
      <PageHeader
        title="Ajustes"
        subtitle="Personaliza tu experiencia y gestiona tu cuenta"
        icon={Settings}
      />

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

      {/* CONTENEDOR PRINCIPAL CON ALTURA COMPLETA */}
      <div className="h-full">
        {/* LAYOUT RESPONSIVO PRINCIPAL */}
        <div className="space-y-6">

          {/* DESKTOP: Grid dinámico con diferentes distribuciones */}
          <div className="hidden lg:block space-y-6">

            {/* PRIMERA FILA: 3 columnas con contenedores verticales */}
            <div className="grid grid-cols-3 gap-6">
              {/* CONTENEDOR 1: Foto de perfil + Perfil + Objetivos + Configuración de trabajo */}
              <div className="space-y-6 h-full">
                <ProfilePhotoSection
                  onError={handleError}
                  onSuccess={handleSuccess}
                />
                <ProfileSection
                  onError={handleError}
                  onSuccess={handleSuccess}
                />
                <GoalsSection />
                <PreferencesSection
                  onError={handleError}
                  onSuccess={handleSuccess}
                />
              </div>

              {/* CONTENEDOR 2: Personalización + Smoko + Sesión */}
              <div className="flex flex-col gap-3 h-full">
                <CustomizationSection />
                <SmokoSection
                  onError={handleError}
                  onSuccess={handleSuccess}
                />
                <SessionSection
                  className="flex-grow"
                  onError={handleError}
                />
              </div>

              {/* CONTENEDOR 3: Delivery + Rango de Turnos */}
              <div className="space-y-6 h-full">
                <DeliverySection />
                <TurnRangeSection
                  onError={handleError}
                  onSuccess={handleSuccess}
                />
              </div>
            </div>

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
          <ChangeLog />
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default Ajustes;