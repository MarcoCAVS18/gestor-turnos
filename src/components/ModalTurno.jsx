// src/components/ModalTurno.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const ModalTurno = (***REMOVED*** visible, onClose, turnoSeleccionado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos, agregarTurno, editarTurno ***REMOVED*** = useApp();
  const [nuevoTurno, setNuevoTurno] = useState(***REMOVED***
    trabajoId: '',
    fecha: new Date().toISOString().slice(0, 10),
    horaInicio: '09:00',
    horaFin: '17:00',
    tipo: 'diurno',
    notas: ''
  ***REMOVED***);

  // Cargar datos si estamos editando un turno existente
  useEffect(() => ***REMOVED***
    if (turnoSeleccionado) ***REMOVED***
      setNuevoTurno(***REMOVED***...turnoSeleccionado***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      setNuevoTurno(***REMOVED***
        trabajoId: '',
        fecha: new Date().toISOString().slice(0, 10),
        horaInicio: '09:00',
        horaFin: '17:00',
        tipo: 'diurno',
        notas: ''
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [turnoSeleccionado, visible]);

  const guardarTurno = async () => ***REMOVED***
    try ***REMOVED***
      if (!nuevoTurno.trabajoId) return;
      
      if (turnoSeleccionado) ***REMOVED***
        await editarTurno(turnoSeleccionado.id, nuevoTurno);
      ***REMOVED*** else ***REMOVED***
        await agregarTurno(nuevoTurno);
      ***REMOVED***
      
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar turno:', error);
    ***REMOVED***
  ***REMOVED***;

  // Determinar el tipo de turno automáticamente según la hora
  const determinarTipoTurno = (fecha, horaInicio) => ***REMOVED***
    const diaSemana = new Date(fecha).getDay(); // 0 = domingo, 6 = sábado
    const hora = parseInt(horaInicio.split(':')[0]);
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    
    if (hora >= 5 && hora < 14) return 'diurno';
    if (hora >= 14 && hora < 22) return 'tarde';
    return 'noche';
  ***REMOVED***;

  // Actualizar tipo de turno automáticamente al cambiar fecha u hora
  useEffect(() => ***REMOVED***
    if (nuevoTurno.fecha && nuevoTurno.horaInicio) ***REMOVED***
      const tipo = determinarTipoTurno(nuevoTurno.fecha, nuevoTurno.horaInicio);
      setNuevoTurno(prev => (***REMOVED***...prev, tipo***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [nuevoTurno.fecha, nuevoTurno.horaInicio]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            ***REMOVED***turnoSeleccionado ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
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
              Trabajo
            </label>
            <select 
              value=***REMOVED***nuevoTurno.trabajoId***REMOVED***
              onChange=***REMOVED***(e) => setNuevoTurno(***REMOVED***...nuevoTurno, trabajoId: e.target.value***REMOVED***)***REMOVED***
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecciona un trabajo</option>
              ***REMOVED***trabajos.map(trabajo => (
                <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                  ***REMOVED***trabajo.nombre***REMOVED***
                </option>
              ))***REMOVED***
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Fecha
            </label>
            <input 
              type="date" 
              value=***REMOVED***nuevoTurno.fecha***REMOVED***
              onChange=***REMOVED***(e) => setNuevoTurno(***REMOVED***...nuevoTurno, fecha: e.target.value***REMOVED***)***REMOVED***
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
                value=***REMOVED***nuevoTurno.horaInicio***REMOVED***
                onChange=***REMOVED***(e) => setNuevoTurno(***REMOVED***...nuevoTurno, horaInicio: e.target.value***REMOVED***)***REMOVED***
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Hora de fin
              </label>
              <input 
                type="time" 
                value=***REMOVED***nuevoTurno.horaFin***REMOVED***
                onChange=***REMOVED***(e) => setNuevoTurno(***REMOVED***...nuevoTurno, horaFin: e.target.value***REMOVED***)***REMOVED***
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tipo de turno
            </label>
            <select 
              value=***REMOVED***nuevoTurno.tipo***REMOVED***
              onChange=***REMOVED***(e) => setNuevoTurno(***REMOVED***...nuevoTurno, tipo: e.target.value***REMOVED***)***REMOVED***
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
              value=***REMOVED***nuevoTurno.notas***REMOVED***
              onChange=***REMOVED***(e) => setNuevoTurno(***REMOVED***...nuevoTurno, notas: e.target.value***REMOVED***)***REMOVED***
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows=***REMOVED***3***REMOVED***
              placeholder="Agregar notas o comentarios sobre este turno..."
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick=***REMOVED***onClose***REMOVED***
              className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button 
              onClick=***REMOVED***guardarTurno***REMOVED***
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              disabled=***REMOVED***!nuevoTurno.trabajoId***REMOVED***
            >
              ***REMOVED***turnoSeleccionado ? 'Actualizar' : 'Guardar'***REMOVED***
            </button>
          </div>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTurno;