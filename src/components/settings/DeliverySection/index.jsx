// src/components/settings/DeliverySection/index.jsx

import { Truck, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Switch from '../../ui/Switch';
import Flex from '../../ui/Flex';
import logger from '../../../utils/logger';

const DeliverySection = ({ id, onError, onSuccess, className }) => {
  const { t } = useTranslation();
  const { deliveryEnabled, savePreferences } = useApp();

  const handleToggle = async (newValue) => {
    try {
      await savePreferences({ deliveryEnabled: newValue });
      onSuccess?.(`Delivery mode ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      logger.error('Error changing delivery setting:', error);
      onError?.('Error changing delivery setting');
    }
  };

  return (
    <SettingsSection id={id} icon={Truck} title={t('settings.delivery.title')} className={className}>
      <div className="space-y-4">
        <Flex variant="between" className="items-start">
          <div className="flex-1 pr-4">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {t(deliveryEnabled ? 'settings.delivery.disable' : 'settings.delivery.enable')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.delivery.subtitle')}
            </p>
          </div>

          <Switch
            checked={deliveryEnabled}
            onChange={handleToggle}
          />
        </Flex>

        {/* Inline info — replaces the old Popover trigger */}
        {deliveryEnabled ? (
          <div className="rounded-lg border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400 mb-1">
              <AlertTriangle size={14} />
              <span>{t('settings.delivery.whatIfDisable')}</span>
            </div>
            <p className="text-amber-800 dark:text-amber-300">
              By disabling this option, the interface will simplify for hourly jobs:
            </p>
            <ul className="space-y-1 text-amber-700 dark:text-amber-400 list-disc pl-4">
              <li>Only statistics for <strong>traditional jobs</strong> will be shown on the dashboard.</li>
              <li>Your previous delivery shifts <strong>will remain visible</strong> in history, but you <strong>won't be able to add new</strong> ones until re-enabled.</li>
            </ul>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 p-3 text-sm space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-200 mb-1">
              <Info size={14} />
              <span>{t('settings.delivery.whatIfEnable')}</span>
            </div>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300 list-disc pl-4">
              <li>Jobs <strong>do not require</strong> a fixed hourly rate.</li>
              <li>You record <strong>total earnings</strong> for each shift.</li>
              <li>Fields for <strong>tips</strong> and order count.</li>
              <li>Detailed tracking of <strong>km and fuel</strong>.</li>
            </ul>
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default DeliverySection;
