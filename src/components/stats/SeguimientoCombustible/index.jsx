import React from 'react';
import { Fuel, AlertTriangle } from 'lucide-react';

import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const SeguimientoCombustible = ({ deliveryStats }) => {


  // Valores por defecto para evitar errores
  const totalGastos = deliveryStats?.totalGastos || 0;
  const totalKilometros = deliveryStats?.totalKilometros || 0;
  const totalGanancias = deliveryStats?.totalGanado || 0;
  
  const eficiencia = totalGastos > 0 ? totalKilometros / totalGastos : 0;
  const porcentajeGastos = totalGanancias > 0 ? (totalGastos / totalGanancias) * 100 : 0;

  // CAMBIO: Eliminamos el return null para que siempre se renderice
  
  return (
    <Card className="bg-red-50/50 border-red-100">
      <Flex variant="between" className="mb-2">
        <h3 className="text-sm font-semibold flex items-center text-gray-700">
          <Fuel size={16} className="mr-2 text-red-500" />
          Control de Combustible
        </h3>
        {porcentajeGastos > 25 && (
           <div className="flex items-center text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
             <AlertTriangle size={10} className="mr-1" />
             Alto consumo
           </div>
        )}
      </Flex>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Gasto Total</span>
          <span className="text-lg font-bold text-red-600">{formatCurrency(totalGastos)}</span>
        </div>
        
        <div className="flex flex-col text-right border-l border-red-100 pl-4">
          <span className="text-xs text-gray-500">Rendimiento</span>
          <span className="text-lg font-bold text-gray-800">
            {totalGastos > 0 ? eficiencia.toFixed(1) : '-'} <span className="text-xs font-normal text-gray-500">km/$</span>
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-red-100/50">
        <p className="text-xs text-center text-gray-500">
          Representa el <span className="font-semibold text-gray-700">{porcentajeGastos.toFixed(1)}%</span> de tus ganancias
        </p>
      </div>
    </Card>
  );
};

export default SeguimientoCombustible;