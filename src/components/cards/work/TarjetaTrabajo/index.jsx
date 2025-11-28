// src/components/cards/TarjetaTrabajo/index.jsx - Refactorizado usando BaseWorkCard

import React from 'react';
import ***REMOVED*** Sun, Moon ***REMOVED*** from 'lucide-react';
import BaseWorkCard from '../../base/BaseWorkCard';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';

const TarjetaTrabajo = (props) => ***REMOVED***
  const ***REMOVED*** trabajo ***REMOVED*** = props;

  // Información de tarifas
  const tarifaBase = trabajo?.tarifaBase || trabajo?.salario || 0;
  const tarifaNoche = trabajo?.tarifas?.noche || trabajo?.tarifaBase || trabajo?.salario || 0;
  const tieneTarifaNocturna = tarifaNoche !== tarifaBase && tarifaNoche > 0;

  return (
    <BaseWorkCard ***REMOVED***...props***REMOVED*** type="traditional">
      ***REMOVED***/* Información de tarifas */***REMOVED***
      <div className="space-y-2">
        ***REMOVED***/* Tarifa base */***REMOVED***
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sun size=***REMOVED***14***REMOVED*** className="text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">Tarifa base:</span>
          </div>
          <span className="text-sm font-medium">***REMOVED***formatCurrency(tarifaBase)***REMOVED***/hora</span>
        </div>

        ***REMOVED***/* Tarifa nocturna si es diferente */***REMOVED***
        ***REMOVED***tieneTarifaNocturna && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon size=***REMOVED***14***REMOVED*** className="text-indigo-500 mr-2" />
              <span className="text-sm text-gray-600">Tarifa noche:</span>
            </div>
            <span className="text-sm font-medium">***REMOVED***formatCurrency(tarifaNoche)***REMOVED***/hora</span>
          </div>
        )***REMOVED***

        ***REMOVED***/* Información adicional de tarifas si existen */***REMOVED***
        ***REMOVED***trabajo?.tarifas && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-xs">
              ***REMOVED***trabajo.tarifas.sabado && trabajo.tarifas.sabado !== tarifaBase && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Sábado:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas.sabado)***REMOVED***/h</span>
                </div>
              )***REMOVED***
              ***REMOVED***trabajo.tarifas.domingo && trabajo.tarifas.domingo !== tarifaBase && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Domingo:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas.domingo)***REMOVED***/h</span>
                </div>
              )***REMOVED***
            </div>
          </div>
        )***REMOVED***
      </div>
    </BaseWorkCard>
  );
***REMOVED***;

export default TarjetaTrabajo;
