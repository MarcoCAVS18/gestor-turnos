// src/pages/Turnos.jsx
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ResumenDia from '../components/ResumenDia';
import ModalTurno from '../components/ModalTurno';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Turnos = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, cargando ***REMOVED*** = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  
  const abrirModalNuevoTurno = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;
  
  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  ***REMOVED***;
  
  if (cargando) ***REMOVED***
    return (
      <div className="px-4 py-6 text-center">
        <p>Cargando datos...</p>
      </div>
    );
  ***REMOVED***
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Resumen de Turnos</h2>
        <button 
          onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <span>Nuevo Turno</span>
        </button>
      </div>
      
      ***REMOVED***Object.entries(turnosPorFecha).length > 0 ? (
        Object.entries(turnosPorFecha).map(([fecha, turnosDia]) => (
          <ResumenDia 
            key=***REMOVED***fecha***REMOVED*** 
            fecha=***REMOVED***fecha***REMOVED*** 
            turnos=***REMOVED***turnosDia***REMOVED*** 
          />
        ))
      ) : (
        <div className="text-center py-8 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No hay turnos registrados</p>
          <button 
            onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Agregar turno
          </button>
        </div>
      )***REMOVED***
      
      <ModalTurno 
        visible=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        turnoSeleccionado=***REMOVED***turnoSeleccionado***REMOVED*** 
      />
    </div>
  );
***REMOVED***;

export default Turnos;