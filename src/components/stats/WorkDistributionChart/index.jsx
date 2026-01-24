// src/components/stats/WorkDistributionChart/index.jsx

import React from 'react';
import ***REMOVED*** PieChart, Cell, ResponsiveContainer, Tooltip, Legend ***REMOVED*** from 'recharts';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const WorkDistributionChart = (***REMOVED*** worksDistribution = [] ***REMOVED***) => ***REMOVED***
  // Verify that worksDistribution is an array
  const data = Array.isArray(worksDistribution) ? worksDistribution : [];
  
  if (data.length === 0) ***REMOVED***
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Work Distribution</h3>
        <Flex variant="center" className="h-64 text-gray-500">
          <div className="text-center">
            <p className="text-sm">No data to display</p>
            <p className="text-sm">Add some shifts to see the distribution</p>
          </div>
        </Flex>
      </Card>
    );
  ***REMOVED***

  // Predefined colors for the chart
  const COLORS = [
    '#EC4899', '#3B82F6', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'
  ];

  // Ensure all data has color
  const dataWithColor = data.map((item, index) => (***REMOVED***
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  ***REMOVED***));

  const renderLabel = (entry) => ***REMOVED***
    return entry.percentage > 5 ? `$***REMOVED***entry.percentage***REMOVED***%` : '';
  ***REMOVED***;

  // Custom Tooltip
  const CustomTooltip = (***REMOVED*** active, payload ***REMOVED***) => ***REMOVED***
    if (active && payload && payload.length) ***REMOVED***
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">***REMOVED***data.name***REMOVED***</p>
          <p className="text-sm text-gray-600">
            ***REMOVED***data.hours.toFixed(1)***REMOVED*** hrs (***REMOVED***data.percentage***REMOVED***%)
          </p>
          <p className="text-sm font-medium text-green-600">
            ***REMOVED***data.earnings.toFixed(2)***REMOVED***
          </p>
        </div>
      );
    ***REMOVED***
    return null;
  ***REMOVED***;

  return (
    <Card>
      <h3 className="text del text-lg font-semibold mb-4">Work Distribution</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            data=***REMOVED***dataWithColor***REMOVED***
              cx="50%"
              cy="50%"
              labelLine=***REMOVED***false***REMOVED***
              label=***REMOVED***renderLabel***REMOVED***
              outerRadius=***REMOVED***80***REMOVED***
              fill="#8884d8"
              dataKey="hours"
            >
              ***REMOVED***dataWithColor.map((entry, index) => (
                <Cell key=***REMOVED***`cell-$***REMOVED***index***REMOVED***`***REMOVED*** fill=***REMOVED***entry.color***REMOVED*** />
              ))***REMOVED***
            </PieChart>
            <Tooltip content=***REMOVED***<CustomTooltip />***REMOVED*** />
            <Legend />
          </ResponsiveContainer>
      </div>

      ***REMOVED***/* Summary */***REMOVED***
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total works:</span>
            <span className="font-medium ml-1">***REMOVED***dataWithColor.length***REMOVED***</span>
          </div>
          <div>
            <span className="text-gray-600">Total hours:</span>
            <span className="font-medium ml-1">
              ***REMOVED***data.reduce((sum, item) => sum + item.hours, 0).toFixed(1)***REMOVED***h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WorkDistributionChart;