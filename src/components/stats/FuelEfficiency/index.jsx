// src/components/stats/FuelEfficiency/index.jsx

import React, { useMemo } from 'react';
import { Fuel, AlertTriangle } from 'lucide-react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

// Color coding by fuel / earnings ratio
const getDotColor = (expenses, earnings) => {
  if (!expenses || !earnings) return '#9ca3af';
  const ratio = expenses / earnings;
  if (ratio < 0.10) return '#22c55e'; // green — excellent
  if (ratio < 0.20) return '#3b82f6'; // blue  — good
  if (ratio < 0.30) return '#f59e0b'; // amber — warning
  return '#ef4444';                   // red   — high
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const ratio = d.earnings > 0 ? (d.expenses / d.earnings * 100).toFixed(1) : null;
  const ratioNum = parseFloat(ratio);
  const ratioColor = !ratio ? 'text-gray-400'
    : ratioNum < 10 ? 'text-green-500'
    : ratioNum < 20 ? 'text-blue-500'
    : ratioNum < 30 ? 'text-amber-500'
    : 'text-red-500';

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-xs min-w-[130px]">
      {d.date && <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{d.date}</p>}
      {d.platform && <p className="text-gray-400 dark:text-gray-500 mb-2">{d.platform}</p>}
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500 dark:text-gray-400">Earnings</span>
          <span className="font-medium text-green-600">{formatCurrency(d.earnings)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500 dark:text-gray-400">Fuel cost</span>
          <span className="font-medium text-red-500">{formatCurrency(d.expenses)}</span>
        </div>
        {ratio && (
          <div className="flex justify-between gap-4 pt-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">Ratio</span>
            <span className={`font-bold ${ratioColor}`}>{ratio}%</span>
          </div>
        )}
        {d.km > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 dark:text-gray-400">Distance</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{d.km} km</span>
          </div>
        )}
      </div>
    </div>
  );
};

const FuelEfficiency = ({ deliveryStats, shifts = [], className = '' }) => {
  const totalExpenses = deliveryStats?.totalExpenses || 0;
  const totalKilometers = deliveryStats?.totalKilometers || 0;
  const totalEarnings = deliveryStats?.totalEarned || 0;

  const efficiency = totalExpenses > 0 ? totalKilometers / totalExpenses : 0;
  const expensesPercentage = totalEarnings > 0 ? (totalExpenses / totalEarnings) * 100 : 0;

  // Build scatter data from individual delivery shifts.
  // Firestore delivery shifts use `baseEarnings` and `fuelExpense` as field names.
  const scatterData = useMemo(() => {
    return (shifts || [])
      .filter(s => s.type === 'delivery')
      .map(s => ({
        earnings: parseFloat(s.baseEarnings ?? s.totalEarnings ?? s.earnings) || 0,
        expenses: parseFloat(s.fuelExpense ?? s.expenses) || 0,
        km: parseFloat(s.kilometers) || 0,
        date: s.date || '',
        platform: s.platform || '',
      }))
      .filter(s => s.earnings > 0);
  }, [shifts]);

  const hasChart = scatterData.length >= 2;

  return (
    <Card className={`flex flex-col ${className}`}>
      {/* Header */}
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Fuel size={20} className="text-red-500" />
          Fuel Control
        </h3>
        {expensesPercentage > 25 && (
          <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            <AlertTriangle size={10} className="mr-1" />
            High consumption
          </div>
        )}
      </Flex>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Total fuel</p>
          <p className="text-sm font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">% earnings</p>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
            {expensesPercentage.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">km / $</p>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
            {totalExpenses > 0 ? efficiency.toFixed(1) : '—'}
          </p>
        </div>
      </div>

      {/* Scatter chart */}
      <div className="flex-grow min-h-[180px]">
        {!hasChart ? (
          <div className="h-full flex items-center justify-center py-6">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed max-w-[180px]">
              {scatterData.length === 0
                ? 'Log fuel expenses in your shifts to see the chart'
                : 'Add at least 2 shifts with fuel data to display the chart'}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 4, right: 8, bottom: 24, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis
                type="number"
                dataKey="earnings"
                name="Earnings"
                tickFormatter={(v) => `$${v}`}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                label={{
                  value: 'Earnings ($)',
                  position: 'insideBottom',
                  offset: -14,
                  fontSize: 10,
                  fill: '#9ca3af',
                }}
              />
              <YAxis
                type="number"
                dataKey="expenses"
                name="Fuel"
                tickFormatter={(v) => `$${v}`}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                label={{
                  value: 'Fuel ($)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 12,
                  fontSize: 10,
                  fill: '#9ca3af',
                }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} isAnimationActive={false}>
                {scatterData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={getDotColor(entry.expenses, entry.earnings)}
                    fillOpacity={0.85}
                    stroke="white"
                    strokeWidth={1.5}
                    r={6}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      {hasChart && (
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-gray-100 dark:border-gray-700">
          {[
            { color: '#22c55e', label: '<10%' },
            { color: '#3b82f6', label: '10–20%' },
            { color: '#f59e0b', label: '20–30%' },
            { color: '#ef4444', label: '>30%' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
          <span className="text-[10px] text-gray-400 dark:text-gray-500">fuel/earnings</span>
        </div>
      )}
    </Card>
  );
};

export default FuelEfficiency;
