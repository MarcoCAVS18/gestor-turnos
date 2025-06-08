// src/components/work/WorkRates/index.jsx

import React from 'react';
import ***REMOVED*** Sun, Moon ***REMOVED*** from 'lucide-react';

const WorkRates = (***REMOVED*** trabajo ***REMOVED***) => ***REMOVED***
  const tarifaBase = trabajo.tarifaBase || trabajo.salario || 0;
  const tarifaNoche = trabajo.tarifas?.noche || trabajo.tarifaBase || trabajo.salario || 0;
  const tieneTarifaNocturna = tarifaNoche !== tarifaBase;

  return (
    <div className="space-y-1">
      ***REMOVED***/* Tarifa base */***REMOVED***
      <div className="flex items-center">
        <Sun size=***REMOVED***14***REMOVED*** className="text-yellow-500 mr-1" />
        <span className="text-sm font-medium">$***REMOVED***tarifaBase.toFixed(2)***REMOVED***/hora</span>
        <span className="text-xs text-gray-500 ml-1">(base)</span>
      </div>
      
      ***REMOVED***/* Tarifa nocturna si es diferente */***REMOVED***
      ***REMOVED***tieneTarifaNocturna && (
        <div className="flex items-center">
          <Moon size=***REMOVED***14***REMOVED*** className="text-indigo-500 mr-1" />
          <span className="text-sm font-medium">$***REMOVED***tarifaNoche.toFixed(2)***REMOVED***/hora</span>
          <span className="text-xs text-gray-500 ml-1">(noche)</span>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default WorkRates;