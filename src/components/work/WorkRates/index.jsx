// src/components/work/WorkRates/index.jsx

import React from 'react';
import { Sun, Moon } from 'lucide-react';

const WorkRates = ({ trabajo }) => {
  const tarifaBase = trabajo.tarifaBase || trabajo.salario || 0;
  const tarifaNoche = trabajo.tarifas?.noche || trabajo.tarifaBase || trabajo.salario || 0;
  const tieneTarifaNocturna = tarifaNoche !== tarifaBase;

  return (
    <div className="space-y-1">
      {/* Tarifa base */}
      <div className="flex items-center">
        <Sun size={14} className="text-yellow-500 mr-1" />
        <span className="text-sm font-medium">${tarifaBase.toFixed(2)}/hora</span>
        <span className="text-xs text-gray-500 ml-1">(base)</span>
      </div>
      
      {/* Tarifa nocturna si es diferente */}
      {tieneTarifaNocturna && (
        <div className="flex items-center">
          <Moon size={14} className="text-indigo-500 mr-1" />
          <span className="text-sm font-medium">${tarifaNoche.toFixed(2)}/hora</span>
          <span className="text-xs text-gray-500 ml-1">(noche)</span>
        </div>
      )}
    </div>
  );
};

export default WorkRates;