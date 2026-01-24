// src/components/modals/shift/DeliveryShiftModal/index.jsx

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { ThemeInput } from '../../ui/ThemeInput';
import { DollarSign, Heart, Package, Navigation, Fuel } from 'lucide-react';


const DeliveryShiftModal = ({ isOpen, onClose, shift }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delivery Shift">
      <form className="space-y-4">
        {/* Date and time fields same as normal shift */}
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Earnings details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label="Total earnings"
              icon={DollarSign}
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
            
            <ThemeInput
              label="Tips"
              icon={Heart}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <ThemeInput
            label="Order count"
            icon={Package}
            type="number"
            placeholder="0"
            className="mt-4"
          />
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Additional data (optional)</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label="Kilometers driven"
              icon={Navigation}
              type="number"
              step="0.1"
              placeholder="0.0"
            />
            
            <ThemeInput
              label="Fuel expenses"
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