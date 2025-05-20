// src/components/ModalTrabajo.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ModalTrabajo = ({ visible, onClose, trabajoSeleccionado }) => {
  const { agregarTrabajo, editarTrabajo } = useApp();
  const [nuevoTrabajo, setNuevoTrabajo] = useState({
    nombre: '',
    color: '#6200EE',
    tarifaBase: 0,
    tarifas: {
      diurno: 0,
      tarde: 0,
      noche: 0,
      sabado: 0,
      domingo: 0
    }
  });

  // Cargar datos si estamos editando un trabajo existente
  useEffect(() => {
    if (trabajoSeleccionado) {
      setNuevoTrabajo({...trabajoSeleccionado});
    } else {
      setNuevoTrabajo({
        nombre: '',
        color: '#6200EE',
        tarifaBase: 0,
        tarifas: {
          diurno: 0,
          tarde: 0,
          noche: 0,
          sabado: 0,
          domingo: 0
        }
      });
    }
  }, [trabajoSeleccionado, visible]);

  const guardarTrabajo = async () => {
    try {
      if (nuevoTrabajo.nombre.trim() === '') return;
      
      if (trabajoSeleccionado) {
        // Actualizar trabajo existente
        await editarTrabajo(trabajoSeleccionado.id, nuevoTrabajo);
      } else {
        // Crear nuevo trabajo
        await agregarTrabajo(nuevoTrabajo);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al guardar trabajo:', error);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {trabajoSeleccionado ? 'Editar Trabajo' : 'Nuevo Trabajo'}
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
              Nombre del Trabajo
            </label>
            <input 
              type="text" 
              value={nuevoTrabajo.nombre}
              onChange={(e) => setNuevoTrabajo({...nuevoTrabajo, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: SunCorp Stadium"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Color
            </label>
            <input 
              type="color" 
              value={nuevoTrabajo.color}
              onChange={(e) => setNuevoTrabajo({...nuevoTrabajo, color: e.target.value})}
              className="w-full h-10 rounded-md border border-gray-300"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tarifa Base ($/hora)
            </label>
            <input 
              type="number" 
              value={nuevoTrabajo.tarifaBase}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setNuevoTrabajo({
                  ...nuevoTrabajo, 
                  tarifaBase: value,
                  tarifas: {
                    ...nuevoTrabajo.tarifas,
                    diurno: value
                  }
                });
              }}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <h3 className="text-gray-700 text-sm font-medium mb-2">Tarifas Específicas</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 text-xs mb-1">Diurno</label>
                <input 
                  type="number" 
                  value={nuevoTrabajo.tarifas.diurno}
                  onChange={(e) => setNuevoTrabajo({
                    ...nuevoTrabajo, 
                    tarifas: {
                      ...nuevoTrabajo.tarifas,
                      diurno: parseFloat(e.target.value)
                    }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Tarde</label>
                <input 
                  type="number" 
                  value={nuevoTrabajo.tarifas.tarde}
                  onChange={(e) => setNuevoTrabajo({
                    ...nuevoTrabajo, 
                    tarifas: {
                      ...nuevoTrabajo.tarifas,
                      tarde: parseFloat(e.target.value)
                    }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Noche</label>
                <input 
                  type="number" 
                  value={nuevoTrabajo.tarifas.noche}
                  onChange={(e) => setNuevoTrabajo({
                    ...nuevoTrabajo, 
                    tarifas: {
                      ...nuevoTrabajo.tarifas,
                      noche: parseFloat(e.target.value)
                    }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Sábado</label>
                <input 
                  type="number" 
                  value={nuevoTrabajo.tarifas.sabado}
                  onChange={(e) => setNuevoTrabajo({
                    ...nuevoTrabajo, 
                    tarifas: {
                      ...nuevoTrabajo.tarifas,
                      sabado: parseFloat(e.target.value)
                    }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Domingo</label>
                <input 
                  type="number" 
                  value={nuevoTrabajo.tarifas.domingo}
                  onChange={(e) => setNuevoTrabajo({
                    ...nuevoTrabajo, 
                    tarifas: {
                      ...nuevoTrabajo.tarifas,
                      domingo: parseFloat(e.target.value)
                    }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button 
              onClick={guardarTrabajo}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              {trabajoSeleccionado ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTrabajo;