// ModalTrabajoDelivery - Refactorizado con BaseModal

import { useCallback, useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { useApp } from '../../../../contexts/AppContext';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import BaseModal from '../../base/BaseModal';
import PlatformSelector from '../../../delivery/PlatformSelector';
import VehicleSelector from '../../../delivery/VehicleSelector';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';

const ModalTrabajoDelivery = ({ isOpen, onClose, trabajo }) => {
  const { addDeliveryJob, editDeliveryJob } = useApp();
  const isMobile = useIsMobile();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);

  const manejarGuardado = async (datosDelivery) => {
    try {
      setLoading(true);
      if (trabajo) {
        await editDeliveryJob(trabajo.id, datosDelivery);
      } else {
        await addDeliveryJob(datosDelivery);
      }
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error al guardar trabajo delivery:', error);
      setLoading(false);
    }
  };

  const manejarCerrar = () => {
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={manejarCerrar}
      title={
        <div className="flex items-center">
          <Truck size={20} style={{ color: colors.primary }} className="mr-2" />
          <span>{trabajo ? 'Editar' : 'Nuevo'} Trabajo Delivery</span>
        </div>
      }
      loading={loading}
      loadingText="Guardando..."
      showFooter={true}
      maxWidth="md"
    >
      <TrabajoDeliveryFormContent
        trabajo={trabajo}
        onSubmit={manejarGuardado}
        onCancel={manejarCerrar}
        thematicColors={colors}
        isMobile={isMobile}
      />
    </BaseModal>
  );
};

