// src/components/stats/ShiftTypeStats/index.jsx

import React from 'react';
import { Zap } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { TURN_TYPE_COLORS } from '../../../constants/colors';

const ShiftTypeStats = ({ tiposDeTurno = {} }) => {
  const colors = useThemeColors();

  // Verificar que tiposDeTurno sea válido
  const tiposValidos = tiposDeTurno && typeof tiposDeTurno === 'object' && !Array.isArray(tiposDeTurno) ? tiposDeTurno : {};

  // Mapeo de tipos a las constantes de colores
  const getColorForType = (tipo) => {
    const colorMap = {
      'diurno': TURN_TYPE_COLORS.Diurno,
      'tarde': TURN_TYPE_COLORS.Tarde,
      'noche': TURN_TYPE_COLORS.Nocturno,
      'nocturno': TURN_TYPE_COLORS.Nocturno,
      'sabado': TURN_TYPE_COLORS.Sábado,
      'domingo': TURN_TYPE_COLORS.Domingo,
      'mixto': '#6B7280'
    };
    return colorMap[tipo.toLowerCase()] || '#6B7280';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <Zap size={18} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="font-semibold">Tipos de turno</h3>
      </div>

      {/* ESTADO VACÍO - Ahora siempre se muestra */}
      {Object.keys(tiposValidos).length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center text-gray-500">
            <Zap size={32} className="mx-auto mb-3 text-gray-300" />
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Sin tipos de turno
            </h4>
            <p className="text-xs text-gray-500">
              Los tipos aparecerán al registrar turnos
            </p>
          </div>
        </div>
      ) : (
        /* ESTADO CON DATOS */
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(tiposValidos).map(([tipo, datos]) => {
            const datosSeguro = {
              turnos: (datos && typeof datos.turnos === 'number') ? datos.turnos : 0,
              horas: (datos && typeof datos.horas === 'number') ? datos.horas : 0,
              ganancia: (datos && typeof datos.ganancia === 'number') ? datos.ganancia : 0
            };

            const tipoMostrado = tipo === 'undefined' ? 'MIXTO' : tipo.toUpperCase();
            const colorTipo = getColorForType(tipo);

            return (
              <div key={tipo} className="text-center p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: colorTipo }}
                />
                <p className="text-xs text-gray-600 capitalize">{tipoMostrado}</p>
                <p className="font-semibold">{datosSeguro.turnos} turnos</p>
                <p className="text-xs text-gray-500">{datosSeguro.horas.toFixed(1)}h</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShiftTypeStats;