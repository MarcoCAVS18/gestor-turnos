// ModalTrabajoDelivery - Refactorizado con BaseModal

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

const ModalTrabajoDelivery = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** addDeliveryJob, editDeliveryJob ***REMOVED*** = useApp();
  const isMobile = useIsMobile();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const manejarGuardado = async (datosDelivery) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      if (trabajo) ***REMOVED***
        await editDeliveryJob(trabajo.id, datosDelivery);
      ***REMOVED*** else ***REMOVED***
        await addDeliveryJob(datosDelivery);
      ***REMOVED***
      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar trabajo delivery:', error);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const manejarCerrar = () => ***REMOVED***
    setLoading(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***manejarCerrar***REMOVED***
      title=***REMOVED***trabajo ? 'Editar Trabajo Delivery' : 'Nuevo Trabajo Delivery'***REMOVED***
      icon=***REMOVED***trabajo ? Pen : Plus***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      loadingText="Guardando..."
      showFooter=***REMOVED***true***REMOVED***
      maxWidth="md"
    >
      <TrabajoDeliveryFormContent
        trabajo=***REMOVED***trabajo***REMOVED***
        onSubmit=***REMOVED***manejarGuardado***REMOVED***
        onCancel=***REMOVED***manejarCerrar***REMOVED***
        thematicColors=***REMOVED***colors***REMOVED***
        isMobile=***REMOVED***isMobile***REMOVED***
      />
    </BaseModal>
  );
***REMOVED***;

