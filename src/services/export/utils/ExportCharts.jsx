// src/services/export/utils/ExportCharts.jsx

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
  AreaChart, Area,
  ResponsiveContainer
} from 'recharts';

// Default colors for charts
const CHART_COLORS = {
  primary: '#EC4899',
  secondary: '#3B82F6',
  tertiary: '#10B981',
  quaternary: '#F59E0B',
  quinary: '#8B5CF6',
  senary: '#EF4444'
};

const DEFAULT_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
  CHART_COLORS.senary
];

// Format currency for tooltips
const formatCurrency = (value) => `$${value.toFixed(2)}`;
const formatHours = (value) => `${value.toFixed(1)}h`;

/**
 * Weekly Evolution Line Chart
 * Shows earnings trend over the last 4 weeks
 */
export const WeeklyEvolutionChart = ({ data, primaryColor = CHART_COLORS.primary, width = 500, height = 300 }) => (
  <div style={{ width, height, backgroundColor: '#ffffff', padding: '10px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
      Weekly Evolution
    </h3>
    <ResponsiveContainer width="100%" height={height - 40}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickFormatter={(v) => `$${v}`}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value), name === 'earnings' ? 'Earnings' : 'Hours']}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
        />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke={primaryColor}
          strokeWidth={3}
          dot={{ fill: primaryColor, r: 5, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, fill: primaryColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Work Distribution Pie Chart
 * Shows earnings distribution by work/job
 */
export const WorkDistributionChart = ({ data, width = 400, height = 300 }) => (
  <div style={{ width, height, backgroundColor: '#ffffff', padding: '10px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
      Earnings by Work
    </h3>
    <ResponsiveContainer width="100%" height={height - 40}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="75%"
          paddingAngle={2}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatCurrency(value), 'Earnings']}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Daily Earnings Area Chart
 * Shows earnings distribution across days of the week
 */
export const DailyEarningsChart = ({ data, primaryColor = CHART_COLORS.primary, width = 500, height = 300 }) => (
  <div style={{ width, height, backgroundColor: '#ffffff', padding: '10px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
      Daily Earnings
    </h3>
    <ResponsiveContainer width="100%" height={height - 40}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickFormatter={(v) => `$${v}`}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'earnings' ? formatCurrency(value) : formatHours(value),
            name === 'earnings' ? 'Earnings' : 'Hours'
          ]}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
        />
        <Area
          type="monotone"
          dataKey="earnings"
          stroke={primaryColor}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorEarnings)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Shift Type Distribution Bar Chart
 * Shows earnings by shift type (day, afternoon, night, etc.)
 */
export const ShiftTypeChart = ({ data, width = 400, height = 300 }) => (
  <div style={{ width, height, backgroundColor: '#ffffff', padding: '10px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
      Shift Type Distribution
    </h3>
    <ResponsiveContainer width="100%" height={height - 40}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickFormatter={(v) => `$${v}`}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: '#d1d5db' }}
          width={50}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value), 'Earnings']}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Platform Comparison Bar Chart
 * Shows earnings by delivery platform
 */
export const PlatformComparisonChart = ({ data, width = 600, height = 250 }) => (
  <div style={{ width, height, backgroundColor: '#ffffff', padding: '10px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
      Platform Comparison
    </h3>
    <ResponsiveContainer width="100%" height={height - 40}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickFormatter={(v) => `$${v}`}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'earnings' ? formatCurrency(value) : value,
            name === 'earnings' ? 'Earnings' : 'Orders'
          ]}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
        />
        <Legend />
        <Bar dataKey="earnings" name="Earnings" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Monthly Trend Line Chart
 * Shows earnings trend over recent months
 */
export const MonthlyTrendChart = ({ data, primaryColor = CHART_COLORS.primary, secondaryColor = CHART_COLORS.secondary, width = 500, height = 300 }) => (
  <div style={{ width, height, backgroundColor: '#ffffff', padding: '10px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
      Monthly Trend
    </h3>
    <ResponsiveContainer width="100%" height={height - 40}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickFormatter={(v) => `$${v}`}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickFormatter={(v) => `${v}h`}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'earnings' ? formatCurrency(value) : formatHours(value),
            name === 'earnings' ? 'Earnings' : 'Hours'
          ]}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="earnings"
          name="Earnings"
          stroke={primaryColor}
          strokeWidth={2}
          dot={{ fill: primaryColor, r: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="hours"
          name="Hours"
          stroke={secondaryColor}
          strokeWidth={2}
          dot={{ fill: secondaryColor, r: 4 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * KPI Card Component for PDF
 * Displays a single metric with label and value
 */
export const KPICard = ({ label, value, color = CHART_COLORS.primary, width = 150, height = 80 }) => (
  <div style={{
    width,
    height,
    backgroundColor: '#ffffff',
    border: `2px solid ${color}`,
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{ fontSize: '24px', fontWeight: '700', color: color }}>
      {value}
    </div>
    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', textAlign: 'center' }}>
      {label}
    </div>
  </div>
);

/**
 * KPI Row Component for PDF
 * Displays multiple KPI cards in a row
 */
export const KPIRow = ({ kpis, width = 600, height = 100 }) => (
  <div style={{
    width,
    height,
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px'
  }}>
    {kpis.map((kpi, index) => (
      <KPICard
        key={index}
        label={kpi.label}
        value={kpi.value}
        color={kpi.color || CHART_COLORS.primary}
        width={(width - 40) / kpis.length - 10}
        height={height - 20}
      />
    ))}
  </div>
);

/**
 * Comparison Widget for PDF
 * Shows current vs previous values with change indicator
 */
export const ComparisonWidget = ({ current, previous, label, format = 'currency', color = CHART_COLORS.primary, width = 200, height = 100 }) => {
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const isPositive = change >= 0;
  const formatValue = (v) => format === 'currency' ? `$${v.toFixed(2)}` : `${v.toFixed(1)}h`;

  return (
    <div style={{
      width,
      height,
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontSize: '11px', color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: color }}>
        {formatValue(current)}
      </div>
      <div style={{
        fontSize: '12px',
        color: isPositive ? '#10B981' : '#EF4444',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
        <span style={{ fontSize: '10px', color: '#9ca3af' }}>vs prev</span>
      </div>
    </div>
  );
};

const ExportChartsModule = {
  WeeklyEvolutionChart,
  WorkDistributionChart,
  DailyEarningsChart,
  ShiftTypeChart,
  PlatformComparisonChart,
  MonthlyTrendChart,
  KPICard,
  KPIRow,
  ComparisonWidget,
  CHART_COLORS,
  DEFAULT_COLORS
};

export default ExportChartsModule;
