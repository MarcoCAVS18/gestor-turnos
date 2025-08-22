// src/components/dashboard/ThisWeekSummaryCard/index.jsx - Usando turnosSemana

import React from 'react';
import ***REMOVED*** Calendar, TrendingUp, Target, ArrowRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ThisWeekSummaryCard = (***REMOVED*** stats ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();
  const ***REMOVED*** weeklyHoursGoal ***REMOVED*** = useApp(); // Obtener meta del usuario

  // Obtener datos de esta semana desde stats
  const semanaActual = stats.semanaActual || ***REMOVED******REMOVED***;
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
  const irAjustes = () => ***REMOVED***
    navigate('/ajustes');
  ***REMOVED***;

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Esta semana
        </h3>
      </div>

      <div className="space-y-4">
        ***REMOVED***/* Ganancia principal */***REMOVED***
        <div className="text-center">
          <p
            className="text-2xl font-bold"
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            ***REMOVED***formatCurrency(totalSemana)***REMOVED***
          </p>
          <p className="text-sm text-gray-600">Total ganado</p>
        </div>

        ***REMOVED***/* Progreso de horas - Solo si hay meta */***REMOVED***
        ***REMOVED***tieneMetaHoras ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progreso</span>
              <span className="font-medium">***REMOVED***horasSemana.toFixed(1)***REMOVED***h / ***REMOVED***metaHoras***REMOVED***h</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style=***REMOVED******REMOVED***
                  width: `$***REMOVED***progresoLimitado***REMOVED***%`,
                  backgroundColor: progresoLimitado >= 75 ? '#10B981' : progresoLimitado >= 50 ? colors.primary : '#F59E0B'
                ***REMOVED******REMOVED***
              />
            </div>
          </div>
        ) : (
          // Sin meta - Call to action SIMPLIFICADO
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target size=***REMOVED***16***REMOVED*** className="text-gray-400 mr-1" />
              <span className="text-lg font-semibold text-gray-700">***REMOVED***horasSemana.toFixed(1)***REMOVED***h</span>
            </div>
            <div
              className="p-2 rounded-lg border border-dashed cursor-pointer hover:border-solid transition-all duration-200"
              style=***REMOVED******REMOVED***
                borderColor: colors.transparent30,
                backgroundColor: colors.transparent5
              ***REMOVED******REMOVED***
              onClick=***REMOVED***irAjustes***REMOVED***
            >
              <p className="text-xs text-gray-600 mb-1">
                ¿Sin meta semanal?
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Establecer una, te ayuda a mantener el rumbo
              </p>

              <div className="flex items-center justify-center text-xs font-medium" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                <span>Configurar</span>
                <ArrowRight size=***REMOVED***10***REMOVED*** className="ml-1" />
              </div>
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* Stats básicas - Mostrar turnos realizados */***REMOVED***
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <p className="font-semibold text-gray-800">***REMOVED***turnosSemana***REMOVED***</p>
            <p className="text-xs text-gray-500">turnos</p>
          </div>
          
          ***REMOVED***tieneMetaHoras && (
            <div className="text-center">
              <p className="font-semibold text-gray-800">***REMOVED***Math.ceil(progresoLimitado)***REMOVED***%</p>
              <p className="text-xs text-gray-500">meta</p>
            </div>
          )***REMOVED***
          
          <div className="text-center">
            <p className="font-semibold text-gray-800">***REMOVED***horasSemana.toFixed(1)***REMOVED***h</p>
            <p className="text-xs text-gray-500">horas</p>
          </div>
        </div>

        ***REMOVED***/* Mensaje motivacional */***REMOVED***
        ***REMOVED***totalSemana > 0 && tieneMetaHoras && (
          <div className="text-center p-2 rounded-lg" style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***>
            <div className="flex items-center justify-center">
              <TrendingUp size=***REMOVED***12***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-1" />
              <p className="text-xs font-medium" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***progresoLimitado >= 75 ? '¡Excelente progreso!' : '¡Buen ritmo!'***REMOVED***
              </p>
            </div>
          </div>
        )***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default ThisWeekSummaryCard;