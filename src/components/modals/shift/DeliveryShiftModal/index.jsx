// src/components/modals/shift/DeliveryShiftModal/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Modal ***REMOVED*** from '../../ui/Modal';
import ***REMOVED*** ThemeInput ***REMOVED*** from '../../ui/ThemeInput';
import ***REMOVED*** DollarSign, Heart, Package, Navigation, Fuel ***REMOVED*** from 'lucide-react';


const DeliveryShiftModal = (***REMOVED*** isOpen, onClose, shift ***REMOVED***) => ***REMOVED***
  const [formData, setFormData] = useState(***REMOVED***
    date: '',
    startTime: '',
    endTime: '',
    totalEarnings: '',
    tips: '',
    orderCount: '',
    kilometers: '',
    fuelExpense: ''
  ***REMOVED***);

  return (
    <Modal isOpen=***REMOVED***isOpen***REMOVED*** onClose=***REMOVED***onClose***REMOVED*** title="Delivery Shift">
      <form className="space-y-4">
        ***REMOVED***/* Date and time fields same as normal shift */***REMOVED***
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Earnings details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ThemeInput
              label="Total earnings"
              icon=***REMOVED***DollarSign***REMOVED***
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
            
            <ThemeInput
              label="Tips"
              icon=***REMOVED***Heart***REMOVED***
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <ThemeInput
            label="Order count"
            icon=***REMOVED***Package***REMOVED***
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
              icon=***REMOVED***Navigation***REMOVED***
              type="number"
              step="0.1"
              placeholder="0.0"
            />
            
            <ThemeInput
              label="Fuel expenses"
              icon=***REMOVED***Fuel***REMOVED***
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
***REMOVED***;

export default DeliveryShiftModal;