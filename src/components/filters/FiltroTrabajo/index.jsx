// src/components/filters/FiltroTrabajo/index.jsx

import React from 'react';
import ***REMOVED*** Briefcase, Truck ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const FiltroTrabajo = (***REMOVED*** value, onChange ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos, trabajosDelivery, thematicColors ***REMOVED*** = useApp();
  
  // Combinar todos los trabajos
  const todosLosTrabajos = [
    ...trabajos.map(t => (***REMOVED*** ...t, tipo: t.tipo || 'tradicional' ***REMOVED***)),
    ...trabajosDelivery.map(t => (***REMOVED*** ...t, tipo: 'delivery' ***REMOVED***))
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por trabajo
      </label>
      <div className="relative">
        <select
          value=***REMOVED***value***REMOVED***
          onChange=***REMOVED***(e) => onChange(e.target.value)***REMOVED***
          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
          style=***REMOVED******REMOVED*** '--tw-ring-color': thematicColors?.base ***REMOVED******REMOVED***
        >
          <option value="todos">Todos los trabajos</option>
          ***REMOVED***todosLosTrabajos.map(trabajo => (
            <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
              ***REMOVED***trabajo.nombre***REMOVED***
              ***REMOVED***trabajo.tipo === 'delivery' ? ' (Delivery)' : ''***REMOVED***
            </option>
          ))***REMOVED***
        </select>
        
        ***REMOVED***/* Icono decorativo */***REMOVED***
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          ***REMOVED***value !== 'todos' ? (
            (() => ***REMOVED***
              const trabajoSeleccionado = todosLosTrabajos.find(t => t.id === value);
              return trabajoSeleccionado?.tipo === 'delivery' ? (
                <Truck size=***REMOVED***16***REMOVED*** className="text-green-600" />
              ) : (
                <Briefcase size=***REMOVED***16***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** />
              );
            ***REMOVED***)()
          ) : (
            <Briefcase size=***REMOVED***16***REMOVED*** className="text-gray-400" />
          )***REMOVED***
        </div>
        
        ***REMOVED***/* Ajustar padding para el icono */***REMOVED***
        <style jsx>***REMOVED***`
          select ***REMOVED***
            padding-left: 2.5rem;
          ***REMOVED***
        `***REMOVED***</style>
      </div>
    </div>
  );
***REMOVED***;

export default FiltroTrabajo;