const TrabajoDeliveryFormContent = ({ trabajo, onSubmit, onCancel, thematicColors, isMobile }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    plataforma: '',
    vehiculo: '',
    descripcion: '',
    colorAvatar: '#10B981',
    configuracion: {
      calculaPorKm: false,
      tarifaPorKm: 0,
      calculaPorPedido: true,
      tarifaBasePedido: 0,
      incluyePropinas: true,
      rastreaCombustible: true
    }
  });

  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Función para determinar si el vehículo necesita combustible
  const vehiculoNecesitaCombustible = (vehiculo) => {
    const vehiculoLower = vehiculo.toLowerCase();
    return vehiculoLower.includes('moto') ||
           vehiculoLower.includes('auto') ||
           vehiculoLower.includes('carro') ||
           vehiculoLower.includes('coche');
  };

  useEffect(() => {
    if (trabajo) {
      setFormData({
        nombre: trabajo.nombre || '',
        plataforma: trabajo.plataforma || '',
        vehiculo: trabajo.vehiculo || '',
        descripcion: trabajo.descripcion || '',
        colorAvatar: trabajo.colorAvatar || '#10B981',
        configuracion: trabajo.configuracion || {
          calculaPorKm: false,
          tarifaPorKm: 0,
          calculaPorPedido: true,
          tarifaBasePedido: 0,
          incluyePropinas: true,
          rastreaCombustible: vehiculoNecesitaCombustible(trabajo.vehiculo || '')
        }
      });
    }
  }, [trabajo]);

  // Actualizar automáticamente el rastreo de combustible cuando cambia el vehículo
  useEffect(() => {
    if (formData.vehiculo) {
      const necesitaCombustible = vehiculoNecesitaCombustible(formData.vehiculo);
      setFormData(prev => ({
        ...prev,
        configuracion: {
          ...prev.configuracion,
          rastreaCombustible: necesitaCombustible
        }
      }));
    }
  }, [formData.vehiculo]);

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.plataforma) {
      newErrors.plataforma = 'Selecciona una plataforma';
    }
    if (!formData.vehiculo) {
      newErrors.vehiculo = 'Selecciona un vehículo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
      setGuardando(false);
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
      configuracion: {
        ...prev.configuracion,
        [field]: value
      }
    }));
  };

  // Determinar si mostrar la opción de combustible
  const mostrarOpcionCombustible = vehiculoNecesitaCombustible(formData.vehiculo);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}>
      {/* Nombre del trabajo */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre del trabajo
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          className={`
            w-full border rounded-lg text-sm transition-colors
            ${isMobile ? 'p-3 text-base' : 'p-3'}
            ${errors.nombre ? 'border-red-500' : 'border-gray-300'}
          `}
          style={{
            '--tw-ring-color': thematicColors.primary,
            borderColor: errors.nombre ? '#EF4444' : undefined
          }}
          placeholder="ej: Delivery Zona Norte"
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
      </div>

      {/* Selector de plataforma */}
      <div>
        <PlatformSelector
          selectedPlatform={formData.plataforma}
          onPlatformSelect={(plataforma) => handleInputChange('plataforma', plataforma)}
        />
        {errors.plataforma && <p className="text-red-500 text-xs mt-1">{errors.plataforma}</p>}
      </div>

      {/* Selector de vehículo */}
      <div>
        <VehicleSelector
          selectedVehicle={formData.vehiculo}
          onVehicleSelect={(vehiculo) => handleInputChange('vehiculo', vehiculo)}
        />
        {errors.vehiculo && <p className="text-red-500 text-xs mt-1">{errors.vehiculo}</p>}
      </div>

      {/* Configuración de cálculos */}
      <div
        className="space-y-3 p-4 rounded-lg"
        style={{ backgroundColor: thematicColors.transparent5 }}
      >
        <h3 className="text-sm font-medium text-gray-700">Configuración de cálculos</h3>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.configuracion.incluyePropinas}
            onChange={(e) => handleConfigChange('incluyePropinas', e.target.checked)}
            className="rounded w-4 h-4"
            style={{ accentColor: thematicColors.primary }}
          />
          <span className="text-sm">Incluir propinas en el registro</span>
        </label>

        {/* Solo mostrar opción de combustible si el vehículo lo requiere */}
        {mostrarOpcionCombustible && (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.configuracion.rastreaCombustible}
              onChange={(e) => handleConfigChange('rastreaCombustible', e.target.checked)}
              className="rounded w-4 h-4"
              style={{ accentColor: thematicColors.primary }}
            />
            <span className="text-sm">Rastrear gastos de combustible</span>
          </label>
        )}

        {/* Mensaje informativo para vehículos sin combustible */}
        {!mostrarOpcionCombustible && formData.vehiculo && (
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
            💡 Este vehículo no requiere combustible, por lo que no se incluirán gastos relacionados.
          </div>
        )}
      </div>

      {/* Descripción opcional */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción (opcional)
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          className={`
            w-full border rounded-lg text-sm border-gray-300 resize-none
            ${isMobile ? 'p-3 text-base' : 'p-2'}
          `}
          style={{ '--tw-ring-color': thematicColors.primary }}
          rows={isMobile ? "3" : "2"}
          placeholder="ej: Trabajo de delivery en zona céntrica..."
        />
      </div>

      {/* Botones */}
      <div className={`flex pt-4 ${isMobile ? 'flex-col space-y-3' : 'space-x-3'}`}>
        <button
          type="button"
          onClick={onCancel}
          className={`
            border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
            text-sm font-medium rounded-lg transition-colors
            ${isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'}
          `}
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className={`
            text-white rounded-lg hover:opacity-90 text-sm font-medium
            disabled:opacity-50 transition-colors
            ${isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'}
          `}
          style={{ backgroundColor: thematicColors.primary }}
          onMouseEnter={(e) => {
            if (!guardando) {
              e.target.style.backgroundColor = thematicColors.primaryDark;
            }
          }}
          onMouseLeave={(e) => {
            if (!guardando) {
              e.target.style.backgroundColor = thematicColors.primary;
            }
          }}
        >
          {guardando ? (
            <Flex variant="center" className="space-x-2">
              <LoadingSpinner size="h-4 w-4" color="border-white" />
              <span>Guardando...</span>
            </Flex>
          ) : (
            trabajo ? 'Actualizar' : 'Crear'
          )}
        </button>
      </div>
    </form>
  );
};

export default ModalTrabajoDelivery;
