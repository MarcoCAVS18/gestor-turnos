// src/components/stats/ShiftTypeStats/index.jsx - REFACTORIZADO

import React from 'react';
import { Zap } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const ShiftTypeStats = ({ tiposDeTurno = {} }) => {
  const colors = useThemeColors();

  // Verificar que tiposDeTurno sea válido
  const tiposValidos = tiposDeTurno && typeof tiposDeTurno === 'object' && !Array.isArray(tiposDeTurno) ? tiposDeTurno : {};

  const colores = {
    'diurno': '#10B981',
    'tarde': '#F59E0B',
    'noche': '#6366F1',
    'sabado': '#8B5CF6',
    'domingo': '#EF4444',
    'mixto': '#6B7280'
  };

  if (Object.keys(tiposValidos).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <Zap size={18} style={{ color: colors.primary }} className="mr-2" />
          <h3 className="font-semibold">Tipos de turno</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Zap size={48} className="mx-auto mb-3 opacity-30" />
          <p>No hay datos de tipos de turno</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <Zap size={18} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="font-semibold">Tipos de turno</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(tiposValidos).map(([tipo, datos]) => {
          const datosSeguro = {
            turnos: (datos && typeof datos.turnos === 'number') ? datos.turnos : 0,
            horas: (datos && typeof datos.horas === 'number') ? datos.horas : 0,
            ganancia: (datos && typeof datos.ganancia === 'number') ? datos.ganancia : 0
          };

          const tipoMostrado = tipo === 'undefined' ? 'MIXTO' : tipo;

          return (
            <div key={tipo} className="text-center p-3 bg-gray-50 rounded-lg">
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ backgroundColor: colores[tipo] || '#6B7280' }}
              />
              <p className="text-xs text-gray-600 capitalize">{tipoMostrado}</p>
              <p className="font-semibold">{datosSeguro.turnos} turnos</p>
              <p className="text-xs text-gray-500">{datosSeguro.horas.toFixed(1)}h</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftTypeStats;
