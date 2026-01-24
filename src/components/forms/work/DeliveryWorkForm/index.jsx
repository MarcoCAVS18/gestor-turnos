// src/components/forms/DeliveryWorkForm/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** Truck, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** calculateShiftHours, formatHoursDecimal ***REMOVED*** from '../../../../utils/time';

const DeliveryWorkForm = (***REMOVED*** isOpen, onClose, onSubmit, workId = null, initialData = null ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, vehicles = [], deliveryPlatforms = [] ***REMOVED*** = useApp();
  
  const [formData, setFormData] = useState(***REMOVED***
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    workType: 'delivery',
    platform: '',
    vehicle: '',
    orders: 1,
    kilometers: 0,
    earnings: 0,
    tips: 0,
    expenses: 0,
    notes: ''
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  // Calculate worked hours using centralized utility
  const workedHours = formData.startTime && formData.endTime
    ? calculateShiftHours(formData.startTime, formData.endTime)
    : 0;

  useEffect(() => ***REMOVED***
    if (initialData) ***REMOVED***
      setFormData(***REMOVED***
        ...initialData,
        date: initialData.date || new Date().toISOString().split('T')[0]
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [initialData]);

  const validateForm = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;
    
    if (!formData.startTime) newErrors.startTime = 'Required';
    if (!formData.endTime) newErrors.endTime = 'Required';
    if (!formData.platform) newErrors.platform = 'Select a platform';
    if (!formData.vehicle) newErrors.vehicle = 'Select a vehicle';
    if (formData.earnings <= 0) newErrors.earnings = 'Must be greater than 0';
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) ***REMOVED***
      newErrors.endTime = 'Must be after start';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validateForm()) ***REMOVED***
      return;
    ***REMOVED***

    const shiftData = ***REMOVED***
      ...formData,
      id: workId || Date.now().toString(),
      workedHours: workedHours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    ***REMOVED***;

    onSubmit(shiftData);
    onClose();
  ***REMOVED***;

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    
    if (errors[field]) ***REMOVED***
      setErrors(prev => (***REMOVED***
        ...prev,
        [field]: undefined
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***;

  if (!isOpen) return null;

  return (
    <Flex variant="center" className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <Flex variant="between" className="mb-6">
            <h2 className="text-lg font-bold flex items-center">
              <Truck size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
              ***REMOVED***workId ? 'Edit' : 'New'***REMOVED*** Shift
            </h2>
            <button
              onClick=***REMOVED***onClose***REMOVED***
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </Flex>

          <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
            ***REMOVED***/* Date */***REMOVED***
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value=***REMOVED***formData.date***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('date', e.target.value)***REMOVED***
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            ***REMOVED***/* Times */***REMOVED***
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Start</label>
                <input
                  type="time"
                  value=***REMOVED***formData.startTime***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('startTime', e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded-lg text-sm $***REMOVED***errors.startTime ? 'border-red-500' : ''***REMOVED***`***REMOVED***
                />
                ***REMOVED***errors.startTime && <p className="text-red-500 text-xs">***REMOVED***errors.startTime***REMOVED***</p>***REMOVED***
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">End</label>
                <input
                  type="time"
                  value=***REMOVED***formData.endTime***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('endTime', e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded-lg text-sm $***REMOVED***errors.endTime ? 'border-red-500' : ''***REMOVED***`***REMOVED***
                />
                ***REMOVED***errors.endTime && <p className="text-red-500 text-xs">***REMOVED***errors.endTime***REMOVED***</p>***REMOVED***
              </div>
            </div>

            ***REMOVED***/* Time worked */***REMOVED***
            ***REMOVED***workedHours > 0 && (
              <Flex className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                <Clock size=***REMOVED***14***REMOVED*** className="mr-1" />
                Time: ***REMOVED***formatHoursDecimal(workedHours)***REMOVED***
              </Flex>
            )***REMOVED***
            
            ***REMOVED***/* PLATFORM */***REMOVED***
            <div>
              <label className="block text-sm font-medium mb-1">
                🚗 Platform *
              </label>
              <select
                value=***REMOVED***formData.platform***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('platform', e.target.value)***REMOVED***
                className=***REMOVED***`w-full p-3 border rounded-lg text-sm $***REMOVED***errors.platform ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
              >
                <option value="">-- Select Platform --</option>
                ***REMOVED***deliveryPlatforms.map(platform => (
                  <option key=***REMOVED***platform.id***REMOVED*** value=***REMOVED***platform.name***REMOVED***>
                    ***REMOVED***platform.name***REMOVED***
                  </option>
                ))***REMOVED***
              </select>
              ***REMOVED***errors.platform && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.platform***REMOVED***</p>***REMOVED***
            </div>

            ***REMOVED***/* VEHICLE */***REMOVED***
            <div>
              <label className="block text-sm font-medium mb-1">
                🚴 Vehicle *
              </label>
              <select
                value=***REMOVED***formData.vehicle***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('vehicle', e.target.value)***REMOVED***
                className=***REMOVED***`w-full p-3 border rounded-lg text-sm $***REMOVED***errors.vehicle ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
              >
                <option value="">-- Select Vehicle --</option>
                ***REMOVED***vehicles.map(vehicle => (
                  <option key=***REMOVED***vehicle.id***REMOVED*** value=***REMOVED***vehicle.name***REMOVED***>
                    ***REMOVED***vehicle.name***REMOVED***
                  </option>
                ))***REMOVED***
              </select>
              ***REMOVED***errors.vehicle && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.vehicle***REMOVED***</p>***REMOVED***
            </div>
            
            ***REMOVED***/* Orders and Kilometers */***REMOVED***
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Orders</label>
                <input
                  type="number"
                  min="1"
                  value=***REMOVED***formData.orders***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('orders', parseInt(e.target.value) || 1)***REMOVED***
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Km</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value=***REMOVED***formData.kilometers***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('kilometers', parseFloat(e.target.value) || 0)***REMOVED***
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            ***REMOVED***/* Earnings */***REMOVED***
            <div>
              <label className="block text-sm font-medium mb-1">💰 Earnings *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value=***REMOVED***formData.earnings***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('earnings', parseFloat(e.target.value) || 0)***REMOVED***
                className=***REMOVED***`w-full p-2 border rounded-lg text-sm $***REMOVED***errors.earnings ? 'border-red-500' : ''***REMOVED***`***REMOVED***
                placeholder="0.00"
              />
              ***REMOVED***errors.earnings && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.earnings***REMOVED***</p>***REMOVED***
            </div>

            ***REMOVED***/* Tips and Expenses */***REMOVED***
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Tips</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value=***REMOVED***formData.tips***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('tips', parseFloat(e.target.value) || 0)***REMOVED***
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Fuel</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value=***REMOVED***formData.expenses***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('expenses', parseFloat(e.target.value) || 0)***REMOVED***
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            ***REMOVED***/* Buttons */***REMOVED***
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick=***REMOVED***onClose***REMOVED***
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 text-sm"
                style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base || '#3B82F6' ***REMOVED******REMOVED***
              >
                ***REMOVED***workId ? 'Update' : 'Save'***REMOVED***
              </button>
            </div>
          </form>
        </div>
      </div>
    </Flex>
  );
***REMOVED***;

export default DeliveryWorkForm;