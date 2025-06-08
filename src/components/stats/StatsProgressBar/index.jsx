// src/components/stats/StatsProgressBar/index.jsx

import React from 'react';
import ***REMOVED*** Clock, DollarSign, Target ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const StatsProgressBar = (***REMOVED*** 
  horasSemanales = 0,
  metaHoras = 40,
  gananciaTotal = 0,
  className = '' 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  // Calcular porcentaje de progreso
  const porcentaje = metaHoras > 0 ? (horasSemanales / metaHoras) * 100 : 0;
  const porcentajeLimitado = Math.min(Math.max(porcentaje, 0), 100);
  
  const getColorProgreso = () => ***REMOVED***
    if (porcentaje >= 100) return '#10B981';
    if (porcentaje >= 75) return coloresTemáticos?.base || '#EC4899'; 
    if (porcentaje >= 50) return '#F59E0B'; 
    return '#EF4444';
  ***REMOVED***;

  return (
    <Card className=***REMOVED***className***REMOVED***>
      <div className="space-y-4">
        ***REMOVED***/* Header */***REMOVED***
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Target size=***REMOVED***18***REMOVED*** className="mr-2" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** />
            Progreso Semanal
          </h3>
          <span className="text-sm text-gray-500">
            Meta: ***REMOVED***metaHoras***REMOVED***h
          </span>
        </div>

        ***REMOVED***/* Barra de progreso */***REMOVED***
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">***REMOVED***horasSemanales.toFixed(1)***REMOVED*** horas trabajadas</span>
            <span className="text-gray-500">***REMOVED***porcentajeLimitado.toFixed(1)***REMOVED***%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style=***REMOVED******REMOVED***
                width: `$***REMOVED***porcentajeLimitado***REMOVED***%`,
                backgroundColor: getColorProgreso()
              ***REMOVED******REMOVED***
            />
          </div>
        </div>

        ***REMOVED***/* Stats adicionales */***REMOVED***
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center">
            <Clock size=***REMOVED***16***REMOVED*** className="text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Horas restantes</p>
              <p className="font-medium">
                ***REMOVED***Math.max(0, metaHoras - horasSemanales).toFixed(1)***REMOVED***h
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <DollarSign size=***REMOVED***16***REMOVED*** className="text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Ganancia total</p>
              <p className="font-medium">$***REMOVED***gananciaTotal.toFixed(2)***REMOVED***</p>
            </div>
          </div>
        </div>

        ***REMOVED***porcentaje >= 100 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              🎉 ¡Meta cumplida! Has superado las ***REMOVED***metaHoras***REMOVED*** horas esta semana.
            </p>
          </div>
        )***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default StatsProgressBar;