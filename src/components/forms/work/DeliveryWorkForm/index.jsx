// src/components/forms/DeliveryWorkForm/index.jsx

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { Truck, Clock } from 'lucide-react';
import { calculateShiftHours, formatHoursDecimal } from '../../../../utils/time';

const DeliveryWorkForm = ({ isOpen, onClose, onSubmit, workId = null, initialData = null }) => {
  const { thematicColors, vehicles = [], deliveryPlatforms = [] } = useApp();
  
  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({});

  // Calculate worked hours using centralized utility
  const workedHours = formData.startTime && formData.endTime
    ? calculateShiftHours(formData.startTime, formData.endTime)
    : 0;

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date || new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.startTime) newErrors.startTime = 'Required';
    if (!formData.endTime) newErrors.endTime = 'Required';
    if (!formData.platform) newErrors.platform = 'Select a platform';
    if (!formData.vehicle) newErrors.vehicle = 'Select a vehicle';
    if (formData.earnings <= 0) newErrors.earnings = 'Must be greater than 0';
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Must be after start';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const shiftData = {
      ...formData,
      id: workId || Date.now().toString(),
      workedHours: workedHours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(shiftData);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <Flex variant="center" className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <Flex variant="between" className="mb-6">
            <h2 className="text-lg font-bold flex items-center">
              <Truck size={20} style={{ color: thematicColors?.base }} className="mr-2" />
              {workId ? 'Edit' : 'New'} Shift
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </Flex>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Start</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className={`w-full p-2 border rounded-lg text-sm ${errors.startTime ? 'border-red-500' : ''}`}
                />
                {errors.startTime && <p className="text-red-500 text-xs">{errors.startTime}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">End</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className={`w-full p-2 border rounded-lg text-sm ${errors.endTime ? 'border-red-500' : ''}`}
                />
                {errors.endTime && <p className="text-red-500 text-xs">{errors.endTime}</p>}
              </div>
            </div>

            {/* Time worked */}
            {workedHours > 0 && (
              <Flex className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                <Clock size={14} className="mr-1" />
                Time: {formatHoursDecimal(workedHours)}
              </Flex>
            )}
            
            {/* PLATFORM */}
            <div>
              <label className="block text-sm font-medium mb-1">
                🚗 Platform *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className={`w-full p-3 border rounded-lg text-sm ${errors.platform ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Select Platform --</option>
                {deliveryPlatforms.map(platform => (
                  <option key={platform.id} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
              {errors.platform && <p className="text-red-500 text-xs mt-1">{errors.platform}</p>}
            </div>

            {/* VEHICLE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                🚴 Vehicle *
              </label>
              <select
                value={formData.vehicle}
                onChange={(e) => handleInputChange('vehicle', e.target.value)}
                className={`w-full p-3 border rounded-lg text-sm ${errors.vehicle ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Select Vehicle --</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.name}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
              {errors.vehicle && <p className="text-red-500 text-xs mt-1">{errors.vehicle}</p>}
            </div>
            
            {/* Orders and Kilometers */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Orders</label>
                <input
                  type="number"
                  min="1"
                  value={formData.orders}
                  onChange={(e) => handleInputChange('orders', parseInt(e.target.value) || 1)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Km</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.kilometers}
                  onChange={(e) => handleInputChange('kilometers', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Earnings */}
            <div>
              <label className="block text-sm font-medium mb-1">💰 Earnings *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.earnings}
                onChange={(e) => handleInputChange('earnings', parseFloat(e.target.value) || 0)}
                className={`w-full p-2 border rounded-lg text-sm ${errors.earnings ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.earnings && <p className="text-red-500 text-xs mt-1">{errors.earnings}</p>}
            </div>

            {/* Tips and Expenses */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Tips</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.tips}
                  onChange={(e) => handleInputChange('tips', parseFloat(e.target.value) || 0)}
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
                  value={formData.expenses}
                  onChange={(e) => handleInputChange('expenses', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 text-sm"
                style={{ backgroundColor: thematicColors?.base || '#3B82F6' }}
              >
                {workId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Flex>
  );
};

export default DeliveryWorkForm;