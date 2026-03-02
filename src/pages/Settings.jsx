// src/pages/Settings.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
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
import OnboardingSpotlight from '../components/onboarding/OnboardingSpotlight';
import { useApp } from '../contexts/AppContext';

const Settings = () => {
  const { deliveryEnabled } = useApp();
  const location = useLocation();

  // Scroll to section based on URL hash (with retry for late renders)
  useEffect(() => {
    if (!location.hash) return;
    const elementId = location.hash.replace('#', '');

    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }
      return false;
    };

    // Try immediately, then retry once after the page has rendered
    if (!scrollToElement()) {
      const timer = setTimeout(scrollToElement, 350);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);
  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Customize your experience and manage your account"
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
                  id="settings-holiday"
                  className="flex-grow"
                />
                <GoalsSection className="flex-grow" />
                <PreferencesSection
                  id="settings-preferences"
                  className="flex-grow"
                />
              </div>

              {/* CONTAINER 2: Integrations Banner + Customization + Smoko + Session */}
              <div className="flex flex-col gap-6 h-full">
                <IntegrationsBanner className="flex-grow" />
                <CustomizationSection id="settings-customization" className="flex-grow" />
                <SmokoSection
                  id="settings-smoko"
                  className="flex-grow"
                />
                <SessionSection
                  className="flex-grow"
                />
              </div>

              {/* CONTAINER 3: Delivery + Platforms + Shift Range */}
              <div className="flex flex-col gap-6 h-full">
                <DeliverySection
                  id="settings-delivery"
                  className="flex-grow"
                />
                <div className={!deliveryEnabled ? 'opacity-40 pointer-events-none' : ''}>
                  <DeliveryPlatformsSection className="flex-grow" />
                </div>
                <TurnRangeSection
                  id="settings-turnrange"
                  className="flex-grow"
                />
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

            <HolidaySettingsSection id="settings-holiday" />

            <CustomizationSection id="settings-customization" />

            <DeliverySection id="settings-delivery" />

            <div className={!deliveryEnabled ? 'opacity-40 pointer-events-none' : ''}>
              <DeliveryPlatformsSection />
            </div>

            <SmokoSection id="settings-smoko" />

            <GoalsSection />

            <TurnRangeSection id="settings-turnrange" />

            <PreferencesSection id="settings-preferences" />

            <SessionSection
            />
          </div>
        </div>
      </div>

      <FooterSection />

      {/* Onboarding spotlight wizard — renders null when inactive */}
      <OnboardingSpotlight />
    </div>
  );
};

export default Settings;