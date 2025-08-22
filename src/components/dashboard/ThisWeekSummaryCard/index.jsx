// src/components/dashboard/ThisWeekSummaryCard/index.jsx - Usando turnosSemana

import React from 'react';
import { Calendar, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ThisWeekSummaryCard = ({ stats }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { weeklyHoursGoal } = useApp(); // Obtener meta del usuario

  // Obtener datos de esta semana desde stats
  const semanaActual = stats.semanaActual || {};
  const totalSemana = semanaActual.totalGanado || 0;
  const horasSemana = semanaActual.horasTrabajadas || 0;
  const turnosSemana = semanaActual.totalTurnos || 0; // USAR la variable

  // Usar la meta del usuario o mostrar call-to-action si no hay meta
  const metaHoras = weeklyHoursGoal;
  const tieneMetaHoras = metaHoras && metaHoras > 0;

  // Calcular progreso solo si hay meta
  const progresoHoras = tieneMetaHoras ? (horasSemana / metaHoras) * 100 : 0;
  const progresoLimitado = Math.min(Math.max(progresoHoras, 0), 100);

  // Función para navegar a ajustes
  const irAjustes = () => {
    navigate('/ajustes');
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar size={20} style={{ color: colors.primary }} className="mr-2" />
          Esta semana
        </h3>
      </div>

      <div className="space-y-4">
        {/* Ganancia principal */}
        <div className="text-center">
          <p
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
          >
            {formatCurrency(totalSemana)}
          </p>
          <p className="text-sm text-gray-600">Total ganado</p>
        </div>

        {/* Progreso de horas - Solo si hay meta */}
        {tieneMetaHoras ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progreso</span>
              <span className="font-medium">{horasSemana.toFixed(1)}h / {metaHoras}h</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progresoLimitado}%`,
                  backgroundColor: progresoLimitado >= 75 ? '#10B981' : progresoLimitado >= 50 ? colors.primary : '#F59E0B'
                }}
              />
            </div>
          </div>
        ) : (
          // Sin meta - Call to action SIMPLIFICADO
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target size={16} className="text-gray-400 mr-1" />
              <span className="text-lg font-semibold text-gray-700">{horasSemana.toFixed(1)}h</span>
            </div>
            <div
              className="p-2 rounded-lg border border-dashed cursor-pointer hover:border-solid transition-all duration-200"
              style={{
                borderColor: colors.transparent30,
                backgroundColor: colors.transparent5
              }}
              onClick={irAjustes}
            >
              <p className="text-xs text-gray-600 mb-1">
                ¿Sin meta semanal?
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Establecer una, te ayuda a mantener el rumbo
              </p>

              <div className="flex items-center justify-center text-xs font-medium" style={{ color: colors.primary }}>
                <span>Configurar</span>
                <ArrowRight size={10} className="ml-1" />
              </div>
            </div>
          </div>
        )}

        {/* Stats básicas - Mostrar turnos realizados */}
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <p className="font-semibold text-gray-800">{turnosSemana}</p>
            <p className="text-xs text-gray-500">turnos</p>
          </div>
          
          {tieneMetaHoras && (
            <div className="text-center">
              <p className="font-semibold text-gray-800">{Math.ceil(progresoLimitado)}%</p>
              <p className="text-xs text-gray-500">meta</p>
            </div>
          )}
          
          <div className="text-center">
            <p className="font-semibold text-gray-800">{horasSemana.toFixed(1)}h</p>
            <p className="text-xs text-gray-500">horas</p>
          </div>
        </div>

        {/* Mensaje motivacional */}
        {totalSemana > 0 && tieneMetaHoras && (
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.transparent10 }}>
            <div className="flex items-center justify-center">
              <TrendingUp size={12} style={{ color: colors.primary }} className="mr-1" />
              <p className="text-xs font-medium" style={{ color: colors.primary }}>
                {progresoLimitado >= 75 ? '¡Excelente progreso!' : '¡Buen ritmo!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ThisWeekSummaryCard;