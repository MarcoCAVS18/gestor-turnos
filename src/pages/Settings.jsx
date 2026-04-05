// src/pages/Settings.jsx

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import DeliveryPlatformsSection from '../components/settings/DeliveryPlatformsSection';
import SmokoSection from '../components/settings/SmokoSection';
import HolidaySettingsSection from '../components/settings/HolidaySettingsSection';
import IntegrationsBanner from '../components/settings/IntegrationsBanner';
import SettingsOnboardingModal from '../components/modals/SettingsOnboardingModal';

import { useApp } from '../contexts/AppContext';
import { detectUserLocation } from '../services/holidayService';
import { requestNotificationPermission } from '../services/native/nativeNotifications';

const Settings = () => {
  const { t } = useTranslation();
  const { deliveryEnabled, holidayCountry } = useApp();
  const isAustraliaMode = holidayCountry === 'AU';
  const [permissionsUpdated, setPermissionsUpdated] = useState(0);

  // Handle native permission requests after onboarding modal closes
  const handleOnboardingComplete = async () => {
    // Request location permission
    try {
      await detectUserLocation();
    } catch {
      // User denied or error - silent fail, they can configure manually
    }
    
    // Request notification permission
    try {
      await requestNotificationPermission();
    } catch {
      // User denied or error - silent fail
    }
    
    // Trigger re-render of components to reflect new permissions
    setPermissionsUpdated(prev => prev + 1);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <Helmet>
        <title>Settings - Orary</title>
        <meta name="description" content="Configure your Orary preferences, pay rates, currency, and account settings." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <PageHeader
        title={t('nav.settings')}
        subtitle={t('settings.subtitle')}
        icon={SettingsIcon}
      />

      {/* MAIN CONTAINER WITH FULL HEIGHT */}
      <div className="h-full">
        {/* MAIN RESPONSIVE LAYOUT */}
        <div className="space-y-6">

          {/* DESKTOP: Dynamic grid with different distributions */}
          <div className="hidden lg:block space-y-6">

            {/* FIRST ROW: 3 columns with vertical containers */}
            <div className="grid grid-cols-3 gap-6">
              {/* CONTAINER 1: Profile Photo + Profile + Holiday + Goals + Work Configuration */}
              <div className="flex flex-col gap-6 h-full">
                <ProfilePhotoSection
                  className="flex-grow"
                />
                <ProfileSection
                  className="flex-grow"
                />
                <HolidaySettingsSection
                  key={`holiday-${permissionsUpdated}`}
                  className="flex-grow"
                />
                <GoalsSection className="flex-grow" />
                <PreferencesSection className="flex-grow" />
              </div>

              {/* CONTAINER 2: Integrations Banner + Customization + Smoko + Session */}
              <div className="flex flex-col gap-6 h-full">
                <IntegrationsBanner className="flex-grow" />
                <CustomizationSection className="flex-grow" />
                <SmokoSection className="flex-grow" />
                <SessionSection
                  className="flex-grow"
                />
              </div>

              {/* CONTAINER 3: Delivery + Platforms + Shift Range */}
              <div className="flex flex-col gap-6 h-full">
                <DeliverySection className="flex-grow" />
                <div className={!deliveryEnabled && !isAustraliaMode ? 'opacity-40 pointer-events-none' : ''}>
                  <DeliveryPlatformsSection className="flex-grow" />
                </div>
                <TurnRangeSection className="flex-grow" />
              </div>
            </div>

          </div>

          {/* MOBILE: Vertical stack */}
          <div className="block lg:hidden space-y-6">
            <IntegrationsBanner />
            <ProfilePhotoSection
            />

            <ProfileSection
            />

            <HolidaySettingsSection key={`holiday-${permissionsUpdated}`} />

            <CustomizationSection />

            <DeliverySection />

            <div className={!deliveryEnabled && !isAustraliaMode ? 'opacity-40 pointer-events-none' : ''}>
              <DeliveryPlatformsSection />
            </div>

            <SmokoSection />

            <GoalsSection />

            <TurnRangeSection />

            <PreferencesSection />

            <SessionSection
            />
          </div>
        </div>
      </div>

      <FooterSection />

      {/* Settings onboarding modal - shown once after demos */}
      <SettingsOnboardingModal onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default Settings;
