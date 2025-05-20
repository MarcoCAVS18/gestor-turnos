// src/components/ModalTurno.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ModalTurno = ({ visible, onClose, turnoSeleccionado }) => {
  const { trabajos, agregarTurno, editarTurno } = useApp();
  const [nuevoTurno, setNuevoTurno] = useState({
    trabajoId: '',
    fecha: new Date().toISOString().slice(0, 10),
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
        fecha: new Date().toISOString().slice(0, 10),
        horaInicio: '09:00',
        horaFin: '17:00',
        tipo: 'diurno',
        notas: ''
      });
    }
  }, [turnoSeleccionado, visible]);

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
      console.error('Error al guardar turno:', error);
    }
  };

  // Determinar el tipo de turno automáticamente según la hora
  const determinarTipoTurno = (fecha, horaInicio) => {
    const diaSemana = new Date(fecha).getDay(); // 0 = domingo, 6 = sábado
    const hora = parseInt(horaInicio.split(':')[0]);
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    
    if (hora >= 5 && hora < 14) return 'diurno';
    if (hora >= 14 && hora < 22) return 'tarde';
    return 'noche';
  };

  // Actualizar tipo de turno automáticamente al cambiar fecha u hora
  useEffect(() => {
    if (nuevoTurno.fecha && nuevoTurno.horaInicio) {
      const tipo = determinarTipoTurno(nuevoTurno.fecha, nuevoTurno.horaInicio);
      setNuevoTurno(prev => ({...prev, tipo}));
    }
  }, [nuevoTurno.fecha, nuevoTurno.horaInicio]);

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
            className="text-gray-500 hover:text-gray-700"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tipo de turno
            </label>
            <select 
              value={nuevoTurno.tipo}
              onChange={(e) => setNuevoTurno({...nuevoTurno, tipo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="diurno">Diurno</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
              <option value="sabado">Sábado</option>
              <option value="domingo">Domingo</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Notas (opcional)
            </label>
            <textarea 
              value={nuevoTurno.notas}
              onChange={(e) => setNuevoTurno({...nuevoTurno, notas: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Agregar notas o comentarios sobre este turno..."
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button 
              onClick={guardarTurno}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              disabled={!nuevoTurno.trabajoId}
            >
              {turnoSeleccionado ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTurno;