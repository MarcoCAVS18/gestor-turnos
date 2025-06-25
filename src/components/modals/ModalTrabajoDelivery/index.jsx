// src/components/modals/ModalTrabajoDelivery/index.jsx

import React, ***REMOVED*** useCallback, useEffect, useState ***REMOVED*** from 'react'; // Added useCallback, useEffect, useState explicitly
import ***REMOVED*** X, Truck ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import PlatformSelector from '../../delivery/PlatformSelector';
import VehicleSelector from '../../delivery/VehicleSelector';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../constants/delivery';

const ModalTrabajoDelivery = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajoDelivery, editarTrabajoDelivery, coloresTemáticos ***REMOVED*** = useApp();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Truck size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            ***REMOVED***trabajo ? 'Editar' : 'Nuevo'***REMOVED*** Trabajo Delivery
          </h2>
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size=***REMOVED***20***REMOVED*** />
          </button>
        </div>

        <div className="p-4">
          <TrabajoDeliveryFormContent
            trabajo=***REMOVED***trabajo***REMOVED***
            onSubmit=***REMOVED***manejarGuardado***REMOVED***
            onCancel=***REMOVED***onClose***REMOVED***
            coloresTemáticos=***REMOVED***coloresTemáticos***REMOVED***
          />
        </div>
      </div>
    </div>
  );
***REMOVED***;

const TrabajoDeliveryFormContent = (***REMOVED*** trabajo, onSubmit, onCancel, coloresTemáticos ***REMOVED***) => ***REMOVED***
  const [formData, setFormData] = useState(***REMOVED*** // Changed React.useState to useState
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

  const [errors, setErrors] = useState(***REMOVED******REMOVED***); // Changed React.useState to useState
  const [guardando, setGuardando] = useState(false); // Changed React.useState to useState

  useEffect(() => ***REMOVED*** // Changed React.useEffect to useEffect
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

  // Wrap handleInputChange in useCallback
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
  ***REMOVED***, [errors]); // `errors` is a dependency here because it's used inside the function.

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

  useEffect(() => ***REMOVED*** // Changed React.useEffect to useEffect
    if (plataformaSeleccionada && !trabajo) ***REMOVED***
      handleInputChange('colorAvatar', plataformaSeleccionada.color);
    ***REMOVED***
  ***REMOVED***, [plataformaSeleccionada, trabajo, handleInputChange]);

  return (
    <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
      ***REMOVED***/* Nombre del trabajo */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del trabajo
        </label>
        <input
          type="text"
          value=***REMOVED***formData.nombre***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('nombre', e.target.value)***REMOVED***
          className=***REMOVED***`w-full p-3 border rounded-lg text-sm $***REMOVED***errors.nombre ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
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
      <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700">Configuración de cálculos</h3>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked=***REMOVED***formData.configuracion.incluyePropinas***REMOVED***
            onChange=***REMOVED***(e) => handleConfigChange('incluyePropinas', e.target.checked)***REMOVED***
            className="rounded"
          />
          <span className="text-sm">Incluir propinas en el registro</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked=***REMOVED***formData.configuracion.rastreaCombustible***REMOVED***
            onChange=***REMOVED***(e) => handleConfigChange('rastreaCombustible', e.target.checked)***REMOVED***
            className="rounded"
          />
          <span className="text-sm">Rastrear gastos de combustible</span>
        </label>
      </div>

      ***REMOVED***/* Descripción opcional */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción (opcional)
        </label>
        <textarea
          value=***REMOVED***formData.descripcion***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('descripcion', e.target.value)***REMOVED***
          className="w-full p-2 border rounded-lg text-sm border-gray-300"
          rows="2"
          placeholder="ej: Trabajo de delivery en zona céntrica..."
        />
      </div>

      ***REMOVED***/* Botones */***REMOVED***
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
          disabled=***REMOVED***guardando***REMOVED***
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled=***REMOVED***guardando***REMOVED***
          className="flex-1 py-3 px-4 text-white rounded-lg hover:opacity-90 text-sm font-medium disabled:opacity-50"
          style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base || '#3B82F6' ***REMOVED******REMOVED***
        >
          ***REMOVED***guardando ? 'Guardando...' : (trabajo ? 'Actualizar' : 'Crear')***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default ModalTrabajoDelivery;