// src/components/stats/EficienciaVehiculos/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Car, Fuel, Navigation, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard'; 
import ***REMOVED*** 
  calculateCostPerKm,
  calculateVehicleEarningsPerHour,
  findMostEfficientVehicle ***REMOVED*** from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';

const EficienciaVehiculos = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [deliveryStats]);

  const getVehicleIcon = (vehiculo) => ***REMOVED***
    const icons = ***REMOVED***
      'Bicicleta': '🚴',
      'Moto': '🏍️',
      'Auto': '🚗',
      'A pie': '🚶'
    ***REMOVED***;
    return icons[vehiculo] || '🚚';
  ***REMOVED***;

  const getVehicleColor = (vehiculo) => ***REMOVED***
    const colors = ***REMOVED***
      'Bicicleta': '#10B981',
      'Moto': '#F59E0B',
      'Auto': '#EF4444',
      'A pie': '#6B7280'
    ***REMOVED***;
    return colors[vehiculo] || '#8B5CF6';
  ***REMOVED***;

  const vehiculos = Object.values(deliveryStats.estadisticasPorVehiculo);

  const isEmpty = vehiculos.length === 0;

  const vehiculoMasEficiente = findMostEfficientVehicle(vehiculos);

  return (
    <BaseStatsCard
      title="Eficiencia por Vehículo"
      icon=***REMOVED***Car***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="Sin datos de vehículos"
      emptyDescription="Los datos aparecerán al registrar turnos"
    >
      <div className="space-y-3">
        ***REMOVED***vehiculos.map((vehiculo, index) => ***REMOVED***
          const color = getVehicleColor(vehiculo.nombre);
          const icon = getVehicleIcon(vehiculo.nombre);
          const costoPorKm = calculateCostPerKm(vehiculo);
          const gananciaPorHora = calculateVehicleEarningsPerHour(vehiculo);
          
          return (
            <div 
              key=***REMOVED***index***REMOVED***
              className=***REMOVED***`p-3 rounded-lg border border-gray-200 transition-all duration-500 $***REMOVED***animacionActiva ? 'scale-105 shadow-md' : 'scale-100'***REMOVED***`***REMOVED***
            >
              <Flex variant="start-between" className="mb-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">***REMOVED***icon***REMOVED***</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">***REMOVED***vehiculo.nombre***REMOVED***</h4>
                    <p className="text-sm text-gray-500">
                      ***REMOVED***vehiculo.turnos***REMOVED*** turnos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color ***REMOVED******REMOVED***>
                    ***REMOVED***formatCurrency(vehiculo.totalGanado)***REMOVED***
                  </p>
                </div>
              </Flex>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Flex variant="center" className="mb-1">
                    <Navigation size=***REMOVED***12***REMOVED*** className="mr-1 text-purple-500" />
                    <span className="font-medium">***REMOVED***vehiculo.totalKilometros.toFixed(1)***REMOVED***</span>
                  </Flex>
                  <p className="text-xs text-gray-600">km</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Flex variant="center" className="mb-1">
                    <Fuel size=***REMOVED***12***REMOVED*** className="mr-1 text-red-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(vehiculo.totalGastos)***REMOVED***</span>
                  </Flex>
                  <p className="text-xs text-gray-600">combustible</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Flex variant="center" className="mb-1">
                    <Clock size=***REMOVED***12***REMOVED*** className="mr-1 text-blue-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(gananciaPorHora)***REMOVED***</span>
                  </Flex>
                  <p className="text-xs text-gray-600">/hora</p>
                </div>
              </div>

              ***REMOVED***vehiculo.totalGastos > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Flex variant="between" className="text-sm">
                    <span className="text-gray-600">Eficiencia:</span>
                    <span className="font-medium">
                      ***REMOVED***vehiculo.eficiencia.toFixed(1)***REMOVED*** km/peso • ***REMOVED***formatCurrency(costoPorKm)***REMOVED***/km
                    </span>
                  </Flex>
                  
                  ***REMOVED***vehiculo === vehiculoMasEficiente && (
                    <div className="text-xs text-green-600 mt-1">
                      Más eficiente
                    </div>
                  )***REMOVED***
                </div>
              )***REMOVED***
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-600">Total recorrido</p>
            <p className="font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***deliveryStats.totalKilometros.toFixed(1)***REMOVED*** km
            </p>
          </div>
          <div>
            <p className="text-gray-600">Eficiencia promedio</p>
            <p className="font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***deliveryStats.eficienciaCombustible.toFixed(1)***REMOVED*** km/peso
            </p>
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default EficienciaVehiculos;