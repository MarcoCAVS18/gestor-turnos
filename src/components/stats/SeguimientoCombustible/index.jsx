// src/components/stats/SeguimientoCombustible/index.jsx

import React from 'react';
import { Fuel } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const SeguimientoCombustible = ({ deliveryStats }) => {
  const { thematicColors } = useApp();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalGastos = deliveryStats.totalGastos;
  const totalKilometros = deliveryStats.totalKilometros;
  const totalGanancias = deliveryStats.totalGanado;
  
  const eficiencia = totalGastos > 0 ? totalKilometros / totalGastos : 0;
  const porcentajeGastos = totalGanancias > 0 ? (totalGastos / totalGanancias) * 100 : 0;

  if (totalGastos === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <Fuel size={32} className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-semibold text-gray-600">Sin gastos de combustible</h3>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Fuel size={20} style={{ color: thematicColors?.base }} className="mr-2" />
        Combustible
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <Fuel size={24} className="mx-auto mb-2 text-red-600" />
          <p className="text-2xl font-bold text-red-700">{formatCurrency(totalGastos)}</p>
          <p className="text-sm text-red-600">Gasto Total</p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-2xl font-bold text-blue-700">{eficiencia.toFixed(1)}</p>
          <p className="text-sm text-blue-600">Km/Peso</p>
        </div>
      </div>

      {porcentajeGastos > 25 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Los gastos representan {porcentajeGastos.toFixed(1)}% de las ganancias
          </p>
        </div>
      )}
    </Card>
  );
};

export default SeguimientoCombustible;