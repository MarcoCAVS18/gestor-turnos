// src/components/stats/WorkDistributionChart/index.jsx

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const WorkDistributionChart = ({ distribucionTrabajos = [] }) => {
  // Validar que distribucionTrabajos sea un array
  const datos = Array.isArray(distribucionTrabajos) ? distribucionTrabajos : [];
  
  if (datos.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Distribución de Trabajos</h3>
        <Flex variant="center" className="h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No hay datos para mostrar</p>
            <p className="text-sm">Agrega algunos turnos para ver la distribución</p>
          </div>
        </Flex>
      </Card>
    );
  }

  // Colores predefinidos para el gráfico
  const COLORES = [
    '#EC4899', '#3B82F6', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'
  ];

  // Asegurar que todos los datos tengan color
  const datosConColor = datos.map((item, index) => ({
    ...item,
    color: item.color || COLORES[index % COLORES.length]
  }));

  const renderLabel = (entry) => {
    return entry.porcentaje > 5 ? `${entry.porcentaje}%` : '';
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.nombre}</p>
          <p className="text-sm text-gray-600">
            {data.horas.toFixed(1)} horas ({data.porcentaje}%)
          </p>
          <p className="text-sm font-medium text-green-600">
            ${data.ganancia.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Distribución de Trabajos</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datosConColor}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="horas"
            >
              {datosConColor.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Resumen */}
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total trabajos:</span>
            <span className="font-medium ml-1">{datosConColor.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Total horas:</span>
            <span className="font-medium ml-1">
              {datosConColor.reduce((sum, item) => sum + item.horas, 0).toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkDistributionChart;