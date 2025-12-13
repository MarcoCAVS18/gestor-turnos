import React, ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** BarChart3, Package, Clock, DollarSign, TrendingUp ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import ***REMOVED***
  calculateAveragePerOrder,
  calculateAveragePerHour,
  calculateNetEarnings,
  sortPlatforms
***REMOVED*** from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';

const ComparacionPlataformas = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [sortBy, setSortBy] = useState('totalGanado');

  const plataformas = useMemo(() => Object.values(deliveryStats.turnosPorPlataforma), [deliveryStats]);

  const plataformasConMetricas = useMemo(() => plataformas.map(plataforma => (***REMOVED***
    ...plataforma,
    promedioPorPedido: calculateAveragePerOrder(plataforma),
    promedioPorHora: calculateAveragePerHour(plataforma),
    gananciaLiquida: calculateNetEarnings(plataforma)
  ***REMOVED***)), [plataformas]);

  const plataformasOrdenadas = useMemo(() => sortPlatforms(plataformasConMetricas, sortBy), [plataformasConMetricas, sortBy]);

  const totals = useMemo(() => ***REMOVED***
    const initialTotals = ***REMOVED***
      totalGanado: 0,
      totalPedidos: 0,
      totalPropinas: 0,
    ***REMOVED***;
    
    plataformasConMetricas.forEach(p => ***REMOVED***
      initialTotals.totalGanado += p.totalGanado;
      initialTotals.totalPedidos += p.totalPedidos;
      initialTotals.totalPropinas += p.totalPropinas;
    ***REMOVED***);

    initialTotals.maxPromedioPorHora = Math.max(...plataformasConMetricas.map(p => p.promedioPorHora), 0);
    
    return initialTotals;
  ***REMOVED***, [plataformasConMetricas]);

  const summaryInfo = useMemo(() => ***REMOVED***
    const bestPlatform = plataformasOrdenadas[0];
    if (!bestPlatform) return ***REMOVED*** bestLabel: '', bestValue: '', avgLabel: '', avgValue: '' ***REMOVED***;

    switch (sortBy) ***REMOVED***
      case 'totalPedidos':
        return ***REMOVED***
          bestLabel: 'Más pedidos',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Total pedidos',
          avgValue: totals.totalPedidos
        ***REMOVED***;
      case 'promedioPorHora':
        return ***REMOVED***
          bestLabel: 'Mejor promedio/hora',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Promedio general',
          avgValue: formatCurrency(totals.totalGanado / (plataformas.reduce((acc, p) => acc + p.totalHoras, 0) || 1))
        ***REMOVED***;
      case 'totalPropinas':
        return ***REMOVED***
          bestLabel: 'Más propinas',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Total propinas',
          avgValue: formatCurrency(totals.totalPropinas)
        ***REMOVED***;
      default:
        return ***REMOVED***
          bestLabel: 'Más rentable',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Total ganado',
          avgValue: formatCurrency(totals.totalGanado)
        ***REMOVED***;
    ***REMOVED***
  ***REMOVED***, [sortBy, plataformasOrdenadas, totals, plataformas]);

  if (plataformas.length === 0) ***REMOVED***
    return (
      <Card>
        <div className="text-center py-6">
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

  const getMetricDetails = (plataforma) => ***REMOVED***
    let mainStat, percentage, label, icon, progressColor;
    switch (sortBy) ***REMOVED***
      case 'totalPedidos':
        mainStat = plataforma.totalPedidos;
        percentage = totals.totalPedidos > 0 ? (plataforma.totalPedidos / totals.totalPedidos) * 100 : 0;
        label = 'pedidos';
        icon = <Package size=***REMOVED***18***REMOVED*** className="text-blue-500" />;
        progressColor = '#3b82f6'; // blue-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: mainStat ***REMOVED***;
      case 'promedioPorHora':
        mainStat = plataforma.promedioPorHora;
        percentage = totals.maxPromedioPorHora > 0 ? (mainStat / totals.maxPromedioPorHora) * 100 : 0;
        label = '/hora';
        icon = <Clock size=***REMOVED***18***REMOVED*** className="text-purple-500" />;
        progressColor = '#8b5cf6'; // purple-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) ***REMOVED***;
      case 'totalPropinas':
        mainStat = plataforma.totalPropinas;
        percentage = totals.totalPropinas > 0 ? (plataforma.totalPropinas / totals.totalPropinas) * 100 : 0;
        label = 'propinas';
        icon = <TrendingUp size=***REMOVED***18***REMOVED*** className="text-orange-500" />;
        progressColor = '#f97316'; // orange-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) ***REMOVED***;
      case 'totalGanado':
      default:
        mainStat = plataforma.totalGanado;
        percentage = totals.totalGanado > 0 ? (plataforma.totalGanado / totals.totalGanado) * 100 : 0;
        label = 'ganancias';
        icon = <DollarSign size=***REMOVED***18***REMOVED*** className="text-green-500" />;
        progressColor = '#22c55e'; // green-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) ***REMOVED***;
    ***REMOVED***
  ***REMOVED***;

  const getSortButtonClass = (sortType) => ***REMOVED***
    return `px-2 py-1 rounded transition-colors text-sm $***REMOVED***
      sortBy === sortType 
        ? 'text-white' 
        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
    ***REMOVED***`;
  ***REMOVED***;

  return (
    <Card>
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Comparación de Plataformas
        </h3>
      </Flex>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick=***REMOVED***() => setSortBy('totalGanado')***REMOVED***
            className=***REMOVED***getSortButtonClass('totalGanado')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'totalGanado' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Ganancias
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('totalPedidos')***REMOVED***
            className=***REMOVED***getSortButtonClass('totalPedidos')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'totalPedidos' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Pedidos
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('promedioPorHora')***REMOVED***
            className=***REMOVED***getSortButtonClass('promedioPorHora')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'promedioPorHora' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Por hora
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('totalPropinas')***REMOVED***
            className=***REMOVED***getSortButtonClass('totalPropinas')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'totalPropinas' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Propinas
          </button>
        </div>
      </div>

      <div className="space-y-3">
        ***REMOVED***plataformasOrdenadas.map((plataforma) => ***REMOVED***
          const ***REMOVED*** formattedMainStat, percentage, icon, progressColor ***REMOVED*** = getMetricDetails(plataforma);
          
          return (
            <div 
              key=***REMOVED***plataforma.nombre***REMOVED***
              className="p-3 rounded-lg border border-gray-200/80 bg-white"
            >
              <Flex variant="start-between" className="mb-2">
                <Flex>
                  <div className="mr-3 flex-shrink-0">
                    <WorkAvatar nombre=***REMOVED***plataforma.nombre***REMOVED*** color=***REMOVED***plataforma.color***REMOVED*** size='md' />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      ***REMOVED***plataforma.nombre***REMOVED***
                    </h4>
                    <p className="text-sm text-gray-500">
                      ***REMOVED***plataforma.turnos***REMOVED*** turnos
                    </p>
                  </div>
                </Flex>
                <div className="text-right">
                  <Flex variant="center" className="gap-1 justify-end">
                    ***REMOVED***icon***REMOVED***
                    <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color: plataforma.color || colors.primary ***REMOVED******REMOVED***>
                      ***REMOVED***formattedMainStat***REMOVED***
                    </p>
                  </Flex>
                  <p className="text-sm font-medium text-gray-500">***REMOVED***percentage.toFixed(1)***REMOVED***%</p>
                </div>
              </Flex>

              <div className="mb-2">
                <ProgressBar
                  value=***REMOVED***percentage***REMOVED***
                  color=***REMOVED***progressColor***REMOVED***
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <StatItem icon=***REMOVED***DollarSign***REMOVED*** value=***REMOVED***formatCurrency(plataforma.promedioPorPedido)***REMOVED*** label="/pedido" color="text-green-500" />
                <StatItem icon=***REMOVED***Package***REMOVED*** value=***REMOVED***plataforma.totalPedidos***REMOVED*** label="pedidos" color="text-blue-500" />
                <StatItem icon=***REMOVED***Clock***REMOVED*** value=***REMOVED***formatCurrency(plataforma.promedioPorHora)***REMOVED*** label="/hora" color="text-purple-500" />
                <StatItem icon=***REMOVED***TrendingUp***REMOVED*** value=***REMOVED***formatCurrency(plataforma.totalPropinas)***REMOVED*** label="propinas" color="text-orange-500" />
              </div>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-500">***REMOVED***summaryInfo.bestLabel***REMOVED***</p>
            <p className="font-semibold text-gray-700" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***summaryInfo.bestValue***REMOVED***
            </p>
          </div>
          <div>
            <p className="text-gray-500">***REMOVED***summaryInfo.avgLabel***REMOVED***</p>
            <p className="font-semibold text-gray-700" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***summaryInfo.avgValue***REMOVED***
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

const StatItem = (***REMOVED*** icon: Icon, value, label, color ***REMOVED***) => (
  <div className="text-center p-2 bg-gray-50/80 rounded-lg">
    <Flex variant="center" className="mb-1">
      <Icon size=***REMOVED***12***REMOVED*** className=***REMOVED***`mr-1 $***REMOVED***color***REMOVED***`***REMOVED*** />
      <span className="font-medium text-gray-700">***REMOVED***value***REMOVED***</span>
    </Flex>
    <p className="text-gray-600">***REMOVED***label***REMOVED***</p>
  </div>
);

export default ComparacionPlataformas;