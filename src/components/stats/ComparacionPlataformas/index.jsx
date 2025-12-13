import React, { useState, useMemo } from 'react';
import { BarChart3, Package, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import {
  calculateAveragePerOrder,
  calculateAveragePerHour,
  calculateNetEarnings,
  sortPlatforms
} from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';

const ComparacionPlataformas = ({ deliveryStats }) => {
  const colors = useThemeColors();
  const [sortBy, setSortBy] = useState('totalGanado');

  const plataformas = useMemo(() => Object.values(deliveryStats.turnosPorPlataforma), [deliveryStats]);

  const plataformasConMetricas = useMemo(() => plataformas.map(plataforma => ({
    ...plataforma,
    promedioPorPedido: calculateAveragePerOrder(plataforma),
    promedioPorHora: calculateAveragePerHour(plataforma),
    gananciaLiquida: calculateNetEarnings(plataforma)
  })), [plataformas]);

  const plataformasOrdenadas = useMemo(() => sortPlatforms(plataformasConMetricas, sortBy), [plataformasConMetricas, sortBy]);

  const totals = useMemo(() => {
    const initialTotals = {
      totalGanado: 0,
      totalPedidos: 0,
      totalPropinas: 0,
    };
    
    plataformasConMetricas.forEach(p => {
      initialTotals.totalGanado += p.totalGanado;
      initialTotals.totalPedidos += p.totalPedidos;
      initialTotals.totalPropinas += p.totalPropinas;
    });

    initialTotals.maxPromedioPorHora = Math.max(...plataformasConMetricas.map(p => p.promedioPorHora), 0);
    
    return initialTotals;
  }, [plataformasConMetricas]);

  const summaryInfo = useMemo(() => {
    const bestPlatform = plataformasOrdenadas[0];
    if (!bestPlatform) return { bestLabel: '', bestValue: '', avgLabel: '', avgValue: '' };

    switch (sortBy) {
      case 'totalPedidos':
        return {
          bestLabel: 'Más pedidos',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Total pedidos',
          avgValue: totals.totalPedidos
        };
      case 'promedioPorHora':
        return {
          bestLabel: 'Mejor promedio/hora',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Promedio general',
          avgValue: formatCurrency(totals.totalGanado / (plataformas.reduce((acc, p) => acc + p.totalHoras, 0) || 1))
        };
      case 'totalPropinas':
        return {
          bestLabel: 'Más propinas',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Total propinas',
          avgValue: formatCurrency(totals.totalPropinas)
        };
      default:
        return {
          bestLabel: 'Más rentable',
          bestValue: bestPlatform.nombre,
          avgLabel: 'Total ganado',
          avgValue: formatCurrency(totals.totalGanado)
        };
    }
  }, [sortBy, plataformasOrdenadas, totals, plataformas]);

  if (plataformas.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Sin datos de plataformas
          </h3>
          <p className="text-gray-500">
            Los datos aparecerán al registrar turnos
          </p>
        </div>
      </Card>
    );
  }

  const getMetricDetails = (plataforma) => {
    let mainStat, percentage, label, icon, progressColor;
    switch (sortBy) {
      case 'totalPedidos':
        mainStat = plataforma.totalPedidos;
        percentage = totals.totalPedidos > 0 ? (plataforma.totalPedidos / totals.totalPedidos) * 100 : 0;
        label = 'pedidos';
        icon = <Package size={18} className="text-blue-500" />;
        progressColor = '#3b82f6'; // blue-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: mainStat };
      case 'promedioPorHora':
        mainStat = plataforma.promedioPorHora;
        percentage = totals.maxPromedioPorHora > 0 ? (mainStat / totals.maxPromedioPorHora) * 100 : 0;
        label = '/hora';
        icon = <Clock size={18} className="text-purple-500" />;
        progressColor = '#8b5cf6'; // purple-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) };
      case 'totalPropinas':
        mainStat = plataforma.totalPropinas;
        percentage = totals.totalPropinas > 0 ? (plataforma.totalPropinas / totals.totalPropinas) * 100 : 0;
        label = 'propinas';
        icon = <TrendingUp size={18} className="text-orange-500" />;
        progressColor = '#f97316'; // orange-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) };
      case 'totalGanado':
      default:
        mainStat = plataforma.totalGanado;
        percentage = totals.totalGanado > 0 ? (plataforma.totalGanado / totals.totalGanado) * 100 : 0;
        label = 'ganancias';
        icon = <DollarSign size={18} className="text-green-500" />;
        progressColor = '#22c55e'; // green-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) };
    }
  };

  const getSortButtonClass = (sortType) => {
    return `px-2 py-1 rounded transition-colors text-sm ${
      sortBy === sortType 
        ? 'text-white' 
        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
    }`;
  };

  return (
    <Card>
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2" />
          Comparación de Plataformas
        </h3>
      </Flex>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortBy('totalGanado')}
            className={getSortButtonClass('totalGanado')}
            style={{ backgroundColor: sortBy === 'totalGanado' ? colors.primary : undefined }}
          >
            Ganancias
          </button>
          <button
            onClick={() => setSortBy('totalPedidos')}
            className={getSortButtonClass('totalPedidos')}
            style={{ backgroundColor: sortBy === 'totalPedidos' ? colors.primary : undefined }}
          >
            Pedidos
          </button>
          <button
            onClick={() => setSortBy('promedioPorHora')}
            className={getSortButtonClass('promedioPorHora')}
            style={{ backgroundColor: sortBy === 'promedioPorHora' ? colors.primary : undefined }}
          >
            Por hora
          </button>
          <button
            onClick={() => setSortBy('totalPropinas')}
            className={getSortButtonClass('totalPropinas')}
            style={{ backgroundColor: sortBy === 'totalPropinas' ? colors.primary : undefined }}
          >
            Propinas
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {plataformasOrdenadas.map((plataforma) => {
          const { formattedMainStat, percentage, icon, progressColor } = getMetricDetails(plataforma);
          
          return (
            <div 
              key={plataforma.nombre}
              className="p-3 rounded-lg border border-gray-200/80 bg-white"
            >
              <Flex variant="start-between" className="mb-2">
                <Flex>
                  <div className="mr-3 flex-shrink-0">
                    <WorkAvatar nombre={plataforma.nombre} color={plataforma.color} size='md' />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {plataforma.nombre}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {plataforma.turnos} turnos
                    </p>
                  </div>
                </Flex>
                <div className="text-right">
                  <Flex variant="center" className="gap-1 justify-end">
                    {icon}
                    <p className="text-lg font-bold" style={{ color: plataforma.color || colors.primary }}>
                      {formattedMainStat}
                    </p>
                  </Flex>
                  <p className="text-sm font-medium text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              </Flex>

              <div className="mb-2">
                <ProgressBar
                  value={percentage}
                  color={progressColor}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <StatItem icon={DollarSign} value={formatCurrency(plataforma.promedioPorPedido)} label="/pedido" color="text-green-500" />
                <StatItem icon={Package} value={plataforma.totalPedidos} label="pedidos" color="text-blue-500" />
                <StatItem icon={Clock} value={formatCurrency(plataforma.promedioPorHora)} label="/hora" color="text-purple-500" />
                <StatItem icon={TrendingUp} value={formatCurrency(plataforma.totalPropinas)} label="propinas" color="text-orange-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-500">{summaryInfo.bestLabel}</p>
            <p className="font-semibold text-gray-700" style={{ color: colors.primary }}>
              {summaryInfo.bestValue}
            </p>
          </div>
          <div>
            <p className="text-gray-500">{summaryInfo.avgLabel}</p>
            <p className="font-semibold text-gray-700" style={{ color: colors.primary }}>
              {summaryInfo.avgValue}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StatItem = ({ icon: Icon, value, label, color }) => (
  <div className="text-center p-2 bg-gray-50/80 rounded-lg">
    <Flex variant="center" className="mb-1">
      <Icon size={12} className={`mr-1 ${color}`} />
      <span className="font-medium text-gray-700">{value}</span>
    </Flex>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default ComparacionPlataformas;