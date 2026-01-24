// src/components/dashboard/ThisWeekSummaryCard/index.jsx - Usando turnosSemana

import React from 'react';
import ***REMOVED*** Calendar, TrendingUp, Target, ArrowRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Flex from '../../ui/Flex';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import ProgressBar from '../../ui/ProgressBar';
import Button from '../../ui/Button';

const ThisWeekSummaryCard = (***REMOVED*** stats, className ***REMOVED***) => ***REMOVED***
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

  const getProgressBarColor = (progress) => ***REMOVED***
    if (progress >= 75) return '#10B981';
    if (progress >= 50) return colors.primary;
    return '#F59E0B';
  ***REMOVED***;

  return (
    <Card className=***REMOVED***className***REMOVED***>
      <div className="flex flex-col h-full">
        <div> ***REMOVED***/* Content wrapper */***REMOVED***
          <Flex variant="between" className="mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
              Esta semana
            </h3>
          </Flex>

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
                <Flex variant="between" className="text-sm">
                  <span className="text-gray-600">Progreso: </span>
                  <span className="font-medium">***REMOVED***horasSemana.toFixed(1)***REMOVED***h / ***REMOVED***metaHoras***REMOVED***h</span>
                </Flex>

                <ProgressBar
                  value=***REMOVED***progresoLimitado***REMOVED***
                  color=***REMOVED***getProgressBarColor(progresoLimitado)***REMOVED***
                />
              </div>
            ) : (
              // Sin meta - Call to action SIMPLIFICADO
              <div className="text-center">
                <Flex variant="center" className="mb-2">
                  <Target size=***REMOVED***16***REMOVED*** className="text-gray-400 mr-1" />
                  <span className="text-lg font-semibold text-gray-700">***REMOVED***horasSemana.toFixed(1)***REMOVED***h</span>
                </Flex>
                <div
                  className="p-2 rounded-lg border border-dashed transition-all duration-200"
                  style=***REMOVED******REMOVED***
                    borderColor: colors.transparent30,
                    backgroundColor: colors.transparent5
                  ***REMOVED******REMOVED***
                >
                  <p className="text-xs text-gray-600 mb-1">
                    ¿Sin meta semanal?
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    Establecer una, te ayuda a mantener el rumbo
                  </p>
                  <Button
                    onClick=***REMOVED***irAjustes***REMOVED***
                    variant="ghost-animated"
                    size="sm"
                    icon=***REMOVED***ArrowRight***REMOVED***
                    iconPosition="right"
                    themeColor=***REMOVED***colors.primary***REMOVED***
                    className="-ml-2"
                  >
                    Configurar
                  </Button>
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Stats básicas - Mostrar turnos realizados */***REMOVED***
            <Flex variant="between" className=" text-sm">
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
            </Flex>

            ***REMOVED***/* Mensaje motivacional */***REMOVED***
            ***REMOVED***totalSemana > 0 && tieneMetaHoras && (
              <div className="text-center p-2 rounded-lg" style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***>
                <Flex variant="center">
                  <TrendingUp size=***REMOVED***12***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-1" />
                  <p className="text-xs font-medium" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                    ***REMOVED***progresoLimitado >= 75 ? '¡Excelente progreso!' : '¡Buen ritmo!'***REMOVED***
                  </p>
                </Flex>
              </div>
            )***REMOVED***
          </div>
        </div>
        <div className="flex-grow" /> ***REMOVED***/* Spacer */***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default ThisWeekSummaryCard;