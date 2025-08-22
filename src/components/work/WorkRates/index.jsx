// src/components/work/WorkRates/index.jsx - Versión con validaciones defensivas

import React from 'react';
import ***REMOVED*** Sun, Moon ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const WorkRates = (***REMOVED*** trabajo ***REMOVED***) => ***REMOVED***
  // Validación defensiva
  if (!trabajo) ***REMOVED***
    return (
      <div className="text-xs text-gray-500">
        Sin información de tarifas
      </div>
    );
  ***REMOVED***

  const tarifaBase = trabajo.tarifaBase || trabajo.salario || 0;
  const tarifaNoche = trabajo.tarifas?.noche || trabajo.tarifaBase || trabajo.salario || 0;
  const tieneTarifaNocturna = tarifaNoche !== tarifaBase && tarifaNoche > 0;

  return (
    <div className="space-y-1">
      ***REMOVED***/* Tarifa base */***REMOVED***
      <div className="flex items-center">
        <Sun size=***REMOVED***14***REMOVED*** className="text-yellow-500 mr-1" />
        <span className="text-sm font-medium">***REMOVED***formatCurrency(tarifaBase)***REMOVED***/hora</span>
        <span className="text-xs text-gray-500 ml-1">(base)</span>
      </div>
      
      ***REMOVED***/* Tarifa nocturna si es diferente */***REMOVED***
      ***REMOVED***tieneTarifaNocturna && (
        <div className="flex items-center">
          <Moon size=***REMOVED***14***REMOVED*** className="text-indigo-500 mr-1" />
          <span className="text-sm font-medium">***REMOVED***formatCurrency(tarifaNoche)***REMOVED***/hora</span>
          <span className="text-xs text-gray-500 ml-1">(noche)</span>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default WorkRates;