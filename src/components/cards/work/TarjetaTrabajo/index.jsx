// src/components/cards/TarjetaTrabajo/index.jsx - Refactorizado usando BaseWorkCard

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import BaseWorkCard from '../../base/BaseWorkCard';
import { formatCurrency } from '../../../../utils/currency';

const TarjetaTrabajo = (props) => {
  const { trabajo } = props;

  // Información de tarifas
  const tarifaBase = trabajo?.tarifaBase || trabajo?.salario || 0;
  const tarifaNoche = trabajo?.tarifas?.noche || trabajo?.tarifaBase || trabajo?.salario || 0;
  const tieneTarifaNocturna = tarifaNoche !== tarifaBase && tarifaNoche > 0;

  return (
    <BaseWorkCard {...props} type="traditional">
      {/* Información de tarifas */}
      <div className="space-y-2">
        {/* Tarifa base */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sun size={14} className="text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">Tarifa base:</span>
          </div>
          <span className="text-sm font-medium">{formatCurrency(tarifaBase)}/hora</span>
        </div>

        {/* Tarifa nocturna si es diferente */}
        {tieneTarifaNocturna && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon size={14} className="text-indigo-500 mr-2" />
              <span className="text-sm text-gray-600">Tarifa noche:</span>
            </div>
            <span className="text-sm font-medium">{formatCurrency(tarifaNoche)}/hora</span>
          </div>
        )}

        {/* Información adicional de tarifas si existen */}
        {trabajo?.tarifas && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {trabajo.tarifas.sabado && trabajo.tarifas.sabado !== tarifaBase && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Sábado:</span>
                  <span className="font-medium">{formatCurrency(trabajo.tarifas.sabado)}/h</span>
                </div>
              )}
              {trabajo.tarifas.domingo && trabajo.tarifas.domingo !== tarifaBase && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Domingo:</span>
                  <span className="font-medium">{formatCurrency(trabajo.tarifas.domingo)}/h</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseWorkCard>
  );
};

export default TarjetaTrabajo;
