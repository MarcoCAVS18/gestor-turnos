// src/components/dashboard/WeeklyStatsCard/index.jsx - REFACTORIZADO

import React from 'react';
import ***REMOVED*** DollarSign, Clock, Target, Activity ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const WeeklyStatsGrid = (***REMOVED*** datos = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  const datosSeguro = ***REMOVED***
    totalGanado: (datos && typeof datos.totalGanado === 'number' && !isNaN(datos.totalGanado)) ? datos.totalGanado : 0,
    horasTrabajadas: (datos && typeof datos.horasTrabajadas === 'number') ? datos.horasTrabajadas : 0,
    diasTrabajados: (datos && typeof datos.diasTrabajados === 'number') ? datos.diasTrabajados : 0,
    totalTurnos: (datos && typeof datos.totalTurnos === 'number') ? datos.totalTurnos : 0
  ***REMOVED***;

  const stats = [
    ***REMOVED***
      icon: DollarSign,
      label: 'Total ganado',
      value: formatCurrency(datosSeguro.totalGanado),
      color: colors.primary
    ***REMOVED***,
    ***REMOVED***
      icon: Clock,
      label: 'Horas trabajadas',
      value: `$***REMOVED***datosSeguro.horasTrabajadas.toFixed(1)***REMOVED***h`,
      color: colors.primary
    ***REMOVED***,
    ***REMOVED***
      icon: Target,
      label: 'Total turnos',
      value: datosSeguro.totalTurnos,
      color: colors.primary
    ***REMOVED***,
    ***REMOVED***
      icon: Activity,
      label: 'Días trabajados',
      value: `$***REMOVED***datosSeguro.diasTrabajados***REMOVED***/7`,
      color: colors.primary
    ***REMOVED***
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      ***REMOVED***stats.map((stat, index) => ***REMOVED***
        const Icon = stat.icon;
        return (
          <div key=***REMOVED***index***REMOVED*** className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: stat.color ***REMOVED******REMOVED*** className="mr-1" />
              <span className="text-sm text-gray-600">***REMOVED***stat.label***REMOVED***</span>
            </div>
            <p className="text-2xl font-bold" style=***REMOVED******REMOVED*** color: stat.color ***REMOVED******REMOVED***>
              ***REMOVED***stat.value***REMOVED***
            </p>
          </div>
        );
      ***REMOVED***)***REMOVED***
    </div>
  );
***REMOVED***;

export default WeeklyStatsGrid;