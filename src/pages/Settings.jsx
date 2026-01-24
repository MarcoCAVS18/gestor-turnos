// src/pages/Settings.jsx

import ***REMOVED*** Settings ***REMOVED*** from 'lucide-react';
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

const Settings = () => ***REMOVED***
  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Customize your experience and manage your account"
        icon=***REMOVED***Settings***REMOVED***
      />

      ***REMOVED***/* MAIN CONTAINER WITH FULL HEIGHT */***REMOVED***
      <div className="h-full">
        ***REMOVED***/* MAIN RESPONSIVE LAYOUT */***REMOVED***
        <div className="space-y-6">

          ***REMOVED***/* DESKTOP: Dynamic grid with different distributions */***REMOVED***
          <div className="hidden lg:block space-y-6">

            ***REMOVED***/* FIRST ROW: 3 columns with vertical containers */***REMOVED***
            <div className="grid grid-cols-3 gap-6">
              ***REMOVED***/* CONTAINER 1: Profile Photo + Profile + Goals + Work Configuration */***REMOVED***
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

              ***REMOVED***/* CONTAINER 2: Integrations Banner + Customization + Smoko + Session */***REMOVED***
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

              ***REMOVED***/* CONTAINER 3: Delivery + Shift Range */***REMOVED***
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

          ***REMOVED***/* MOBILE: Vertical stack */***REMOVED***
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
***REMOVED***;

export default Settings;