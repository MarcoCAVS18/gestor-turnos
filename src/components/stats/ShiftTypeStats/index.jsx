// src/components/stats/ShiftTypeStats/index.jsx
import React from 'react';
import { Zap } from 'lucide-react';
import { TURN_TYPE_COLORS } from '../../../constants/colors';
import { formatTurnosCount, pluralizeTiposDeTurno, calculateTotalTurnos } from '../../../utils/pluralization';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const ShiftTypeStats = ({ datosActuales, loading, className = '' }) => {
  const { tiposDeTurno } = datosActuales;

  const tiposValidos = tiposDeTurno && typeof tiposDeTurno === 'object' && !Array.isArray(tiposDeTurno) ? tiposDeTurno : {};
  const totalTurnos = calculateTotalTurnos(tiposValidos);
  const tituloPlural = pluralizeTiposDeTurno(totalTurnos);
  const isEmpty = Object.keys(tiposValidos).length === 0;

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
    <BaseStatsCard
      icon={Zap}
      title={tituloPlural}
      loading={loading}
      empty={isEmpty}
      emptyText="Agrega turnos para ver esta estadística."
      className={className}
    >
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 min-h-full items-start">
          {Object.entries(tiposValidos).map(([tipo, datos]) => {
            const datosSeguro = {
              turnos: (datos && typeof datos.turnos === 'number') ? datos.turnos : 0,
              horas: (datos && typeof datos.horas === 'number') ? datos.horas : 0,
              ganancia: (datos && typeof datos.ganancia === 'number') ? datos.ganancia : 0
            };

            const tipoMostrado = tipo === 'undefined' ? 'MIXTO' : tipo.toUpperCase();
            const colorTipo = getColorForType(tipo);

            return (
              <div key={tipo} className="text-center p-2 bg-gray-50 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: colorTipo }}
                />
                <p className="text-xs text-gray-600 capitalize">{tipoMostrado}</p>
                <p className="font-semibold text-sm">{formatTurnosCount(datosSeguro.turnos)}</p>
                <p className="text-xs text-gray-500">{datosSeguro.horas.toFixed(1)}h</p>
              </div>
            );
          })}
        </div>
      </div>
    </BaseStatsCard>
  );
};

export default ShiftTypeStats;