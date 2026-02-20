// src/components/modals/work/DeliveryWorkModal/index.jsx

import { useCallback, useEffect, useState } from 'react';
import { Pen, Plus } from 'lucide-react';
import { useApp } from '../../../../contexts/AppContext';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import BaseModal from '../../base/BaseModal';
import PlatformSelector from '../../../delivery/PlatformSelector';
import VehicleSelector from '../../../delivery/VehicleSelector';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';
import logger from '../../../../utils/logger';

const DeliveryWorkModal = ({ isOpen, onClose, work }) => {
  const { addDeliveryJob, editDeliveryJob } = useApp();
  const isMobile = useIsMobile();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const handleSave = async (deliveryData) => {
    try {
      setLoading(true);
      if (work) {
        await editDeliveryJob(work.id, deliveryData);
      } else {
        await addDeliveryJob(deliveryData);
      }
      setLoading(false);
      onClose();
    } catch (error) {
      logger.error('Error saving delivery work:', error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={work ? 'Edit Delivery Work' : 'New Delivery Work'}
      icon={work ? Pen : Plus}
      loading={loading}
      loadingText="Saving..."
      showFooter={true}
      maxWidth="md"
    >
      <DeliveryWorkFormContent
        work={work}
        onSubmit={handleSave}
        onCancel={handleClose}
        thematicColors={colors}
        isMobile={isMobile}
      />
    </BaseModal>
  );
};

const DeliveryWorkFormContent = ({ work, onSubmit, onCancel, thematicColors, isMobile }) => {
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    vehicle: '',
    description: '',
    avatarColor: '#10B981',
    configuration: {
      calculateByKm: false,
      ratePerKm: 0,
      calculateByOrder: true,
      baseRatePerOrder: 0,
      includeTips: true,
      trackFuel: true
    }
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Function to determine if vehicle needs fuel
  const vehicleNeedsFuel = (vehicle) => {
    const vehicleLower = vehicle.toLowerCase();
    return vehicleLower.includes('motorcycle') ||
           vehicleLower.includes('car');
  };

  useEffect(() => {
    if (work) {
      setFormData({
        name: work.name || '',
        platform: work.platform || '',
        vehicle: work.vehicle || '',
        description: work.description || '',
        avatarColor: work.avatarColor || '#10B981',
        configuration: work.configuration || {
          calculateByKm: false,
          ratePerKm: 0,
          calculateByOrder: true,
          baseRatePerOrder: 0,
          includeTips: true,
          trackFuel: vehicleNeedsFuel(work.vehicle || '')
        }
      });
    }
  }, [work]);

  // Automatically update fuel tracking when vehicle changes
  useEffect(() => {
    if (formData.vehicle) {
      const needsFuel = vehicleNeedsFuel(formData.vehicle);
      setFormData(prev => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          trackFuel: needsFuel
        }
      }));
    }
  }, [formData.vehicle]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.platform) {
      newErrors.platform = 'Select a platform';
    }
    if (!formData.vehicle) {
      newErrors.vehicle = 'Select a vehicle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      logger.error('Error:', error);
      setSaving(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
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
  }, [errors]);

  const handleConfigChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [field]: value
      }
    }));
  };

  // Determine if showing fuel option
  const showFuelOption = vehicleNeedsFuel(formData.vehicle);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}>
      {/* Job Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Job Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`
            w-full border rounded-lg text-sm transition-colors
            ${isMobile ? 'p-3 text-base' : 'p-3'}
            ${errors.name ? 'border-red-500' : 'border-gray-300'}
          `}
          style={{
            '--tw-ring-color': thematicColors.primary,
            borderColor: errors.name ? '#EF4444' : undefined
          }}
          placeholder="e.g., North Zone Delivery"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Platform Selector */}
      <div>
        <PlatformSelector
          selectedPlatform={formData.platform}
          onPlatformSelect={(platform) => handleInputChange('platform', platform)}
        />
        {errors.platform && <p className="text-red-500 text-xs mt-1">{errors.platform}</p>}
      </div>

      {/* Vehicle Selector */}
      <div>
        <VehicleSelector
          selectedVehicle={formData.vehicle}
          onVehicleSelect={(vehicle) => handleInputChange('vehicle', vehicle)}
        />
        {errors.vehicle && <p className="text-red-500 text-xs mt-1">{errors.vehicle}</p>}
      </div>

      {/* Calculation settings */}
      <div
        className="space-y-3 p-4 rounded-lg"
        style={{ backgroundColor: thematicColors.transparent5 }}
      >
        <h3 className="text-sm font-medium text-gray-700">Calculation settings</h3>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.configuration.includeTips}
            onChange={(e) => handleConfigChange('includeTips', e.target.checked)}
            className="rounded w-4 h-4"
            style={{ accentColor: thematicColors.primary }}
          />
          <span className="text-sm">Include tips in record</span>
        </label>

        {/* Only show fuel option if vehicle requires it */}
        {showFuelOption && (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.configuration.trackFuel}
              onChange={(e) => handleConfigChange('trackFuel', e.target.checked)}
              className="rounded w-4 h-4"
              style={{ accentColor: thematicColors.primary }}
            />
            <span className="text-sm">Track fuel expenses</span>
          </label>
        )}

        {/* Informational message for vehicles without fuel */}
        {!showFuelOption && formData.vehicle && (
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
            This vehicle does not require fuel, so related expenses will not be included.
          </div>
        )}
      </div>

      {/* Description (optional) */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`
            w-full border rounded-lg text-sm border-gray-300 resize-none
            ${isMobile ? 'p-3 text-base' : 'p-2'}
          `}
          style={{ '--tw-ring-color': thematicColors.primary }}
          rows={isMobile ? "3" : "2"}
          placeholder="e.g., Delivery job in downtown area..."
        />
      </div>

      {/* Buttons */}
      <div className={`flex pt-4 ${isMobile ? 'flex-col space-y-3' : 'space-x-3'}`}>
        <button
          type="button"
          onClick={onCancel}
          className={`
            border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
            text-sm font-medium rounded-lg transition-colors
            ${isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'}
          `}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`
            text-white rounded-lg hover:opacity-90 text-sm font-medium
            disabled:opacity-50 transition-colors
            ${isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'}
          `}
          style={{ backgroundColor: thematicColors.primary }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.target.style.backgroundColor = thematicColors.primaryDark;
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.target.style.backgroundColor = thematicColors.primary;
            }
          }}
        >
          {saving ? (
            <Flex variant="center" className="space-x-2">
              <LoadingSpinner size="h-4 w-4" color="border-white" />
              <span>Saving...</span>
            </Flex>
          ) : (
            work ? 'Update' : 'Create'
          )}
        </button>
      </div>
    </form>
  );
};

export default DeliveryWorkModal;