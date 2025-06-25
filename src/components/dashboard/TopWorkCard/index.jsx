// src/components/dashboard/TopWorkCard/index.jsx

import ***REMOVED*** Award ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const TopWorkCard = (***REMOVED*** trabajoMasRentable ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();

  if (!trabajoMasRentable) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Award size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
        Trabajo más rentable
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-3"
            style=***REMOVED******REMOVED*** backgroundColor: trabajoMasRentable.trabajo.color ***REMOVED******REMOVED***
          />
          <div>
            <p className="font-semibold text-gray-800">
              ***REMOVED***trabajoMasRentable.trabajo.nombre***REMOVED***
            </p>
            <p className="text-sm text-gray-600">
              ***REMOVED***trabajoMasRentable.turnos***REMOVED*** turnos • ***REMOVED***trabajoMasRentable.horas.toFixed(1)***REMOVED***h
            </p>
          </div>
        </div>
        <p 
          className="text-xl font-bold" 
          style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***
        >
          $***REMOVED***trabajoMasRentable.ganancia.toFixed(2)***REMOVED***
        </p>
      </div>
    </Card>
  );
***REMOVED***;

export default TopWorkCard;