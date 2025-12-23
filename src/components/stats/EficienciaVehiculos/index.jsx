// src/components/stats/EficienciaVehiculos/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Car, Bike, Footprints, Fuel, Navigation, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard'; 
import ***REMOVED*** 
  calculateCostPerKm,
  calculateVehicleEarningsPerHour,
  findMostEfficientVehicle 
***REMOVED*** from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';
import ***REMOVED*** DELIVERY_VEHICLES ***REMOVED*** from '../../../constants/delivery';

// Definimos el icono personalizado de Moto aquí para uso local
const MotorbikeIcon = (***REMOVED*** size = 24, className = "", ...props ***REMOVED***) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width=***REMOVED***size***REMOVED*** 
    height=***REMOVED***size***REMOVED*** 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className=***REMOVED***className***REMOVED***
    ***REMOVED***...props***REMOVED***
  >
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6l-1 6-5 4" />
    <path d="M5.5 17.5V11l2-4.5 3.5 3L15 6h4" />
  </svg>
);

const EficienciaVehiculos = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [deliveryStats]);

  // Helper para obtener el componente de icono correcto
  const getVehicleIconComponent = (nombreVehiculo) => ***REMOVED***
    // Normalizamos a minúsculas para comparar con seguridad o usamos el nombre directo
    // Asumiendo que 'nombre' en deliveryStats coincide con 'nombre' en DELIVERY_VEHICLES
    switch (nombreVehiculo) ***REMOVED***
      case 'Bicicleta': return Bike;
      case 'Moto': return MotorbikeIcon;
      case 'Auto': return Car;
      case 'A pie': return Footprints;
      default: return Car;
    ***REMOVED***
  ***REMOVED***;

  // Helper para buscar el color en la constante
  const getVehicleColor = (nombreVehiculo) => ***REMOVED***
    const vehiculoFound = DELIVERY_VEHICLES.find(v => v.nombre === nombreVehiculo);
    return vehiculoFound ? vehiculoFound.color : '#8B5CF6'; // fallback color
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
          const IconComponent = getVehicleIconComponent(vehiculo.nombre);
          
          const costoPorKm = calculateCostPerKm(vehiculo);
          const gananciaPorHora = calculateVehicleEarningsPerHour(vehiculo);
          
          return (
            <div 
              key=***REMOVED***index***REMOVED***
              className=***REMOVED***`p-3 rounded-lg border border-gray-200 transition-all duration-500 $***REMOVED***animacionActiva ? 'scale-105 shadow-md' : 'scale-100'***REMOVED***`***REMOVED***
              style=***REMOVED******REMOVED*** borderLeft: `4px solid $***REMOVED***color***REMOVED***` ***REMOVED******REMOVED***
            >
              <Flex variant="start-between" className="mb-2">
                <div className="flex items-center gap-3">
                  ***REMOVED***/* Icono con fondo suave del color del vehículo */***REMOVED***
                  <div 
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style=***REMOVED******REMOVED*** backgroundColor: `$***REMOVED***color***REMOVED***15` ***REMOVED******REMOVED*** // 15 es aprox 10% de opacidad hex
                  >
                    <IconComponent size=***REMOVED***20***REMOVED*** color=***REMOVED***color***REMOVED*** />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 leading-tight">
                      ***REMOVED***vehiculo.nombre***REMOVED***
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ***REMOVED***vehiculo.turnos***REMOVED*** ***REMOVED***vehiculo.turnos === 1 ? 'turno' : 'turnos'***REMOVED***
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color ***REMOVED******REMOVED***>
                    ***REMOVED***formatCurrency(vehiculo.totalGanado)***REMOVED***
                  </p>
                </div>
              </Flex>

              <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                <div className="text-center p-2 bg-gray-50 rounded border border-gray-100">
                  <Flex variant="center" className="mb-1">
                    <Navigation size=***REMOVED***12***REMOVED*** className="mr-1.5 text-purple-500" />
                    <span className="font-medium">***REMOVED***vehiculo.totalKilometros.toFixed(1)***REMOVED***</span>
                  </Flex>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">km</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded border border-gray-100">
                  <Flex variant="center" className="mb-1">
                    <Fuel size=***REMOVED***12***REMOVED*** className="mr-1.5 text-red-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(vehiculo.totalGastos)***REMOVED***</span>
                  </Flex>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">gastos</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded border border-gray-100">
                  <Flex variant="center" className="mb-1">
                    <Clock size=***REMOVED***12***REMOVED*** className="mr-1.5 text-blue-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(gananciaPorHora)***REMOVED***</span>
                  </Flex>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">/hora</p>
                </div>
              </div>

              ***REMOVED***vehiculo.totalGastos > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <Flex variant="between" className="text-sm">
                    <span className="text-gray-600 text-xs">Eficiencia:</span>
                    <span className="font-medium text-xs">
                      ***REMOVED***vehiculo.eficiencia.toFixed(1)***REMOVED*** km/$ • ***REMOVED***formatCurrency(costoPorKm)***REMOVED***/km
                    </span>
                  </Flex>
                  
                  ***REMOVED***vehiculo === vehiculoMasEficiente && (
                    <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                       Vehículo más eficiente
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
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total recorrido</p>
            <p className="font-bold text-lg" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***deliveryStats.totalKilometros.toFixed(1)***REMOVED*** <span className="text-sm font-normal text-gray-500">km</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Eficiencia media</p>
            <p className="font-bold text-lg" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***deliveryStats.eficienciaCombustible.toFixed(1)***REMOVED*** <span className="text-sm font-normal text-gray-500">km/$</span>
            </p>
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default EficienciaVehiculos;