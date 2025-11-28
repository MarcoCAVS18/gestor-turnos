// src/components/stats/ComparacionPlataformas/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** BarChart3, Package, Clock, DollarSign, TrendingUp ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import ***REMOVED***
  calculateAveragePerOrder,
  calculateAveragePerHour,
  calculateNetEarnings,
  calculateEarningsPercentage,
  sortPlatforms
***REMOVED*** from '../../../utils/statsCalculations';

const ComparacionPlataformas = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [sortBy, setSortBy] = useState('totalGanado');
  const [animacionActiva, setAnimacionActiva] = useState(false);

  React.useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [deliveryStats, sortBy]);

  const plataformas = Object.values(deliveryStats.turnosPorPlataforma);

  if (plataformas.length === 0) ***REMOVED***
    return (
      <Card>
        <div className=***REMOVED***`text-center py-6 transition-opacity duration-1000 $***REMOVED***animacionActiva ? 'opacity-50' : 'opacity-100'***REMOVED***`***REMOVED***>
          <BarChart3 size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Sin datos de plataformas
          </h3>
          <p className="text-gray-500">
            Los datos aparecerán al registrar turnos
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  const plataformasConMetricas = plataformas.map(plataforma => (***REMOVED***
    ...plataforma,
    promedioPorPedido: calculateAveragePerOrder(plataforma),
    promedioPorHora: calculateAveragePerHour(plataforma),
    gananciaLiquida: calculateNetEarnings(plataforma)
  ***REMOVED***));

  const plataformasOrdenadas = sortPlatforms(plataformasConMetricas, sortBy);

  const totalGeneral = plataformas.reduce((sum, p) => sum + p.totalGanado, 0);

  const getPlataformaIcon = (nombre) => ***REMOVED***
    const icons = ***REMOVED***
      'Uber Eats': '🚗',
      'DoorDash': '🛵',
      'Rappi': '📦',
      'PedidosYa': '🏍️',
      'Menulog': '🍔',
      'Deliveroo': '🚴'
    ***REMOVED***;
    return icons[nombre] || '📱';
  ***REMOVED***;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Plataformas
        </h3>
      </div>

      <div className="mb-3">
        <div className="flex gap-1 text-sm">
          <button
            onClick=***REMOVED***() => setSortBy('totalGanado')***REMOVED***
            className=***REMOVED***`px-2 py-1 rounded transition-colors $***REMOVED***
              sortBy === 'totalGanado' 
                ? 'text-white' 
                : 'text-gray-600 bg-gray-100'
            ***REMOVED***`***REMOVED***
            style=***REMOVED******REMOVED*** 
              backgroundColor: sortBy === 'totalGanado' ? colors.primary : undefined
            ***REMOVED******REMOVED***
          >
            Ganancias
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('totalPedidos')***REMOVED***
            className=***REMOVED***`px-2 py-1 rounded transition-colors $***REMOVED***
              sortBy === 'totalPedidos' 
                ? 'text-white' 
                : 'text-gray-600 bg-gray-100'
            ***REMOVED***`***REMOVED***
            style=***REMOVED******REMOVED*** 
              backgroundColor: sortBy === 'totalPedidos' ? colors.primary : undefined
            ***REMOVED******REMOVED***
          >
            Pedidos
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('promedioPorHora')***REMOVED***
            className=***REMOVED***`px-2 py-1 rounded transition-colors $***REMOVED***
              sortBy === 'promedioPorHora' 
                ? 'text-white' 
                : 'text-gray-600 bg-gray-100'
            ***REMOVED***`***REMOVED***
            style=***REMOVED******REMOVED*** 
              backgroundColor: sortBy === 'promedioPorHora' ? colors.primary : undefined
            ***REMOVED******REMOVED***
          >
            Por hora
          </button>
        </div>
      </div>

      <div className="space-y-3">
        ***REMOVED***plataformasOrdenadas.map((plataforma, index) => ***REMOVED***
          const porcentajeGanancias = calculateEarningsPercentage(plataforma, totalGeneral);
          const icon = getPlataformaIcon(plataforma.nombre);
          
          return (
            <div 
              key=***REMOVED***plataforma.nombre***REMOVED***
              className=***REMOVED***`p-3 rounded-lg border border-gray-200 transition-all duration-500 $***REMOVED***animacionActiva ? 'scale-105 shadow-md' : 'scale-100'***REMOVED***`***REMOVED***
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">***REMOVED***icon***REMOVED***</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      ***REMOVED***plataforma.nombre***REMOVED***
                    </h4>
                    <p className="text-sm text-gray-500">
                      ***REMOVED***plataforma.turnos***REMOVED*** turnos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color: plataforma.color || colors.primary ***REMOVED******REMOVED***>
                    ***REMOVED***formatCurrency(plataforma.totalGanado)***REMOVED***
                  </p>
                  <p className="text-sm text-gray-500">***REMOVED***porcentajeGanancias.toFixed(1)***REMOVED***%</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className=***REMOVED***`h-2 rounded-full transition-all duration-500 $***REMOVED***animacionActiva ? 'animate-pulse' : ''***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** 
                      width: `$***REMOVED***porcentajeGanancias***REMOVED***%`,
                      backgroundColor: plataforma.color || colors.primary
                    ***REMOVED******REMOVED***
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Package size=***REMOVED***12***REMOVED*** className="mr-1 text-blue-500" />
                    <span className="font-medium">***REMOVED***plataforma.totalPedidos***REMOVED***</span>
                  </div>
                  <p className="text-xs text-gray-600">pedidos</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign size=***REMOVED***12***REMOVED*** className="mr-1 text-green-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(plataforma.promedioPorPedido)***REMOVED***</span>
                  </div>
                  <p className="text-xs text-gray-600">/pedido</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Clock size=***REMOVED***12***REMOVED*** className="mr-1 text-purple-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(plataforma.promedioPorHora)***REMOVED***</span>
                  </div>
                  <p className="text-xs text-gray-600">/hora</p>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp size=***REMOVED***12***REMOVED*** className="mr-1 text-orange-500" />
                    <span className="font-medium">***REMOVED***formatCurrency(plataforma.totalPropinas)***REMOVED***</span>
                  </div>
                  <p className="text-xs text-gray-600">propinas</p>
                </div>
              </div>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-600">Más rentable</p>
            <p className="font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***plataformasOrdenadas[0]?.nombre***REMOVED***
            </p>
          </div>
          <div>
            <p className="text-gray-600">Promedio general</p>
            <p className="font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***formatCurrency(totalGeneral / plataformas.length)***REMOVED***
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default ComparacionPlataformas;