// src/components/stats/MostProductiveDay/index.jsx

import React from 'react';
import ***REMOVED*** Award ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const MostProductiveDay = (***REMOVED*** diaMasProductivo ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Función para formatear horas
  const formatearHoras = (horas) => ***REMOVED***
    if (horas === 0) return '0h';
    if (horas < 1) ***REMOVED***
      const minutos = Math.round(horas * 60);
      return `$***REMOVED***minutos***REMOVED***min`;
    ***REMOVED***
    const horasEnteras = Math.floor(horas);
    const minutos = Math.round((horas - horasEnteras) * 60);
    
    if (minutos === 0) ***REMOVED***
      return `$***REMOVED***horasEnteras***REMOVED***h`;
    ***REMOVED***
    return `$***REMOVED***horasEnteras***REMOVED***h $***REMOVED***minutos***REMOVED***min`;
  ***REMOVED***;

  // Si no hay datos válidos, mostrar estado vacío
  if (!diaMasProductivo || diaMasProductivo.dia === 'Ninguno' || !diaMasProductivo.ganancia || diaMasProductivo.ganancia <= 0) ***REMOVED***
    return (
      <div className="h-full flex flex-col justify-center">
        <div className="text-center py-4">
          <Award size=***REMOVED***24***REMOVED*** className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-500">Sin datos suficientes</p>
        </div>
      </div>
    );
  ***REMOVED***

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-3">
        <Award size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h4 className="font-medium text-sm">Día más productivo</h4>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">***REMOVED***diaMasProductivo.dia***REMOVED***</p>
            <p className="text-xs text-gray-600">
              ***REMOVED***diaMasProductivo.turnos || 0***REMOVED*** turnos • ***REMOVED***formatearHoras(diaMasProductivo.horas || 0)***REMOVED***
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              ***REMOVED***formatCurrency(diaMasProductivo.ganancia)***REMOVED***
            </p>
          </div>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default MostProductiveDay;