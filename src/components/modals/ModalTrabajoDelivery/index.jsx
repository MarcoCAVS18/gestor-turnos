import { useCallback, useEffect, useState } from 'react';
import { X, Truck } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import PlatformSelector from '../../delivery/PlatformSelector';
import VehicleSelector from '../../delivery/VehicleSelector';

const ModalTrabajoDelivery = ({ isOpen, onClose, trabajo }) => {
  // CORRECCIÓN: Usamos los nombres exactos que exporta el contexto
  const { addDeliveryJob, editDeliveryJob, thematicColors } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const manejarGuardado = async (datosDelivery) => {
    try {
      if (trabajo) {
        await editDeliveryJob(trabajo.id, datosDelivery);
      } else {
        // CORRECCIÓN: Llamamos a la función con el nombre correcto `addDeliveryJob`
        await addDeliveryJob(datosDelivery);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar trabajo delivery:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className={`bg-white shadow-2xl w-full relative ${isMobile ? 'h-full max-w-none rounded-none overflow-hidden flex flex-col' : 'max-w-md max-h-[90vh] rounded-lg overflow-y-auto'}`}>
        <div className={`sticky top-0 bg-white border-b flex justify-between items-center z-10 ${isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'}`} style={{ borderBottomColor: thematicColors?.transparent20 }}>
          <h2 className={`font-semibold flex items-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <Truck size={20} style={{ color: thematicColors?.base }} className="mr-2" />
            <span style={{ color: thematicColors?.base }}>{trabajo ? 'Editar' : 'Nuevo'} Trabajo Delivery</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors flex-shrink-0" style={{ color: thematicColors?.base }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = thematicColors?.transparent10; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'}`}>
          <div className="max-w-[420px] mx-auto w-full">
            <TrabajoDeliveryFormContent trabajo={trabajo} onSubmit={manejarGuardado} onCancel={onClose} thematicColors={thematicColors} isMobile={isMobile} />
          </div>
        </div>

        {isMobile && (
          <div className="sticky bottom-0 bg-white border-t p-2 z-10" style={{ borderTopColor: thematicColors?.transparent20 }}>
            <div className="flex justify-center"><div className="w-10 h-1 rounded-full" style={{ backgroundColor: thematicColors?.transparent50 }} /></div>
          </div>
        )}
      </div>
    </div>
  );
};

const TrabajoDeliveryFormContent = ({ trabajo, onSubmit, onCancel, thematicColors, isMobile }) => {
  const [formData, setFormData] = useState({
    nombre: '', plataforma: '', vehiculo: '', descripcion: '', colorAvatar: '#10B981',
    configuracion: { calculaPorKm: false, tarifaPorKm: 0, calculaPorPedido: true, tarifaBasePedido: 0, incluyePropinas: true, rastreaCombustible: true }
  });
  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (trabajo) {
      setFormData({
        nombre: trabajo.nombre || '', plataforma: trabajo.plataforma || '', vehiculo: trabajo.vehiculo || '',
        descripcion: trabajo.descripcion || '', colorAvatar: trabajo.colorAvatar || '#10B981',
        configuracion: trabajo.configuracion || { calculaPorKm: false, tarifaPorKm: 0, calculaPorPedido: true, tarifaBasePedido: 0, incluyePropinas: true, rastreaCombustible: true }
      });
    } else {
      setFormData({
        nombre: '', plataforma: '', vehiculo: '', descripcion: '', colorAvatar: '#10B981',
        configuracion: { calculaPorKm: false, tarifaPorKm: 0, calculaPorPedido: true, tarifaBasePedido: 0, incluyePropinas: true, rastreaCombustible: true }
      });
    }
  }, [trabajo]);

  const validarFormulario = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.plataforma) newErrors.plataforma = 'Selecciona una plataforma';
    if (!formData.vehiculo) newErrors.vehiculo = 'Selecciona un vehículo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setGuardando(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setGuardando(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }, [errors]);

  const handleConfigChange = (field, value) => {
    setFormData(prev => ({ ...prev, configuracion: { ...prev.configuracion, [field]: value } }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}>
      <div>
        <label className="block text-sm font-medium mb-2">Nombre del trabajo</label>
        <input type="text" value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} className={`w-full border rounded-lg text-sm transition-colors ${isMobile ? 'p-3 text-base' : 'p-3'} ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`} style={{ '--tw-ring-color': thematicColors?.base, borderColor: errors.nombre ? '#EF4444' : undefined }} placeholder="ej: Delivery Zona Norte" />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
      </div>

      <div>
        <PlatformSelector selectedPlatform={formData.plataforma} onPlatformSelect={(plataforma) => handleInputChange('plataforma', plataforma)} />
        {errors.plataforma && <p className="text-red-500 text-xs mt-1">{errors.plataforma}</p>}
      </div>

      <div>
        <VehicleSelector selectedVehicle={formData.vehiculo} onVehicleSelect={(vehiculo) => handleInputChange('vehiculo', vehiculo)} />
        {errors.vehiculo && <p className="text-red-500 text-xs mt-1">{errors.vehiculo}</p>}
      </div>

      <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: thematicColors?.transparent5 }}>
        <h3 className="text-sm font-medium text-gray-700">Configuración de cálculos</h3>
        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={formData.configuracion.incluyePropinas} onChange={(e) => handleConfigChange('incluyePropinas', e.target.checked)} className="rounded w-4 h-4" style={{ accentColor: thematicColors?.base }} />
          <span className="text-sm">Incluir propinas en el registro</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={formData.configuracion.rastreaCombustible} onChange={(e) => handleConfigChange('rastreaCombustible', e.target.checked)} className="rounded w-4 h-4" style={{ accentColor: thematicColors?.base }} />
          <span className="text-sm">Rastrear gastos de combustible</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
        <textarea value={formData.descripcion} onChange={(e) => handleInputChange('descripcion', e.target.value)} className={`w-full border rounded-lg text-sm border-gray-300 resize-none ${isMobile ? 'p-3 text-base' : 'p-2'}`} style={{ '--tw-ring-color': thematicColors?.base }} rows={isMobile ? "3" : "2"} placeholder="ej: Trabajo de delivery en zona céntrica..." />
      </div>

      <div className={`flex pt-4 ${isMobile ? 'flex-col space-y-3' : 'space-x-3'}`}>
        <button type="button" onClick={onCancel} className={`border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors ${isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'}`} disabled={guardando}>Cancelar</button>
        <button type="submit" disabled={guardando} className={`text-white rounded-lg hover:opacity-90 text-sm font-medium disabled:opacity-50 transition-colors ${isMobile ? 'py-3 px-4 w-full' : 'flex-1 py-3 px-4'}`} style={{ backgroundColor: thematicColors?.base }} onMouseEnter={(e) => { if (!guardando && thematicColors?.dark) e.currentTarget.style.backgroundColor = thematicColors.dark; }} onMouseLeave={(e) => { if (!guardando) e.currentTarget.style.backgroundColor = thematicColors?.base; }}>
          {guardando ? (<div className="flex items-center justify-center space-x-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>Guardando...</span></div>) : (trabajo ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
};

export default ModalTrabajoDelivery;