const TrabajoDeliveryFormContent = (***REMOVED*** trabajo, onSubmit, onCancel, thematicColors, isMobile ***REMOVED***) => ***REMOVED***
  const [formData, setFormData] = useState(***REMOVED***
    nombre: '',
    plataforma: '',
    vehiculo: '',
    descripcion: '',
    colorAvatar: '#10B981',
    configuracion: ***REMOVED***
      calculaPorKm: false,
      tarifaPorKm: 0,
      calculaPorPedido: true,
      tarifaBasePedido: 0,
      incluyePropinas: true,
      rastreaCombustible: true
    ***REMOVED***
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);
  const [guardando, setGuardando] = useState(false);

  // Función para determinar si el vehículo necesita combustible
  const vehiculoNecesitaCombustible = (vehiculo) => ***REMOVED***
    const vehiculoLower = vehiculo.toLowerCase();
    return vehiculoLower.includes('moto') ||
           vehiculoLower.includes('auto') ||
           vehiculoLower.includes('carro') ||
           vehiculoLower.includes('coche');
  ***REMOVED***;

  useEffect(() => ***REMOVED***
    if (trabajo) ***REMOVED***
      setFormData(***REMOVED***
        nombre: trabajo.nombre || '',
        plataforma: trabajo.plataforma || '',
        vehiculo: trabajo.vehiculo || '',
        descripcion: trabajo.descripcion || '',
        colorAvatar: trabajo.colorAvatar || '#10B981',
        configuracion: trabajo.configuracion || ***REMOVED***
          calculaPorKm: false,
          tarifaPorKm: 0,
          calculaPorPedido: true,
          tarifaBasePedido: 0,
          incluyePropinas: true,
          rastreaCombustible: vehiculoNecesitaCombustible(trabajo.vehiculo || '')
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [trabajo]);

  // Actualizar automáticamente el rastreo de combustible cuando cambia el vehículo
  useEffect(() => ***REMOVED***
    if (formData.vehiculo) ***REMOVED***
      const necesitaCombustible = vehiculoNecesitaCombustible(formData.vehiculo);
      setFormData(prev => (***REMOVED***
        ...prev,
        configuracion: ***REMOVED***
          ...prev.configuracion,
          rastreaCombustible: necesitaCombustible
        ***REMOVED***
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [formData.vehiculo]);

  const validarFormulario = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;

    if (!formData.nombre.trim()) ***REMOVED***
      newErrors.nombre = 'El nombre es requerido';
    ***REMOVED***
    if (!formData.plataforma) ***REMOVED***
      newErrors.plataforma = 'Selecciona una plataforma';
    ***REMOVED***
    if (!formData.vehiculo) ***REMOVED***
      newErrors.vehiculo = 'Selecciona un vehículo';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();

    if (!validarFormulario()) ***REMOVED***
      return;
    ***REMOVED***

    setGuardando(true);

    try ***REMOVED***
      await onSubmit(formData);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error:', error);
      setGuardando(false);
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
      configuracion: ***REMOVED***
        ...prev.configuracion,
        [field]: value
      ***REMOVED***
    ***REMOVED***));
  ***REMOVED***;

  // Determinar si mostrar la opción de combustible
  const mostrarOpcionCombustible = vehiculoNecesitaCombustible(formData.vehiculo);

  return (
    <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***>
      ***REMOVED***/* Nombre del trabajo */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre del trabajo
        </label>
        <input
          type="text"
          value=***REMOVED***formData.nombre***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('nombre', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg text-sm transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'p-3'***REMOVED***
            $***REMOVED***errors.nombre ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': thematicColors.primary,
            borderColor: errors.nombre ? '#EF4444' : undefined
          ***REMOVED******REMOVED***
          placeholder="ej: Delivery Zona Norte"
        />
        ***REMOVED***errors.nombre && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.nombre***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* Selector de plataforma */***REMOVED***
      <div>
        <PlatformSelector
          selectedPlatform=***REMOVED***formData.plataforma***REMOVED***
          onPlatformSelect=***REMOVED***(plataforma) => handleInputChange('plataforma', plataforma)***REMOVED***
        />
        ***REMOVED***errors.plataforma && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.plataforma***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* Selector de vehículo */***REMOVED***
      <div>
        <VehicleSelector
          selectedVehicle=***REMOVED***formData.vehiculo***REMOVED***
          onVehicleSelect=***REMOVED***(vehiculo) => handleInputChange('vehiculo', vehiculo)***REMOVED***
        />
        ***REMOVED***errors.vehiculo && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.vehiculo***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* Configuración de cálculos */***REMOVED***
      <div
        className="space-y-3 p-4 rounded-lg"
        style=***REMOVED******REMOVED*** backgroundColor: thematicColors.transparent5 ***REMOVED******REMOVED***
      >
        <h3 className="text-sm font-medium text-gray-700">Configuración de cálculos</h3>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked=***REMOVED***formData.configuracion.incluyePropinas***REMOVED***
            onChange=***REMOVED***(e) => handleConfigChange('incluyePropinas', e.target.checked)***REMOVED***
            className="rounded w-4 h-4"
            style=***REMOVED******REMOVED*** accentColor: thematicColors.primary ***REMOVED******REMOVED***
          />
          <span className="text-sm">Incluir propinas en el registro</span>
        </label>

        ***REMOVED***/* Solo mostrar opción de combustible si el vehículo lo requiere */***REMOVED***
        ***REMOVED***mostrarOpcionCombustible && (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked=***REMOVED***formData.configuracion.rastreaCombustible***REMOVED***
              onChange=***REMOVED***(e) => handleConfigChange('rastreaCombustible', e.target.checked)***REMOVED***
              className="rounded w-4 h-4"
              style=***REMOVED******REMOVED*** accentColor: thematicColors.primary ***REMOVED******REMOVED***
            />
            <span className="text-sm">Rastrear gastos de combustible</span>
          </label>
        )***REMOVED***

        ***REMOVED***/* Mensaje informativo para vehículos sin combustible */***REMOVED***
        ***REMOVED***!mostrarOpcionCombustible && formData.vehiculo && (
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
            Este vehículo no requiere combustible, por lo que no se incluirán gastos relacionados.
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Descripción opcional */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción (opcional)
        </label>
        <textarea
          value=***REMOVED***formData.descripcion***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('descripcion', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg text-sm border-gray-300 resize-none
            $***REMOVED***isMobile ? 'p-3 text-base' : 'p-2'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': thematicColors.primary ***REMOVED******REMOVED***
          rows=***REMOVED***isMobile ? "3" : "2"***REMOVED***
          placeholder="ej: Trabajo de delivery en zona céntrica..."
        />
      </div>

      ***REMOVED***/* Botones */***REMOVED***
      <div className=***REMOVED***`flex pt-4 $***REMOVED***isMobile ? 'flex-col space-y-3' : 'space-x-3'***REMOVED***`***REMOVED***>
        <button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          className=***REMOVED***`
            border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
            text-sm font-medium rounded-lg transition-colors
            $***REMOVED***isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'***REMOVED***
          `***REMOVED***
          disabled=***REMOVED***guardando***REMOVED***
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled=***REMOVED***guardando***REMOVED***
          className=***REMOVED***`
            text-white rounded-lg hover:opacity-90 text-sm font-medium
            disabled:opacity-50 transition-colors
            $***REMOVED***isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors.primary ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            if (!guardando) ***REMOVED***
              e.target.style.backgroundColor = thematicColors.primaryDark;
            ***REMOVED***
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            if (!guardando) ***REMOVED***
              e.target.style.backgroundColor = thematicColors.primary;
            ***REMOVED***
          ***REMOVED******REMOVED***
        >
          ***REMOVED***guardando ? (
            <Flex variant="center" className="space-x-2">
              <LoadingSpinner size="h-4 w-4" color="border-white" />
              <span>Guardando...</span>
            </Flex>
          ) : (
            trabajo ? 'Actualizar' : 'Crear'
          )***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default ModalTrabajoDelivery;
