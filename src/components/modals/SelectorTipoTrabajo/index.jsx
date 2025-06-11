// src/components/selectors/SelectorTipoTrabajo.jsx
import React from 'react';
import ***REMOVED*** Briefcase, Truck ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const SelectorTipoTrabajo = (***REMOVED*** onSelectTipo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">
        ¿Qué tipo de trabajo quieres agregar?
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick=***REMOVED***() => onSelectTipo('tradicional')***REMOVED***
          className="p-4 border-2 rounded-lg hover:border-pink-500 transition-colors group"
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = coloresTemáticos?.base;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = '#e5e7eb';
          ***REMOVED******REMOVED***
          style=***REMOVED******REMOVED*** borderColor: '#e5e7eb' ***REMOVED******REMOVED***
        >
          <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="font-medium">Trabajo por Horas</p>
          <p className="text-xs text-gray-500 mt-1">
            Con tarifa fija por hora
          </p>
        </button>

        <button
          type="button"
          onClick=***REMOVED***() => onSelectTipo('delivery')***REMOVED***
          className="p-4 border-2 rounded-lg hover:border-pink-500 transition-colors group"
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = coloresTemáticos?.base;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = '#e5e7eb';
          ***REMOVED******REMOVED***
          style=***REMOVED******REMOVED*** borderColor: '#e5e7eb' ***REMOVED******REMOVED***
        >
          <Truck className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="font-medium">Delivery</p>
          <p className="text-xs text-gray-500 mt-1">
            Ganancias por pedido
          </p>
        </button>
      </div>
    </div>
  );
***REMOVED***;

export default SelectorTipoTrabajo;
