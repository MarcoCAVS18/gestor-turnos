// src/config/chartConfig.js

import ***REMOVED*** TrendingUp, Clock, PieChart ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../utils/currency';

// Configuración estática de los tipos de gráficos disponibles
export const CHART_CONFIGS = [
  ***REMOVED***
    id: 'evolution',
    title: 'Evolución Semanal',
    subtitle: 'Progreso de ganancias',
    icon: TrendingUp,
    type: 'line'
  ***REMOVED***,
  ***REMOVED***
    id: 'works',
    title: 'Por Trabajos',
    subtitle: 'Distribución de ganancias',
    icon: PieChart,
    type: 'pie'
  ***REMOVED***,
  ***REMOVED***
    id: 'daily',
    title: 'Horas Diarias',
    subtitle: 'Distribución semanal',
    icon: Clock,
    type: 'area'
  ***REMOVED***
];

// Colores planos para gráfico de torta, en caso de que el trabajo no tenga color
export const PIE_CHART_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
];

/**
 * Genera la configuración dinámica para los componentes de Recharts.
 * @param ***REMOVED***object***REMOVED*** thematicColors - Objeto de colores del tema (e.g., ***REMOVED*** primary, success, ... ***REMOVED***)
 * @returns ***REMOVED***object***REMOVED*** - Objeto de configuración para Recharts
 */
export const getRechartsConfig = (thematicColors) => ***REMOVED***
  const colors = thematicColors || ***REMOVED******REMOVED***;
  
  return ***REMOVED***
    grid: ***REMOVED***
      stroke: '#e5e7eb',
      strokeDasharray: '3 3',
    ***REMOVED***,
    axis: ***REMOVED***
      tick: ***REMOVED*** fill: '#6b7280', fontSize: 11 ***REMOVED***,
      line: ***REMOVED*** stroke: '#d1d5db' ***REMOVED***,
    ***REMOVED***,
    line: ***REMOVED***
      stroke: colors.primary || '#EC4899',
      strokeWidth: 2,
      dot: ***REMOVED***
        r: 4,
        fill: colors.primary || '#EC4899',
        stroke: 'white',
        strokeWidth: 2,
      ***REMOVED***,
      activeDot: ***REMOVED***
        r: 6,
        stroke: colors.primary || '#EC4899',
        fill: 'white',
        strokeWidth: 2,
      ***REMOVED***,
    ***REMOVED***,
    area: ***REMOVED***
      stroke: colors.primary || '#EC4899',
      fill: colors.transparent20 || 'rgba(236, 72, 153, 0.2)',
    ***REMOVED***,
    bar: ***REMOVED***
      fill: colors.primary || '#EC4899',
    ***REMOVED***,
    pie: ***REMOVED***
      innerRadius: '60%',
      outerRadius: '100%',
      paddingAngle: 2,
    ***REMOVED***,
    tooltip: ***REMOVED***
      cursor: ***REMOVED*** fill: 'rgba(200, 200, 200, 0.1)' ***REMOVED***,
      contentStyle: ***REMOVED***
        backgroundColor: 'white',
        border: `1px solid $***REMOVED***colors.border || '#e5e7eb'***REMOVED***`,
        borderRadius: '0.5rem',
        fontSize: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      ***REMOVED***,
      labelStyle: ***REMOVED*** display: 'none' ***REMOVED***,
    ***REMOVED***,
    legend: ***REMOVED***
      verticalAlign: 'bottom',
      height: 36,
      wrapperStyle: ***REMOVED*** fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' ***REMOVED***,
    ***REMOVED***,
    customTooltip: (***REMOVED*** active, payload, label ***REMOVED***) => ***REMOVED***
      if (active && payload && payload.length) ***REMOVED***
        return (
          <div className="p-2 bg-white rounded-lg shadow-lg border border-gray-200">
            <p className="font-bold text-sm">***REMOVED***label***REMOVED***</p>
            ***REMOVED***payload.map((p, i) => (
              <p key=***REMOVED***i***REMOVED*** style=***REMOVED******REMOVED*** color: p.color || p.fill ***REMOVED******REMOVED***>
                ***REMOVED***`$***REMOVED***p.name***REMOVED***: $***REMOVED***formatCurrency(p.value)***REMOVED***`***REMOVED***
              </p>
            ))***REMOVED***
          </div>
        );
      ***REMOVED***
      return null;
    ***REMOVED***
  ***REMOVED***;
***REMOVED***;