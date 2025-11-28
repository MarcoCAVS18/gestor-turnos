import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { getRechartsConfig, PIE_CHART_COLORS } from '../../../config/chartConfig';
import { useThemeColors } from '../../../hooks/useThemeColors';

const BaseChart = ({
  data,
  chartType, // 'line', 'pie', 'area', 'bar'
  dataKeys, // Array of { key: 'name', stroke: 'color' } or string for PieChart valueKey
  nameKey, // For XAxis dataKey, or PieChart nameKey
  valueFormatter, // Function to format YAxis ticks
  tooltipFormatter, // Function to format Tooltip values
  customTooltipContent, // Custom tooltip component
  config = {}, // Optional overrides for getRechartsConfig
  pieOuterRadius = '80%', // Specific for PieChart
  pieInnerRadius = '60%', // Specific for PieChart
  showLegend = true, // Control legend visibility
  margin = { top: 5, right: 20, left: -10, bottom: 5 } // Default margins
}) => {
  const thematicColors = useThemeColors();
  const baseConfig = getRechartsConfig(thematicColors);

  // Merge base config with any overrides
  const chartConfig = {
    ...baseConfig,
    ...config,
    axis: { ...baseConfig.axis, ...config.axis },
    tooltip: { ...baseConfig.tooltip, ...config.tooltip },
    legend: { ...baseConfig.legend, ...config.legend },
  };

  if (!data || data.length === 0) {
    // This empty state is simple; more complex empty states can be handled by the parent component
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No hay datos para el gráfico.</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={margin}>
            <CartesianGrid {...chartConfig.grid} />
            <XAxis dataKey={nameKey} tick={chartConfig.axis.tick} />
            <YAxis tickFormatter={valueFormatter} tick={chartConfig.axis.tick} />
            {showLegend && <Legend {...chartConfig.legend} />}
            <Tooltip
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
            {dataKeys.map((item, index) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.stroke || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                {...chartConfig.line}
              />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={margin}>
            <CartesianGrid {...chartConfig.grid} />
            <XAxis dataKey={nameKey} tick={chartConfig.axis.tick} />
            <YAxis tickFormatter={valueFormatter} tick={chartConfig.axis.tick} />
            {showLegend && <Legend {...chartConfig.legend} />}
            <Tooltip
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
            {dataKeys.map((item, index) => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.stroke || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                fill={item.fill || thematicColors.transparent20 || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                {...chartConfig.area}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys} // For pie, dataKeys is a string for the value
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={pieOuterRadius}
              innerRadius={pieInnerRadius}
              {...chartConfig.pie}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
              ))}
            </Pie>
            {showLegend && <Legend {...chartConfig.legend} />}
            <Tooltip
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
          </PieChart>
        );
      // case 'bar': // Add bar chart logic if needed
      //   return (
      //     <BarChart ... > ... </BarChart>
      //   );
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Tipo de gráfico no soportado.</p>
          </div>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default BaseChart;