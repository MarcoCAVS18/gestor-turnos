// src/config/chartConfig.js

import { TrendingUp, Clock, PieChart } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

// Static configuration of available chart types
export const CHART_CONFIGS = [
  {
    id: 'evolution',
    title: 'Weekly Evolution',
    subtitle: 'Earnings progress',
    icon: TrendingUp,
    type: 'line'
  },
  {
    id: 'works',
    title: 'By Works',
    subtitle: 'Earnings distribution',
    icon: PieChart,
    type: 'pie'
  },
  {
    id: 'daily',
    title: 'Daily Hours',
    subtitle: 'Weekly distribution',
    icon: Clock,
    type: 'area'
  }
];

// Flat colors for pie chart, in case the work doesn't have a color
export const PIE_CHART_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
];

/**
 * Genera la configuración dinámica para los componentes de Recharts.
 * @param {object} thematicColors - Objeto de colores del tema (e.g., { primary, success, ... })
 * @returns {object} - Objeto de configuración para Recharts
 */
export const getRechartsConfig = (thematicColors) => {
  const colors = thematicColors || {};
  
  return {
    grid: {
      stroke: '#e5e7eb',
      strokeDasharray: '3 3',
    },
    axis: {
      tick: { fill: '#6b7280', fontSize: 11 },
      line: { stroke: '#d1d5db' },
    },
    line: {
      stroke: colors.primary || '#EC4899',
      strokeWidth: 2,
      dot: {
        r: 4,
        fill: colors.primary || '#EC4899',
        stroke: 'white',
        strokeWidth: 2,
      },
      activeDot: {
        r: 6,
        stroke: colors.primary || '#EC4899',
        fill: 'white',
        strokeWidth: 2,
      },
    },
    area: {
      stroke: colors.primary || '#EC4899',
      fill: colors.transparent20 || 'rgba(236, 72, 153, 0.2)',
    },
    bar: {
      fill: colors.primary || '#EC4899',
    },
    pie: {
      innerRadius: '60%',
      outerRadius: '100%',
      paddingAngle: 2,
    },
    tooltip: {
      cursor: { fill: 'rgba(200, 200, 200, 0.1)' },
      contentStyle: {
        backgroundColor: 'white',
        border: `1px solid ${colors.border || '#e5e7eb'}`,
        borderRadius: '0.5rem',
        fontSize: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      labelStyle: { display: 'none' },
    },
    legend: {
      verticalAlign: 'bottom',
      height: 36,
      wrapperStyle: { fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    },
    customTooltip: ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="p-2 bg-white rounded-lg shadow-lg border border-gray-200">
            <p className="font-bold text-sm">{label}</p>
            {payload.map((p, i) => (
              <p key={i} style={{ color: p.color || p.fill }}>
                {`${p.name}: ${formatCurrency(p.value)}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    }
  };
};