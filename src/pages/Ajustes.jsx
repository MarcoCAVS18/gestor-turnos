// src/pages/Ajustes.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
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
    <div className="px-4 py-6 space-y-6">
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

      ***REMOVED***/* LAYOUT RESPONSIVO PRINCIPAL */***REMOVED***
      <div className="space-y-6">

        ***REMOVED***/* DESKTOP: Grid dinámico con diferentes distribuciones */***REMOVED***
        <div className="hidden lg:block space-y-6">

          ***REMOVED***/* PRIMERA FILA: 3 columnas con contenedores verticales */***REMOVED***
          <div className="grid grid-cols-3 gap-6">
            ***REMOVED***/* CONTENEDOR 1: Foto de perfil + Perfil + Objetivos */***REMOVED***
            <div className="space-y-6">
              <ProfilePhotoSection
                onError=***REMOVED***handleError***REMOVED***
                onSuccess=***REMOVED***handleSuccess***REMOVED***
              />
              <ProfileSection
                onError=***REMOVED***handleError***REMOVED***
                onSuccess=***REMOVED***handleSuccess***REMOVED***
              />
              <GoalsSection />
            </div>

            ***REMOVED***/* CONTENEDOR 2: Personalización */***REMOVED***
            <div className="space-y-6">
              <CustomizationSection />
            </div>

            ***REMOVED***/* CONTENEDOR 3: Configuración de trabajo + Delivery */***REMOVED***
            <div className="space-y-6">
              <PreferencesSection
                onError=***REMOVED***handleError***REMOVED***
                onSuccess=***REMOVED***handleSuccess***REMOVED***
              />
              <DeliverySection />
            </div>
          </div>

          ***REMOVED***/* SEGUNDA FILA: 2 columnas - Smoko + Rango de Turnos */***REMOVED***
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <SmokoSection
                onError=***REMOVED***handleError***REMOVED***
                onSuccess=***REMOVED***handleSuccess***REMOVED***
              />
            </div>

            <TurnRangeSection
              onError=***REMOVED***handleError***REMOVED***
              onSuccess=***REMOVED***handleSuccess***REMOVED***
            />
          </div>

          ***REMOVED***/* TERCERA FILA: Sesión (full width) */***REMOVED***
          <SessionSection
            onError=***REMOVED***handleError***REMOVED***
          />

        </div>

        ***REMOVED***/* MÓVIL: Stack vertical */***REMOVED***
        <div className="block lg:hidden space-y-6">
          <ProfilePhotoSection
            onError=***REMOVED***handleError***REMOVED***
            onSuccess=***REMOVED***handleSuccess***REMOVED***
          />

          <ProfileSection
            onError=***REMOVED***handleError***REMOVED***
            onSuccess=***REMOVED***handleSuccess***REMOVED***
          />

          <CustomizationSection />

          <DeliverySection />

          <SmokoSection
            onError=***REMOVED***handleError***REMOVED***
            onSuccess=***REMOVED***handleSuccess***REMOVED***
          />

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

      </div>

      <FooterSection />
    </div>
  );
***REMOVED***;

export default Ajustes;