// src/components/stats/EficienciaVehiculos/index.jsx

import React, { useState } from 'react';
import { Car, Fuel, Navigation, Clock } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard'; // Import BaseStatsCard
import { calculateCostPerKm, calculateVehicleEarningsPerHour, findMostEfficientVehicle } from '../../../utils/statsCalculations'; // Import utility functions

const EficienciaVehiculos = ({ deliveryStats }) => {
  const colors = useThemeColors();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => {
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  }, [deliveryStats]);

  const getVehicleIcon = (vehiculo) => {
    const icons = {
      'Bicicleta': '🚴',
      'Moto': '🏍️',
      'Auto': '🚗',
      'A pie': '🚶'
    };
    return icons[vehiculo] || '🚚';
  };

  const getVehicleColor = (vehiculo) => {
    const colors = {
      'Bicicleta': '#10B981',
      'Moto': '#F59E0B',
      'Auto': '#EF4444',
      'A pie': '#6B7280'
    };
    return colors[vehiculo] || '#8B5CF6';
  };

  const vehiculos = Object.values(deliveryStats.estadisticasPorVehiculo);

  const isEmpty = vehiculos.length === 0;

  const vehiculoMasEficiente = findMostEfficientVehicle(vehiculos);

  return (
    <BaseStatsCard
      title="Eficiencia por Vehículo"
      icon={Car}
      empty={isEmpty}
      emptyMessage="Sin datos de vehículos"
      emptyDescription="Los datos aparecerán al registrar turnos"
    >
      <div className="space-y-3">
        {vehiculos.map((vehiculo, index) => {
          const color = getVehicleColor(vehiculo.nombre);
          const icon = getVehicleIcon(vehiculo.nombre);
          const costoPorKm = calculateCostPerKm(vehiculo);
          const gananciaPorHora = calculateVehicleEarningsPerHour(vehiculo);
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-lg border border-gray-200 transition-all duration-500 ${animacionActiva ? 'scale-105 shadow-md' : 'scale-100'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{vehiculo.nombre}</h4>
                    <p className="text-sm text-gray-500">
                      {vehiculo.turnos} turnos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color }}>
                    {formatCurrency(vehiculo.totalGanado)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Navigation size={12} className="mr-1 text-purple-500" />
                    <span className="font-medium">{vehiculo.totalKilometros.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-600">km</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Fuel size={12} className="mr-1 text-red-500" />
                    <span className="font-medium">{formatCurrency(vehiculo.totalGastos)}</span>
                  </div>
                  <p className="text-xs text-gray-600">combustible</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Clock size={12} className="mr-1 text-blue-500" />
                    <span className="font-medium">{formatCurrency(gananciaPorHora)}</span>
                  </div>
                  <p className="text-xs text-gray-600">/hora</p>
                </div>
              </div>

              {vehiculo.totalGastos > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Eficiencia:</span>
                    <span className="font-medium">
                      {vehiculo.eficiencia.toFixed(1)} km/peso • {formatCurrency(costoPorKm)}/km
                    </span>
                  </div>
                  
                  {vehiculo === vehiculoMasEficiente && (
                    <div className="text-xs text-green-600 mt-1">
                      ⭐ Más eficiente
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-600">Total recorrido</p>
            <p className="font-semibold" style={{ color: colors.primary }}>
              {deliveryStats.totalKilometros.toFixed(1)} km
            </p>
          </div>
          <div>
            <p className="text-gray-600">Eficiencia promedio</p>
            <p className="font-semibold" style={{ color: colors.primary }}>
              {deliveryStats.eficienciaCombustible.toFixed(1)} km/peso
            </p>
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
};

export default EficienciaVehiculos;