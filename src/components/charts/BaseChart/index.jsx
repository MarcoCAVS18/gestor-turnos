import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Flex from '../../ui/Flex';
import { getRechartsConfig, PIE_CHART_COLORS } from '../../../config/chartConfig';
import { useThemeColors } from '../../../hooks/useThemeColors';

const BaseChart = ({
  data,
  chartType,
  dataKeys,
  nameKey,
  valueFormatter,
  tooltipFormatter,
  customTooltipContent,
  config = {},
  pieOuterRadius = '80%',
  pieInnerRadius = '60%',
  showLegend = true,
  margin = { top: 5, right: 20, left: -10, bottom: 5 }
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
      <Flex variant="center" className="h-full text-gray-500">
        <p>No data available for the chart.</p>
      </Flex>
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
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
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
          <Flex variant="center" className="h-full text-gray-500">
            <p>Unsupported chart type.</p>
          </Flex>
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