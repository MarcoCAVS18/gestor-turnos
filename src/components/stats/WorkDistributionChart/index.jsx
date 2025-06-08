// src/components/stats/WorkDistributionChart/index.jsx

import React from 'react';
import ***REMOVED*** PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend ***REMOVED*** from 'recharts';
import Card from '../../ui/Card';

const WorkDistributionChart = (***REMOVED*** distribucionTrabajos = [] ***REMOVED***) => ***REMOVED***
  // Validar que distribucionTrabajos sea un array
  const datos = Array.isArray(distribucionTrabajos) ? distribucionTrabajos : [];
  
  if (datos.length === 0) ***REMOVED***
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Distribución de Trabajos</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No hay datos para mostrar</p>
            <p className="text-sm">Agrega algunos turnos para ver la distribución</p>
          </div>
        </div>
      </Card>
    );
  ***REMOVED***

  // Colores predefinidos para el gráfico
  const COLORES = [
    '#EC4899', '#3B82F6', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'
  ];

  // Asegurar que todos los datos tengan color
  const datosConColor = datos.map((item, index) => (***REMOVED***
    ...item,
    color: item.color || COLORES[index % COLORES.length]
  ***REMOVED***));

  const renderLabel = (entry) => ***REMOVED***
    return entry.porcentaje > 5 ? `$***REMOVED***entry.porcentaje***REMOVED***%` : '';
  ***REMOVED***;

  // Tooltip personalizado
  const CustomTooltip = (***REMOVED*** active, payload ***REMOVED***) => ***REMOVED***
    if (active && payload && payload.length) ***REMOVED***
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">***REMOVED***data.nombre***REMOVED***</p>
          <p className="text-sm text-gray-600">
            ***REMOVED***data.horas.toFixed(1)***REMOVED*** horas (***REMOVED***data.porcentaje***REMOVED***%)
          </p>
          <p className="text-sm font-medium text-green-600">
            $***REMOVED***data.ganancia.toFixed(2)***REMOVED***
          </p>
        </div>
      );
    ***REMOVED***
    return null;
  ***REMOVED***;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Distribución de Trabajos</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data=***REMOVED***datosConColor***REMOVED***
              cx="50%"
              cy="50%"
              labelLine=***REMOVED***false***REMOVED***
              label=***REMOVED***renderLabel***REMOVED***
              outerRadius=***REMOVED***80***REMOVED***
              fill="#8884d8"
              dataKey="horas"
            >
              ***REMOVED***datosConColor.map((entry, index) => (
                <Cell key=***REMOVED***`cell-$***REMOVED***index***REMOVED***`***REMOVED*** fill=***REMOVED***entry.color***REMOVED*** />
              ))***REMOVED***
            </Pie>
            <Tooltip content=***REMOVED***<CustomTooltip />***REMOVED*** />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      ***REMOVED***/* Resumen */***REMOVED***
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total trabajos:</span>
            <span className="font-medium ml-1">***REMOVED***datosConColor.length***REMOVED***</span>
          </div>
          <div>
            <span className="text-gray-600">Total horas:</span>
            <span className="font-medium ml-1">
              ***REMOVED***datosConColor.reduce((sum, item) => sum + item.horas, 0).toFixed(1)***REMOVED***h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WorkDistributionChart;