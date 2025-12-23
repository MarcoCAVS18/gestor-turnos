// src/pages/Ajustes.jsx

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
import DeliverySection from '../components/settings/DeliverySection';
import SmokoSection from '../components/settings/SmokoSection';
import IntegrationsBanner from '../components/settings/IntegrationsBanner';

const Ajustes = () => {
  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title="Ajustes"
        subtitle="Personaliza tu experiencia y gestiona tu cuenta"
        icon={Settings}
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
              <div className="flex flex-col gap-6 h-full">
                <ProfilePhotoSection
                  className="flex-grow"
                />
                <ProfileSection
                  className="flex-grow"
                />
                <GoalsSection className="flex-grow" />
                <PreferencesSection
                  className="flex-grow"
                />
              </div>

              {/* CONTENEDOR 2: Banner de Integraciones + Personalización + Smoko + Sesión */}
              <div className="flex flex-col gap-6 h-full">
                <IntegrationsBanner className="flex-grow" />
                <CustomizationSection className="flex-grow" />
                <SmokoSection
                  className="flex-grow"
                />
                <SessionSection
                  className="flex-grow"
                />
              </div>

              {/* CONTENEDOR 3: Delivery + Rango de Turnos */}
              <div className="flex flex-col gap-6 h-full">
                <DeliverySection
                  className="flex-grow"
                />
                <TurnRangeSection
                  className="flex-grow"
                />
              </div>
            </div>

          </div>

          {/* MÓVIL: Stack vertical */}
          <div className="block lg:hidden space-y-6">
            <IntegrationsBanner />
            <ProfilePhotoSection
            />

            <ProfileSection
            />

            <CustomizationSection />

            <DeliverySection />

            <SmokoSection
            />

            <GoalsSection />

            <TurnRangeSection
            />

            <PreferencesSection
            />

            <SessionSection
            />
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default Ajustes;