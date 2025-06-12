// src/components/stats/EficienciaVehiculos/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Car, Fuel, Navigation, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const EficienciaVehiculos = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [deliveryStats]);

  const formatCurrency = (amount) => ***REMOVED***
    return new Intl.NumberFormat('es-AR', ***REMOVED***
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    ***REMOVED***).format(amount);
  ***REMOVED***;

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

  if (vehiculos.length === 0) ***REMOVED***
    return (
      <Card>
        <div className=***REMOVED***`text-center py-6 transition-opacity duration-1000 $***REMOVED***animacionActiva ? 'opacity-50' : 'opacity-100'***REMOVED***`***REMOVED***>
          <Car size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Sin datos de vehículos
          </h3>
          <p className="text-gray-500">
            Los datos aparecerán al registrar turnos
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  const vehiculoMasEficiente = vehiculos.reduce((mejor, actual) => ***REMOVED***
    return actual.eficiencia > mejor.eficiencia ? actual : mejor;
  ***REMOVED***, vehiculos[0]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Car size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
          Eficiencia por Vehículo
        </h3>
      </div>

      <div className="space-y-3">
        ***REMOVED***vehiculos.map((vehiculo, index) => ***REMOVED***
          const color = getVehicleColor(vehiculo.nombre);
          const icon = getVehicleIcon(vehiculo.nombre);
          const costoPorKm = vehiculo.totalKilometros > 0 ? vehiculo.totalGastos / vehiculo.totalKilometros : 0;
          const gananciaPorHora = vehiculo.totalHoras > 0 ? vehiculo.totalGanado / vehiculo.totalHoras : 0;
          
          return (
            <div 
              key=***REMOVED***index***REMOVED***
              className=***REMOVED***`p-3 rounded-lg border border-gray-200 transition-all duration-500 $***REMOVED***animacionActiva ? 'scale-105 shadow-md' : 'scale-100'***REMOVED***`***REMOVED***
            >
              <div className="flex items-start justify-between mb-2">
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
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Navigation size=***REMOVED***12***REMOVED*** className="mr-1 text-purple-500" />
                    <span className="font-medium">***REMOVED***vehiculo.totalKilometros.toFixed(1)***REMOVED***</span>
                  </div>
                  <p className="text-xs text-gray-600">km</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Fuel size=***REMOVED***12***REMOVED*** className="mr-1 text-red-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(vehiculo.totalGastos)***REMOVED***</span>
                  </div>
                  <p className="text-xs text-gray-600">combustible</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Clock size=***REMOVED***12***REMOVED*** className="mr-1 text-blue-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(gananciaPorHora)***REMOVED***</span>
                  </div>
                  <p className="text-xs text-gray-600">/hora</p>
                </div>
              </div>

              ***REMOVED***vehiculo.totalGastos > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Eficiencia:</span>
                    <span className="font-medium">
                      ***REMOVED***vehiculo.eficiencia.toFixed(1)***REMOVED*** km/peso • ***REMOVED***formatCurrency(costoPorKm)***REMOVED***/km
                    </span>
                  </div>
                  
                  ***REMOVED***vehiculo === vehiculoMasEficiente && (
                    <div className="text-xs text-green-600 mt-1">
                      ⭐ Más eficiente
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
            <p className="font-semibold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
              ***REMOVED***deliveryStats.totalKilometros.toFixed(1)***REMOVED*** km
            </p>
          </div>
          <div>
            <p className="text-gray-600">Eficiencia promedio</p>
            <p className="font-semibold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
              ***REMOVED***deliveryStats.eficienciaCombustible.toFixed(1)***REMOVED*** km/peso
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default EficienciaVehiculos;