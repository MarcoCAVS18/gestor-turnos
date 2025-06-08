// src/components/stats/WorkBreakdown/index.jsx

import React from 'react';
import ***REMOVED*** BarChart2 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const WorkBreakdown = (***REMOVED*** gananciaPorTrabajo = [], totalGanado = 0 ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();

  // Verificar datos
  const trabajosValidos = Array.isArray(gananciaPorTrabajo) ? gananciaPorTrabajo : [];
  const totalSeguro = typeof totalGanado === 'number' && !isNaN(totalGanado) ? totalGanado : 0;

  if (trabajosValidos.length === 0) ***REMOVED***
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <BarChart2 size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
          <h3 className="font-semibold">Por trabajo</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <BarChart2 size=***REMOVED***48***REMOVED*** className="mx-auto mb-3 opacity-30" />
          <p>No hay datos de trabajos</p>
        </div>
      </div>
    );
  ***REMOVED***

  // Componente para barra de progreso de trabajo
  const BarraTrabajo = (***REMOVED*** trabajo, maximo ***REMOVED***) => ***REMOVED***
    const trabajoSeguro = ***REMOVED***
      nombre: (trabajo && typeof trabajo.nombre === 'string') ? trabajo.nombre : 'Sin nombre',
      ganancia: (trabajo && typeof trabajo.ganancia === 'number') ? trabajo.ganancia : 0,
      turnos: (trabajo && typeof trabajo.turnos === 'number') ? trabajo.turnos : 0,
      horas: (trabajo && typeof trabajo.horas === 'number') ? trabajo.horas : 0,
      color: (trabajo && typeof trabajo.color === 'string') ? trabajo.color : '#EC4899'
    ***REMOVED***;

    const porcentaje = maximo > 0 ? (trabajoSeguro.ganancia / maximo) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">***REMOVED***trabajoSeguro.nombre***REMOVED***</span>
          <div className="text-right">
            <span className="text-sm font-bold" style=***REMOVED******REMOVED*** color: trabajoSeguro.color ***REMOVED******REMOVED***>
              $***REMOVED***trabajoSeguro.ganancia.toFixed(2)***REMOVED***
            </span>
            <p className="text-xs text-gray-500">
              ***REMOVED***trabajoSeguro.turnos***REMOVED*** turnos · ***REMOVED***trabajoSeguro.horas.toFixed(1)***REMOVED***h
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style=***REMOVED******REMOVED***
              width: `$***REMOVED***Math.min(porcentaje, 100)***REMOVED***%`,
              backgroundColor: trabajoSeguro.color
            ***REMOVED******REMOVED***
          />
        </div>
      </div>
    );
  ***REMOVED***;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <BarChart2 size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="font-semibold">Por trabajo</h3>
      </div>

      <div className="space-y-3">
        ***REMOVED***trabajosValidos.map((trabajo, index) => (
          <BarraTrabajo
            key=***REMOVED***trabajo?.id || index***REMOVED***
            trabajo=***REMOVED***trabajo***REMOVED***
            maximo=***REMOVED***totalSeguro***REMOVED***
          />
        ))***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default WorkBreakdown;