// src/components/ModalTurno.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import DynamicButton from './DynamicButton';

const ModalTurno = ({ visible, onClose, turnoSeleccionado, fechaInicial }) => {
  const { trabajos, agregarTurno, editarTurno, rangosTurnos, coloresTemáticos } = useApp();
  
  // Función para obtener la fecha actual en formato local
  const getFechaActualLocal = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [nuevoTurno, setNuevoTurno] = useState({
    trabajoId: '',
    fecha: fechaInicial || getFechaActualLocal(),
    horaInicio: '09:00',
    horaFin: '17:00',
    tipo: 'diurno',
    notas: ''
  });

  // Cargar datos si estamos editando un turno existente
  useEffect(() => {
    if (turnoSeleccionado) {
      setNuevoTurno({...turnoSeleccionado});
    } else {
      setNuevoTurno({
        trabajoId: '',
        fecha: fechaInicial || getFechaActualLocal(),
        horaInicio: '09:00',
        horaFin: '17:00',
        tipo: 'diurno',
        notas: ''
      });
    }
  }, [turnoSeleccionado, visible, fechaInicial]);

  const guardarTurno = async () => {
    try {
      if (!nuevoTurno.trabajoId) return;
      
      if (turnoSeleccionado) {
        await editarTurno(turnoSeleccionado.id, nuevoTurno);
      } else {
        await agregarTurno(nuevoTurno);
      }
      
      onClose();
    } catch (error) {
      // Error ya manejado en el contexto
    }
  };

  // Función mejorada para determinar el tipo de turno automáticamente
  const determinarTipoTurno = useCallback((fecha, horaInicio) => {
    // Crear fecha correctamente para evitar problemas de zona horaria
    const [year, month, day] = fecha.split('-');
    const fechaLocal = new Date(year, month - 1, day);
    const diaSemana = fechaLocal.getDay(); // 0 = domingo, 6 = sábado
    
    // Primero verificar si es fin de semana
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    
    // Si es día de semana, determinar por hora
    const hora = parseInt(horaInicio.split(':')[0]);
    
    // Usar rangos configurables del contexto (con valores por defecto)
    const rangos = rangosTurnos || {
      diurnoInicio: 6,
      diurnoFin: 14,
      tardeInicio: 14,
      tardeFin: 20,
      nocheInicio: 20
    };
    
    if (hora >= rangos.diurnoInicio && hora < rangos.diurnoFin) return 'diurno';
    if (hora >= rangos.tardeInicio && hora < rangos.tardeFin) return 'tarde';
    return 'noche';
  }, [rangosTurnos]);

  // Actualizar tipo de turno automáticamente al cambiar fecha u hora
  useEffect(() => {
    if (nuevoTurno.fecha && nuevoTurno.horaInicio && !turnoSeleccionado) {
      const tipoDetectado = determinarTipoTurno(nuevoTurno.fecha, nuevoTurno.horaInicio);
      
      setNuevoTurno(prev => ({
        ...prev, 
        tipo: tipoDetectado
      }));
    }
  }, [nuevoTurno.fecha, nuevoTurno.horaInicio, turnoSeleccionado, determinarTipoTurno]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {turnoSeleccionado ? 'Editar Turno' : 'Nuevo Turno'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Trabajo
            </label>
            <select 
              value={nuevoTurno.trabajoId}
              onChange={(e) => setNuevoTurno({...nuevoTurno, trabajoId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ 
                '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
                '--tw-ring-opacity': '0.5'
              }}
            >
              <option value="">Selecciona un trabajo</option>
              {trabajos.map(trabajo => (
                <option key={trabajo.id} value={trabajo.id}>
                  {trabajo.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Fecha
            </label>
            <input 
              type="date" 
              value={nuevoTurno.fecha}
              onChange={(e) => setNuevoTurno({...nuevoTurno, fecha: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ 
                '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
                '--tw-ring-opacity': '0.5'
              }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Hora de inicio
              </label>
              <input 
                type="time" 
                value={nuevoTurno.horaInicio}
                onChange={(e) => setNuevoTurno({...nuevoTurno, horaInicio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
                  '--tw-ring-opacity': '0.5'
                }}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Hora de fin
              </label>
              <input 
                type="time" 
                value={nuevoTurno.horaFin}
                onChange={(e) => setNuevoTurno({...nuevoTurno, horaFin: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
                  '--tw-ring-opacity': '0.5'
                }}
              />
            </div>
          </div>
          
          {/* Tipo de turno - Solo mostrar selector si estamos editando un turno existente */}
          {turnoSeleccionado && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Tipo de turno
              </label>
              <select 
                value={nuevoTurno.tipo}
                onChange={(e) => setNuevoTurno({...nuevoTurno, tipo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
                  '--tw-ring-opacity': '0.5'
                }}
              >
                <option value="diurno">Diurno</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
                <option value="sabado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Notas (opcional)
            </label>
            <textarea 
              value={nuevoTurno.notas}
              onChange={(e) => setNuevoTurno({...nuevoTurno, notas: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ 
                '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
                '--tw-ring-opacity': '0.5'
              }}
              rows={3}
              placeholder="Agregar notas o comentarios sobre este turno..."
            />
          </div>
          
          <div className="flex justify-end mt-6 gap-2">
            <DynamicButton 
              onClick={onClose}
              variant="ghost"
            >
              Cancelar
            </DynamicButton>
            <DynamicButton 
              onClick={guardarTurno}
              disabled={!nuevoTurno.trabajoId}
            >
              {turnoSeleccionado ? 'Actualizar' : 'Guardar'}
            </DynamicButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTurno;