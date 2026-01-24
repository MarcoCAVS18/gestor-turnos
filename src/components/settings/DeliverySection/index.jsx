// src/components/settings/DeliverySection/index.jsx 

import React from 'react';
import ***REMOVED*** Truck, Info, AlertTriangle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Switch from '../../ui/Switch';
import Popover from '../../ui/Popover';
import Flex from '../../ui/Flex';

const DeliverySection = (***REMOVED*** onError, onSuccess, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** deliveryEnabled, savePreferences ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  const handleToggle = async (newValue) => ***REMOVED***
    try ***REMOVED***
      await savePreferences(***REMOVED*** deliveryEnabled: newValue ***REMOVED***);
      onSuccess?.(`Delivery mode $***REMOVED***newValue ? 'enabled' : 'disabled'***REMOVED***`);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error changing delivery setting:', error);
      onError?.('Error changing delivery setting');
    ***REMOVED***
  ***REMOVED***;

  // Conditional content for Popover
  const popoverContent = deliveryEnabled ? (
    // CONTENT IF DEACTIVATING
    <div className="p-2 max-w-xs text-sm">
      <p className="mb-2 text-gray-700">
        By disabling this option, the interface will simplify for hourly jobs:
      </p>
      <ul className="space-y-2 text-gray-600 list-disc pl-4">
        <li>
          Only statistics for <strong>traditional jobs</strong> will be shown on the dashboard.
        </li>
        <li className="text-amber-700 bg-amber-50 p-1 rounded -ml-1 pl-4 border-l-2 border-amber-500">
          <strong>Note:</strong> Your previous delivery shifts <strong>will remain visible</strong> in history, but you <strong>won't be able to add new</strong> ones until re-enabled.
        </li>
      </ul>
    </div>
  ) : (
    // CONTENT IF ENABLING
    <div className="p-2 max-w-xs text-sm">
      <p className="mb-2 text-gray-700">
        <strong>Delivery mode</strong> adapts the application for delivery jobs (Gig Economy):
      </p>
      <ul className="space-y-1.5 text-gray-600 list-disc pl-4">
        <li>Jobs <strong>do not require</strong> a fixed hourly rate.</li>
        <li>You record <strong>total earnings</strong> for each shift.</li>
        <li>Fields for <strong>tips</strong> and order count.</li>
        <li>Detailed tracking of <strong>km and fuel</strong>.</li>
      </ul>
    </div>
  );

  return (
    <SettingsSection icon=***REMOVED***Truck***REMOVED*** title="Delivery Jobs" className=***REMOVED***className***REMOVED***>
      <div className="space-y-4">
        <Flex variant="between" className="items-start">
          <div className="flex-1 pr-4">
            <p className="font-medium text-gray-900">
              ***REMOVED***deliveryEnabled ? 'Disable delivery mode' : 'Enable delivery mode'***REMOVED***
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Allows registering delivery jobs with variable earnings.
            </p>

            <Popover 
              content=***REMOVED***popoverContent***REMOVED*** 
              title=***REMOVED***deliveryEnabled ? "Consequences of disabling" : "How it works?"***REMOVED***
              position="bottom-start"
            >
              <button 
                className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80 focus:outline-none"
                style=***REMOVED******REMOVED*** color: deliveryEnabled ? colors.warning : colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***deliveryEnabled ? <AlertTriangle size=***REMOVED***14***REMOVED*** /> : <Info size=***REMOVED***14***REMOVED*** />***REMOVED***
                <span>
                  ***REMOVED***deliveryEnabled 
                    ? 'What happens if I disable it?' 
                    : 'What changes when I enable it?'***REMOVED***
                </span>
              </button>
            </Popover>
          </div>
          
          <Switch
            checked=***REMOVED***deliveryEnabled***REMOVED***
            onChange=***REMOVED***handleToggle***REMOVED***
          />
        </Flex>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default DeliverySection;