// src/components/ModalTrabajo.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const ModalTrabajo = (***REMOVED*** visible, onClose, trabajoSeleccionado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajo, editarTrabajo ***REMOVED*** = useApp();
  const [nuevoTrabajo, setNuevoTrabajo] = useState(***REMOVED***
    nombre: '',
    color: '#6200EE',
    tarifaBase: 0,
    tarifas: ***REMOVED***
      diurno: 0,
      tarde: 0,
      noche: 0,
      sabado: 0,
      domingo: 0
    ***REMOVED***
  ***REMOVED***);

  // Cargar datos si estamos editando un trabajo existente
  useEffect(() => ***REMOVED***
    if (trabajoSeleccionado) ***REMOVED***
      setNuevoTrabajo(***REMOVED***...trabajoSeleccionado***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      setNuevoTrabajo(***REMOVED***
        nombre: '',
        color: '#6200EE',
        tarifaBase: 0,
        tarifas: ***REMOVED***
          diurno: 0,
          tarde: 0,
          noche: 0,
          sabado: 0,
          domingo: 0
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [trabajoSeleccionado, visible]);

  const guardarTrabajo = async () => ***REMOVED***
    try ***REMOVED***
      if (nuevoTrabajo.nombre.trim() === '') return;
      
      if (trabajoSeleccionado) ***REMOVED***
        // Actualizar trabajo existente
        await editarTrabajo(trabajoSeleccionado.id, nuevoTrabajo);
      ***REMOVED*** else ***REMOVED***
        // Crear nuevo trabajo
        await agregarTrabajo(nuevoTrabajo);
      ***REMOVED***
      
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar trabajo:', error);
    ***REMOVED***
  ***REMOVED***;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            ***REMOVED***trabajoSeleccionado ? 'Editar Trabajo' : 'Nuevo Trabajo'***REMOVED***
          </h2>
          <button 
            onClick=***REMOVED***onClose***REMOVED***
            className="text-gray-500 hover:text-gray-700"
          >
            <X size=***REMOVED***20***REMOVED*** />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nombre del Trabajo
            </label>
            <input 
              type="text" 
              value=***REMOVED***nuevoTrabajo.nombre***REMOVED***
              onChange=***REMOVED***(e) => setNuevoTrabajo(***REMOVED***...nuevoTrabajo, nombre: e.target.value***REMOVED***)***REMOVED***
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
              value=***REMOVED***nuevoTrabajo.color***REMOVED***
              onChange=***REMOVED***(e) => setNuevoTrabajo(***REMOVED***...nuevoTrabajo, color: e.target.value***REMOVED***)***REMOVED***
              className="w-full h-10 rounded-md border border-gray-300"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tarifa Base ($/hora)
            </label>
            <input 
              type="number" 
              value=***REMOVED***nuevoTrabajo.tarifaBase***REMOVED***
              onChange=***REMOVED***(e) => ***REMOVED***
                const value = parseFloat(e.target.value);
                setNuevoTrabajo(***REMOVED***
                  ...nuevoTrabajo, 
                  tarifaBase: value,
                  tarifas: ***REMOVED***
                    ...nuevoTrabajo.tarifas,
                    diurno: value
                  ***REMOVED***
                ***REMOVED***);
              ***REMOVED******REMOVED***
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
                  value=***REMOVED***nuevoTrabajo.tarifas.diurno***REMOVED***
                  onChange=***REMOVED***(e) => setNuevoTrabajo(***REMOVED***
                    ...nuevoTrabajo, 
                    tarifas: ***REMOVED***
                      ...nuevoTrabajo.tarifas,
                      diurno: parseFloat(e.target.value)
                    ***REMOVED***
                  ***REMOVED***)***REMOVED***
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Tarde</label>
                <input 
                  type="number" 
                  value=***REMOVED***nuevoTrabajo.tarifas.tarde***REMOVED***
                  onChange=***REMOVED***(e) => setNuevoTrabajo(***REMOVED***
                    ...nuevoTrabajo, 
                    tarifas: ***REMOVED***
                      ...nuevoTrabajo.tarifas,
                      tarde: parseFloat(e.target.value)
                    ***REMOVED***
                  ***REMOVED***)***REMOVED***
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Noche</label>
                <input 
                  type="number" 
                  value=***REMOVED***nuevoTrabajo.tarifas.noche***REMOVED***
                  onChange=***REMOVED***(e) => setNuevoTrabajo(***REMOVED***
                    ...nuevoTrabajo, 
                    tarifas: ***REMOVED***
                      ...nuevoTrabajo.tarifas,
                      noche: parseFloat(e.target.value)
                    ***REMOVED***
                  ***REMOVED***)***REMOVED***
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Sábado</label>
                <input 
                  type="number" 
                  value=***REMOVED***nuevoTrabajo.tarifas.sabado***REMOVED***
                  onChange=***REMOVED***(e) => setNuevoTrabajo(***REMOVED***
                    ...nuevoTrabajo, 
                    tarifas: ***REMOVED***
                      ...nuevoTrabajo.tarifas,
                      sabado: parseFloat(e.target.value)
                    ***REMOVED***
                  ***REMOVED***)***REMOVED***
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-xs mb-1">Domingo</label>
                <input 
                  type="number" 
                  value=***REMOVED***nuevoTrabajo.tarifas.domingo***REMOVED***
                  onChange=***REMOVED***(e) => setNuevoTrabajo(***REMOVED***
                    ...nuevoTrabajo, 
                    tarifas: ***REMOVED***
                      ...nuevoTrabajo.tarifas,
                      domingo: parseFloat(e.target.value)
                    ***REMOVED***
                  ***REMOVED***)***REMOVED***
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick=***REMOVED***onClose***REMOVED***
              className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button 
              onClick=***REMOVED***guardarTrabajo***REMOVED***
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              ***REMOVED***trabajoSeleccionado ? 'Actualizar' : 'Guardar'***REMOVED***
            </button>
          </div>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTrabajo;