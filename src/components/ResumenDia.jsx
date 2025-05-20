// src/components/ResumenDia.jsx

import React from 'react';
import Turno from './Turno';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const ResumenDia = (***REMOVED*** fecha, turnos ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos, calcularTotalDia, formatearFecha ***REMOVED*** = useApp();
  
  return (
    <div className="bg-white mb-4 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-semibold">***REMOVED***formatearFecha(fecha)***REMOVED***</h3>
      </div>
      
      <div className="p-4">
        ***REMOVED***turnos.map(turno => ***REMOVED***
          const trabajo = trabajos.find(t => t.id === turno.trabajoId);
          if (!trabajo) return null;
          
          return (
            <Turno 
              key=***REMOVED***turno.id***REMOVED*** 
              turno=***REMOVED***turno***REMOVED*** 
              trabajo=***REMOVED***trabajo***REMOVED*** 
            />
          );
        ***REMOVED***)***REMOVED***
        
        <div className="flex justify-between bg-gray-100 px-4 py-3 rounded-lg mt-2">
          <span className="font-semibold">Total del día:</span>
          <span className="font-semibold">$***REMOVED***calcularTotalDia(turnos).toFixed(2)***REMOVED***</span>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ResumenDia;
