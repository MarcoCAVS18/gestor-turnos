import React from 'react';
import ***REMOVED*** LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area ***REMOVED*** from 'recharts';
import Flex from '../../ui/Flex';
import ***REMOVED*** getRechartsConfig, PIE_CHART_COLORS ***REMOVED*** from '../../../config/chartConfig';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const BaseChart = (***REMOVED***
  data,
  chartType, // 'line', 'pie', 'area', 'bar'
  dataKeys, // Array of ***REMOVED*** key: 'name', stroke: 'color' ***REMOVED*** or string for PieChart valueKey
  nameKey, // For XAxis dataKey, or PieChart nameKey
  valueFormatter, // Function to format YAxis ticks
  tooltipFormatter, // Function to format Tooltip values
  customTooltipContent, // Custom tooltip component
  config = ***REMOVED******REMOVED***, // Optional overrides for getRechartsConfig
  pieOuterRadius = '80%', // Specific for PieChart
  pieInnerRadius = '60%', // Specific for PieChart
  showLegend = true, // Control legend visibility
  margin = ***REMOVED*** top: 5, right: 20, left: -10, bottom: 5 ***REMOVED*** // Default margins
***REMOVED***) => ***REMOVED***
  const thematicColors = useThemeColors();
  const baseConfig = getRechartsConfig(thematicColors);

  // Merge base config with any overrides
  const chartConfig = ***REMOVED***
    ...baseConfig,
    ...config,
    axis: ***REMOVED*** ...baseConfig.axis, ...config.axis ***REMOVED***,
    tooltip: ***REMOVED*** ...baseConfig.tooltip, ...config.tooltip ***REMOVED***,
    legend: ***REMOVED*** ...baseConfig.legend, ...config.legend ***REMOVED***,
  ***REMOVED***;

  if (!data || data.length === 0) ***REMOVED***
    // This empty state is simple; more complex empty states can be handled by the parent component
    return (
      <Flex variant="center" className="h-full text-gray-500">
        <p>No hay datos para el gráfico.</p>
      </Flex>
    );
  ***REMOVED***

  const renderChart = () => ***REMOVED***
    switch (chartType) ***REMOVED***
      case 'line':
        return (
          <LineChart data=***REMOVED***data***REMOVED*** margin=***REMOVED***margin***REMOVED***>
            <CartesianGrid ***REMOVED***...chartConfig.grid***REMOVED*** />
            <XAxis dataKey=***REMOVED***nameKey***REMOVED*** tick=***REMOVED***chartConfig.axis.tick***REMOVED*** />
            <YAxis tickFormatter=***REMOVED***valueFormatter***REMOVED*** tick=***REMOVED***chartConfig.axis.tick***REMOVED*** />
            ***REMOVED***showLegend && <Legend ***REMOVED***...chartConfig.legend***REMOVED*** />***REMOVED***
            <Tooltip
              formatter=***REMOVED***tooltipFormatter***REMOVED***
              content=***REMOVED***customTooltipContent || chartConfig.customTooltip***REMOVED***
              ***REMOVED***...chartConfig.tooltip***REMOVED***
            />
            ***REMOVED***dataKeys.map((item, index) => (
              <Line
                key=***REMOVED***item.key***REMOVED***
                type="monotone"
                dataKey=***REMOVED***item.key***REMOVED***
                stroke=***REMOVED***item.stroke || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]***REMOVED***
                ***REMOVED***...chartConfig.line***REMOVED***
              />
            ))***REMOVED***
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data=***REMOVED***data***REMOVED*** margin=***REMOVED***margin***REMOVED***>
            <CartesianGrid ***REMOVED***...chartConfig.grid***REMOVED*** />
            <XAxis dataKey=***REMOVED***nameKey***REMOVED*** tick=***REMOVED***chartConfig.axis.tick***REMOVED*** />
            <YAxis tickFormatter=***REMOVED***valueFormatter***REMOVED*** tick=***REMOVED***chartConfig.axis.tick***REMOVED*** />
            ***REMOVED***showLegend && <Legend ***REMOVED***...chartConfig.legend***REMOVED*** />***REMOVED***
            <Tooltip
              formatter=***REMOVED***tooltipFormatter***REMOVED***
              content=***REMOVED***customTooltipContent || chartConfig.customTooltip***REMOVED***
              ***REMOVED***...chartConfig.tooltip***REMOVED***
            />
            ***REMOVED***dataKeys.map((item, index) => (
              <Area
                key=***REMOVED***item.key***REMOVED***
                type="monotone"
                dataKey=***REMOVED***item.key***REMOVED***
                stroke=***REMOVED***item.stroke || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]***REMOVED***
                fill=***REMOVED***item.fill || thematicColors.transparent20 || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]***REMOVED***
                ***REMOVED***...chartConfig.area***REMOVED***
              />
            ))***REMOVED***
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data=***REMOVED***data***REMOVED***
              dataKey=***REMOVED***dataKeys***REMOVED*** // For pie, dataKeys is a string for the value
              nameKey=***REMOVED***nameKey***REMOVED***
              cx="50%"
              cy="50%"
              outerRadius=***REMOVED***pieOuterRadius***REMOVED***
              innerRadius=***REMOVED***pieInnerRadius***REMOVED***
              ***REMOVED***...chartConfig.pie***REMOVED***
            >
              ***REMOVED***data.map((entry, index) => (
                <Cell key=***REMOVED***`cell-$***REMOVED***index***REMOVED***`***REMOVED*** fill=***REMOVED***entry.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]***REMOVED*** />
              ))***REMOVED***
            </Pie>
            ***REMOVED***showLegend && <Legend ***REMOVED***...chartConfig.legend***REMOVED*** />***REMOVED***
            <Tooltip
              formatter=***REMOVED***tooltipFormatter***REMOVED***
              content=***REMOVED***customTooltipContent || chartConfig.customTooltip***REMOVED***
              ***REMOVED***...chartConfig.tooltip***REMOVED***
            />
          </PieChart>
        );
      // case 'bar': // Add bar chart logic if needed
      //   return (
      //     <BarChart ... > ... </BarChart>
      //   );
      default:
        return (
          <Flex variant="center" className="h-full text-gray-500">
            <p>Tipo de gráfico no soportado.</p>
          </Flex>
        );
    ***REMOVED***
  ***REMOVED***;

  return (
    <ResponsiveContainer width="100%" height="100%">
      ***REMOVED***renderChart()***REMOVED***
    </ResponsiveContainer>
  );
***REMOVED***;

export default BaseChart;