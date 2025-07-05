import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Briefcase, AlertCircle } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TurnoForm = ({ 
  turno, 
  trabajoId, 
  trabajos, 
  onSubmit, 
  onCancel, 
  onTrabajoChange,
  isMobile,
  loading 
}) => {
  const { thematicColors } = useApp();
  
  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    trabajoSeleccionado: trabajoId || '',
    notas: '',
  });
  
  const [error, setError] = useState('');

  const trabajosTradicionales = trabajos.filter(t => t.type !== 'delivery');

  const cruzaMedianoche = useMemo(() => {
    if (!formData.horaInicio || !formData.horaFin) return false;
    const [hInicio] = formData.horaInicio.split(':').map(Number);
    const [hFin] = formData.horaFin.split(':').map(Number);
    return hFin <= hInicio;
  }, [formData.horaInicio, formData.horaFin]);

  useEffect(() => {
    if (turno) {
      setFormData({
        fecha: turno.fechaInicio || turno.fecha || '', // Soporte para datos antiguos y nuevos
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        trabajoSeleccionado: turno.trabajoId || '',
        notas: turno.notas || '',
      });
    }
  }, [turno]);

  useEffect(() => {
    if (trabajoId) {
      setFormData(prev => ({ ...prev, trabajoSeleccionado: trabajoId }));
    }
  }, [trabajoId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleTrabajoChange = (e) => {
    const nuevoTrabajoId = e.target.value;
    handleInputChange('trabajoSeleccionado', nuevoTrabajoId);
    if (onTrabajoChange) {
      onTrabajoChange(nuevoTrabajoId);
    }
  };

  const validarFormulario = () => {
    if (!formData.fecha || !formData.horaInicio || !formData.horaFin || !formData.trabajoSeleccionado) {
      setError('Todos los campos con * son requeridos.');
      return false;
    }
    return true;
  };

  const calcularHoras = () => {
    if (!formData.horaInicio || !formData.horaFin) return "0.0";
    const [hI, mI] = formData.horaInicio.split(':').map(Number);
    const [hF, mF] = formData.horaFin.split(':').map(Number);
    let start = new Date(0, 0, 0, hI, mI, 0);
    let end = new Date(0, 0, 0, hF, mF, 0);
    if (cruzaMedianoche) {
      end.setDate(end.getDate() + 1);
    }
    let diff = end.getTime() - start.getTime();
    if (diff < 0) return "0.0"; // Evita duraciones negativas
    return (diff / (1000 * 60 * 60)).toFixed(1);
  };
  
  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const fechaInicioObj = new Date(formData.fecha + 'T00:00:00');
    let fechaFinObj = new Date(fechaInicioObj);
    if (cruzaMedianoche) {
      fechaFinObj.setDate(fechaFinObj.getDate() + 1);
    }
    const fechaFinStr = fechaFinObj.toISOString().split('T')[0];

    const datosTurno = {
      fechaInicio: formData.fecha,
      fechaFin: fechaFinStr,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      trabajoId: formData.trabajoSeleccionado,
      notas: formData.notas.trim(),
    };

    await onSubmit(datosTurno);
  };

  const trabajoSeleccionadoInfo = trabajosTradicionales.find(t => t.id === formData.trabajoSeleccionado);
  const horasTrabajadas = calcularHoras();

  return (
    <form onSubmit={manejarSubmit} className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2"><Briefcase size={16} className="inline mr-2" />Trabajo *</label>
        <select value={formData.trabajoSeleccionado} onChange={handleTrabajoChange} className={`w-full border rounded-lg transition-colors ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'} border-gray-300`} required disabled={!!turno || loading}>
          <option value="">Seleccionar trabajo</option>
          {trabajosTradicionales.map(trabajo => (<option key={trabajo.id} value={trabajo.id}>{trabajo.nombre}</option>))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar size={16} className="inline mr-2" />Fecha de Inicio *</label>
        <ThemeInput type="date" value={formData.fecha} onChange={(e) => handleInputChange('fecha', e.target.value)} required themeColor={thematicColors?.base} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"><Clock size={16} className="inline mr-2" />Hora inicio *</label>
          <ThemeInput type="time" value={formData.horaInicio} onChange={(e) => handleInputChange('horaInicio', e.target.value)} required themeColor={thematicColors?.base} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"><Clock size={16} className="inline mr-2" />Hora fin *</label>
          <ThemeInput type="time" value={formData.horaFin} onChange={(e) => handleInputChange('horaFin', e.target.value)} required themeColor={thematicColors?.base} />
        </div>
      </div>
      
      {cruzaMedianoche && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
          <AlertCircle size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Turno Nocturno Detectado</p>
            <p className="text-blue-700 mt-1">Este turno finalizará el día siguiente.</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
        <textarea value={formData.notas} onChange={(e) => handleInputChange('notas', e.target.value)} placeholder="Agregar notas sobre el turno..." rows={isMobile ? 4 : 3} className={`w-full border border-gray-300 rounded-lg transition-colors resize-none p-3 text-base`} />
      </div>

      {error && (<div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>)}

      <div className={`flex pt-4 ${isMobile ? 'flex-col space-y-3' : 'gap-3'}`}>
        <Button type="button" onClick={onCancel} variant="outline" className={isMobile ? 'w-full py-3' : 'flex-1'} disabled={loading} themeColor={thematicColors?.base}>Cancelar</Button>
        <Button type="submit" className={isMobile ? 'w-full py-3' : 'flex-1'} loading={loading} themeColor={thematicColors?.base}>{turno ? 'Guardar Cambios' : 'Crear Turno'}</Button>
      </div>

      {horasTrabajadas > 0 && trabajoSeleccionadoInfo && (
        <div className={`rounded-lg p-4 border-l-4 mt-2`} style={{ borderLeftColor: trabajoSeleccionadoInfo.color || thematicColors?.base, backgroundColor: `${trabajoSeleccionadoInfo.color || thematicColors?.base}1A` }}>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: trabajoSeleccionadoInfo.color || thematicColors?.base }} />
              <span className="text-sm font-medium text-gray-700">{trabajoSeleccionadoInfo.nombre}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duración:</span>
              <span className="font-medium">{horasTrabajadas} horas{cruzaMedianoche && <span className="text-purple-600 ml-1">(nocturno)</span>}</span>
            </div>
            {trabajoSeleccionadoInfo.tarifaBase && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ganancia estimada:</span>
                <span style={{ color: trabajoSeleccionadoInfo.color || thematicColors?.base }}>${(Number(horasTrabajadas) * trabajoSeleccionadoInfo.tarifaBase).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default TurnoForm;