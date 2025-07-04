// src/components/modals/ModalTrabajoDelivery/index.jsx

import ***REMOVED*** useCallback, useEffect, useState ***REMOVED*** from 'react';
import ***REMOVED*** X, Truck ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import PlatformSelector from '../../delivery/PlatformSelector';
import VehicleSelector from '../../delivery/VehicleSelector';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../constants/delivery';

const ModalTrabajoDelivery = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajoDelivery, editarTrabajoDelivery, thematicColors ***REMOVED*** = useApp();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil
  useEffect(() => ***REMOVED***
    const checkMobile = () => ***REMOVED***
      setIsMobile(window.innerWidth < 768);
    ***REMOVED***;
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  ***REMOVED***, []);

  // Prevenir scroll del body cuando está abierto
  useEffect(() => ***REMOVED***
    if (isOpen) ***REMOVED***
      document.body.style.overflow = 'hidden';
    ***REMOVED*** else ***REMOVED***
      document.body.style.overflow = 'unset';
    ***REMOVED***
    
    return () => ***REMOVED***
      document.body.style.overflow = 'unset';
    ***REMOVED***;
  ***REMOVED***, [isOpen]);

  const manejarGuardado = async (datosDelivery) => ***REMOVED***
    try ***REMOVED***
      if (trabajo) ***REMOVED***
        await editarTrabajoDelivery(trabajo.id, datosDelivery);
      ***REMOVED*** else ***REMOVED***
        await agregarTrabajoDelivery(datosDelivery);
      ***REMOVED***
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar trabajo delivery:', error);
    ***REMOVED***
  ***REMOVED***;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style=***REMOVED******REMOVED*** zIndex: 9999 ***REMOVED******REMOVED***
    >
      <div 
        className=***REMOVED***`
          bg-white shadow-2xl w-full relative
          $***REMOVED***isMobile 
            ? 'h-full max-w-none rounded-none' 
            : 'max-w-md max-h-[90vh] rounded-lg'
          ***REMOVED***
          $***REMOVED***isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'***REMOVED***
        `***REMOVED***
      >
        ***REMOVED***/* Header fijo con z-index correcto */***REMOVED***
        <div 
          className=***REMOVED***`
            sticky top-0 bg-white border-b flex justify-between items-center
            $***REMOVED***isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            zIndex: 10,
            borderBottomColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)'
          ***REMOVED******REMOVED***
        >
          <h2 
            className=***REMOVED***`font-semibold flex items-center $***REMOVED***isMobile ? 'text-lg' : 'text-xl'***REMOVED***`***REMOVED***
          >
            <Truck 
              size=***REMOVED***20***REMOVED*** 
              style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** 
              className="mr-2" 
            />
            <span style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***>
              ***REMOVED***trabajo ? 'Editar' : 'Nuevo'***REMOVED*** Trabajo Delivery
            </span>
          </h2>
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style=***REMOVED******REMOVED***
              backgroundColor: 'transparent',
              color: thematicColors?.base || '#EC4899'
            ***REMOVED******REMOVED***
            onMouseEnter=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)';
            ***REMOVED******REMOVED***
            onMouseLeave=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = 'transparent';
            ***REMOVED******REMOVED***
          >
            <X size=***REMOVED***isMobile ? 24 : 20***REMOVED*** />
          </button>
        </div>

        ***REMOVED***/* Content scrolleable */***REMOVED***
        <div className=***REMOVED***`
          $***REMOVED***isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'***REMOVED***
        `***REMOVED***>
          <TrabajoDeliveryFormContent
            trabajo=***REMOVED***trabajo***REMOVED***
            onSubmit=***REMOVED***manejarGuardado***REMOVED***
            onCancel=***REMOVED***onClose***REMOVED***
            thematicColors=***REMOVED***thematicColors***REMOVED***
            isMobile=***REMOVED***isMobile***REMOVED***
          />
        </div>

        ***REMOVED***/* Footer indicador en móvil */***REMOVED***
        ***REMOVED***isMobile && (
          <div 
            className="sticky bottom-0 bg-white border-t p-2"
            style=***REMOVED******REMOVED*** 
              borderTopColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)',
              zIndex: 10
            ***REMOVED******REMOVED***
          >
            <div className="flex justify-center">
              <div 
                className="w-10 h-1 rounded-full"
                style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent50 || 'rgba(236, 72, 153, 0.5)' ***REMOVED******REMOVED***
              />
            </div>
          </div>
        )***REMOVED***
      </div>
    </div>
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
          rastreaCombustible: true
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [trabajo]);

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

  // Obtener el color de la plataforma seleccionada
  const plataformaSeleccionada = DELIVERY_PLATFORMS_AUSTRALIA.find(
    p => p.nombre === formData.plataforma
  );

  useEffect(() => ***REMOVED*** 
    if (plataformaSeleccionada && !trabajo) ***REMOVED***
      handleInputChange('colorAvatar', plataformaSeleccionada.color);
    ***REMOVED***
  ***REMOVED***, [plataformaSeleccionada, trabajo, handleInputChange]);

  return (
    <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className=***REMOVED***`space-y-4 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***>
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
            '--tw-ring-color': thematicColors?.base,
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
        className="space-y-3 p-3 rounded-lg"
        style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 || 'rgba(0,0,0,0.05)' ***REMOVED******REMOVED***
      >
        <h3 className="text-sm font-medium text-gray-700">Configuración de cálculos</h3>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked=***REMOVED***formData.configuracion.incluyePropinas***REMOVED***
            onChange=***REMOVED***(e) => handleConfigChange('incluyePropinas', e.target.checked)***REMOVED***
            className="rounded"
            style=***REMOVED******REMOVED*** accentColor: thematicColors?.base ***REMOVED******REMOVED***
          />
          <span className="text-sm">Incluir propinas en el registro</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked=***REMOVED***formData.configuracion.rastreaCombustible***REMOVED***
            onChange=***REMOVED***(e) => handleConfigChange('rastreaCombustible', e.target.checked)***REMOVED***
            className="rounded"
            style=***REMOVED******REMOVED*** accentColor: thematicColors?.base ***REMOVED******REMOVED***
          />
          <span className="text-sm">Rastrear gastos de combustible</span>
        </label>
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
            w-full border rounded-lg text-sm border-gray-300
            $***REMOVED***isMobile ? 'p-3 text-base' : 'p-2'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': thematicColors?.base ***REMOVED******REMOVED***
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
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base || '#3B82F6' ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            if (!guardando && thematicColors?.dark) ***REMOVED***
              e.target.style.backgroundColor = thematicColors.dark;
            ***REMOVED***
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            if (!guardando) ***REMOVED***
              e.target.style.backgroundColor = thematicColors?.base || '#3B82F6';
            ***REMOVED***
          ***REMOVED******REMOVED***
        >
          ***REMOVED***guardando ? (
            <div className="flex items-center justify-center space-x-2">
              <div 
                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
              />
              <span>Guardando...</span>
            </div>
          ) : (
            trabajo ? 'Actualizar' : 'Crear'
          )***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default ModalTrabajoDelivery;