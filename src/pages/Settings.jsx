// src/pages/Settings.jsx

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
import IntegrationsBanner from '../components/settings/IntegrationsBanner';
import { useApp } from '../contexts/AppContext';

const Settings = () => {
  const { deliveryEnabled } = useApp();
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
              {/* CONTAINER 1: Profile Photo + Profile + Goals + Work Configuration */}
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

              {/* CONTAINER 2: Integrations Banner + Customization + Smoko + Session */}
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

              {/* CONTAINER 3: Delivery + Platforms + Shift Range */}
              <div className="flex flex-col gap-6 h-full">
                <DeliverySection
                  className="flex-grow"
                />
                {deliveryEnabled && (
                  <DeliveryPlatformsSection
                    className="flex-grow"
                  />
                )}
                <TurnRangeSection
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

            <CustomizationSection />

            <DeliverySection />

            {deliveryEnabled && (
              <DeliveryPlatformsSection />
            )}

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

export default Settings;