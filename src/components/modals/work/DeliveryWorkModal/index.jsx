// src/components/modals/work/DeliveryWorkModal/index.jsx

import ***REMOVED*** useCallback, useEffect, useState ***REMOVED*** from 'react';
import ***REMOVED*** Pen, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import BaseModal from '../../base/BaseModal';
import PlatformSelector from '../../../delivery/PlatformSelector';
import VehicleSelector from '../../../delivery/VehicleSelector';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';

const DeliveryWorkModal = (***REMOVED*** isOpen, onClose, work ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** addDeliveryJob, editDeliveryJob ***REMOVED*** = useApp();
  const isMobile = useIsMobile();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const handleSave = async (deliveryData) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      if (work) ***REMOVED***
        await editDeliveryJob(work.id, deliveryData);
      ***REMOVED*** else ***REMOVED***
        await addDeliveryJob(deliveryData);
      ***REMOVED***
      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error saving delivery work:', error);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleClose = () => ***REMOVED***
    setLoading(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***handleClose***REMOVED***
      title=***REMOVED***work ? 'Edit Delivery Work' : 'New Delivery Work'***REMOVED***
      icon=***REMOVED***work ? Pen : Plus***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      loadingText="Saving..."
      showFooter=***REMOVED***true***REMOVED***
      maxWidth="md"
    >
      <DeliveryWorkFormContent
        work=***REMOVED***work***REMOVED***
        onSubmit=***REMOVED***handleSave***REMOVED***
        onCancel=***REMOVED***handleClose***REMOVED***
        thematicColors=***REMOVED***colors***REMOVED***
        isMobile=***REMOVED***isMobile***REMOVED***
      />
    </BaseModal>
  );
***REMOVED***;

const DeliveryWorkFormContent = (***REMOVED*** work, onSubmit, onCancel, thematicColors, isMobile ***REMOVED***) => ***REMOVED***
  const [formData, setFormData] = useState(***REMOVED***
    name: '',
    platform: '',
    vehicle: '',
    description: '',
    avatarColor: '#10B981',
    configuration: ***REMOVED***
      calculateByKm: false,
      ratePerKm: 0,
      calculateByOrder: true,
      baseRatePerOrder: 0,
      includeTips: true,
      trackFuel: true
    ***REMOVED***
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);
  const [saving, setSaving] = useState(false);

  // Function to determine if vehicle needs fuel
  const vehicleNeedsFuel = (vehicle) => ***REMOVED***
    const vehicleLower = vehicle.toLowerCase();
    return vehicleLower.includes('motorcycle') ||
           vehicleLower.includes('car');
  ***REMOVED***;

  useEffect(() => ***REMOVED***
    if (work) ***REMOVED***
      setFormData(***REMOVED***
        name: work.name || '',
        platform: work.platform || '',
        vehicle: work.vehicle || '',
        description: work.description || '',
        avatarColor: work.avatarColor || '#10B981',
        configuration: work.configuration || ***REMOVED***
          calculateByKm: false,
          ratePerKm: 0,
          calculateByOrder: true,
          baseRatePerOrder: 0,
          includeTips: true,
          trackFuel: vehicleNeedsFuel(work.vehicle || '')
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [work]);

  // Automatically update fuel tracking when vehicle changes
  useEffect(() => ***REMOVED***
    if (formData.vehicle) ***REMOVED***
      const needsFuel = vehicleNeedsFuel(formData.vehicle);
      setFormData(prev => (***REMOVED***
        ...prev,
        configuration: ***REMOVED***
          ...prev.configuration,
          trackFuel: needsFuel
        ***REMOVED***
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [formData.vehicle]);

  const validateForm = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;

    if (!formData.name.trim()) ***REMOVED***
      newErrors.name = 'Name is required';
    ***REMOVED***
    if (!formData.platform) ***REMOVED***
      newErrors.platform = 'Select a platform';
    ***REMOVED***
    if (!formData.vehicle) ***REMOVED***
      newErrors.vehicle = 'Select a vehicle';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();

    if (!validateForm()) ***REMOVED***
      return;
    ***REMOVED***

    setSaving(true);

    try ***REMOVED***
      await onSubmit(formData);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error:', error);
      setSaving(false);
    ***REMOVED***
  ***REMOVED***;

  const handleInputChange = useCallback((field, value) => ***REMOVED***
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
  ***REMOVED***, [errors]);

  const handleConfigChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      configuration: ***REMOVED***
        ...prev.configuration,
        [field]: value
      ***REMOVED***
    ***REMOVED***));
  ***REMOVED***;

  // Determine if showing fuel option
  const showFuelOption = vehicleNeedsFuel(formData.vehicle);

  return (
    <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***>
      ***REMOVED***/* Job Name */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-2">
          Job Name
        </label>
        <input
          type="text"
          value=***REMOVED***formData.name***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('name', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg text-sm transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'p-3'***REMOVED***
            $***REMOVED***errors.name ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': thematicColors.primary,
            borderColor: errors.name ? '#EF4444' : undefined
          ***REMOVED******REMOVED***
          placeholder="e.g., North Zone Delivery"
        />
        ***REMOVED***errors.name && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.name***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* Platform Selector */***REMOVED***
      <div>
        <PlatformSelector
          selectedPlatform=***REMOVED***formData.platform***REMOVED***
          onPlatformSelect=***REMOVED***(platform) => handleInputChange('platform', platform)***REMOVED***
        />
        ***REMOVED***errors.platform && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.platform***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* Vehicle Selector */***REMOVED***
      <div>
        <VehicleSelector
          selectedVehicle=***REMOVED***formData.vehicle***REMOVED***
          onVehicleSelect=***REMOVED***(vehicle) => handleInputChange('vehicle', vehicle)***REMOVED***
        />
        ***REMOVED***errors.vehicle && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.vehicle***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* Calculation settings */***REMOVED***
      <div
        className="space-y-3 p-4 rounded-lg"
        style=***REMOVED******REMOVED*** backgroundColor: thematicColors.transparent5 ***REMOVED******REMOVED***
      >
        <h3 className="text-sm font-medium text-gray-700">Calculation settings</h3>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked=***REMOVED***formData.configuration.includeTips***REMOVED***
            onChange=***REMOVED***(e) => handleConfigChange('includeTips', e.target.checked)***REMOVED***
            className="rounded w-4 h-4"
            style=***REMOVED******REMOVED*** accentColor: thematicColors.primary ***REMOVED******REMOVED***
          />
          <span className="text-sm">Include tips in record</span>
        </label>

        ***REMOVED***/* Only show fuel option if vehicle requires it */***REMOVED***
        ***REMOVED***showFuelOption && (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked=***REMOVED***formData.configuration.trackFuel***REMOVED***
              onChange=***REMOVED***(e) => handleConfigChange('trackFuel', e.target.checked)***REMOVED***
              className="rounded w-4 h-4"
              style=***REMOVED******REMOVED*** accentColor: thematicColors.primary ***REMOVED******REMOVED***
            />
            <span className="text-sm">Track fuel expenses</span>
          </label>
        )***REMOVED***

        ***REMOVED***/* Informational message for vehicles without fuel */***REMOVED***
        ***REMOVED***!showFuelOption && formData.vehicle && (
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
            This vehicle does not require fuel, so related expenses will not be included.
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Description (optional) */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-2">
          Description (optional)
        </label>
        <textarea
          value=***REMOVED***formData.description***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('description', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg text-sm border-gray-300 resize-none
            $***REMOVED***isMobile ? 'p-3 text-base' : 'p-2'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': thematicColors.primary ***REMOVED******REMOVED***
          rows=***REMOVED***isMobile ? "3" : "2"***REMOVED***
          placeholder="e.g., Delivery job in downtown area..."
        />
      </div>

      ***REMOVED***/* Buttons */***REMOVED***
      <div className=***REMOVED***`flex pt-4 $***REMOVED***isMobile ? 'flex-col space-y-3' : 'space-x-3'***REMOVED***`***REMOVED***>
        <button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          className=***REMOVED***`
            border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
            text-sm font-medium rounded-lg transition-colors
            $***REMOVED***isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'***REMOVED***
          `***REMOVED***
          disabled=***REMOVED***saving***REMOVED***
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled=***REMOVED***saving***REMOVED***
          className=***REMOVED***`
            text-white rounded-lg hover:opacity-90 text-sm font-medium
            disabled:opacity-50 transition-colors
            $***REMOVED***isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors.primary ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            if (!saving) ***REMOVED***
              e.target.style.backgroundColor = thematicColors.primaryDark;
            ***REMOVED***
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            if (!saving) ***REMOVED***
              e.target.style.backgroundColor = thematicColors.primary;
            ***REMOVED***
          ***REMOVED******REMOVED***
        >
          ***REMOVED***saving ? (
            <Flex variant="center" className="space-x-2">
              <LoadingSpinner size="h-4 w-4" color="border-white" />
              <span>Saving...</span>
            </Flex>
          ) : (
            work ? 'Update' : 'Create'
          )***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default DeliveryWorkModal;