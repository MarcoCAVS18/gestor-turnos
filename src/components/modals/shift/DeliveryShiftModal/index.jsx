// src/components/modals/shift/DeliveryShiftModal/index.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../ui/Modal';
import { ThemeInput } from '../../ui/ThemeInput';
import { DollarSign, Heart, Package, Navigation, Fuel } from 'lucide-react';

const DeliveryShiftModal = ({ isOpen, onClose, shift }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    totalEarnings: '',
    tips: '',
    orderCount: '',
    kilometers: '',
    fuelExpense: ''
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.shift.deliveryTitle')}>
      <form className="space-y-4">
        {/* Date and time fields same as normal shift */}
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">{t('modals.shift.earningsDetails')}</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label={t('modals.shift.totalEarnings')}
              icon={DollarSign}
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
            
            <ThemeInput
              label={t('modals.shift.tips')}
              icon={Heart}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <ThemeInput
            label={t('modals.shift.orderCount')}
            icon={Package}
            type="number"
            placeholder="0"
            className="mt-4"
          />
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">{t('modals.shift.additionalData')}</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label={t('modals.shift.kilometers')}
              icon={Navigation}
              type="number"
              step="0.1"
              placeholder="0.0"
            />
            
            <ThemeInput
              label={t('modals.shift.fuelExpenses')}
              icon={Fuel}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DeliveryShiftModal;
