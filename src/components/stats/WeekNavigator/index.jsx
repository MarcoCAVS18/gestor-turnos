// src/components/stats/WeekNavigator/index.jsx 

import React from 'react';
import ***REMOVED*** ChevronLeft, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const WeekNavigator = (***REMOVED*** offsetSemana = 0, onSemanaChange, fechaInicio, fechaFin ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  const cambiarSemana = typeof onSemanaChange === 'function' ? onSemanaChange : () => ***REMOVED******REMOVED***;
  const fechaInicioValida = fechaInicio instanceof Date ? fechaInicio : new Date();
  const fechaFinValida = fechaFin instanceof Date ? fechaFin : new Date();

  const obtenerTituloSemana = () => ***REMOVED***
    if (offsetSemana === 0) return 'Esta semana';
    if (offsetSemana === -1) return 'Semana pasada';
    if (offsetSemana === 1) return 'Próxima semana';
    if (offsetSemana > 1) return `En $***REMOVED***offsetSemana***REMOVED*** semanas`;
    return `Hace $***REMOVED***Math.abs(offsetSemana)***REMOVED*** semanas`;
  ***REMOVED***;

  const formatearFecha = (fecha) => ***REMOVED***
    try ***REMOVED***
      return fecha.toLocaleDateString('es-ES', ***REMOVED***
        day: 'numeric',
        month: 'long'
      ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      return 'Fecha inválida';
    ***REMOVED***
  ***REMOVED***;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <Flex variant="between">
        <button
          onClick=***REMOVED***() => cambiarSemana(offsetSemana - 1)***REMOVED***
          className="p-2 rounded-full transition-colors"
          style=***REMOVED******REMOVED***
            backgroundColor: colors.transparent10,
            color: colors.primary
          ***REMOVED******REMOVED***
        >
          <ChevronLeft size=***REMOVED***20***REMOVED*** />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold">***REMOVED***obtenerTituloSemana()***REMOVED***</h2>
          <p className="text-sm text-gray-600">
            ***REMOVED***formatearFecha(fechaInicioValida)***REMOVED*** - ***REMOVED***formatearFecha(fechaFinValida)***REMOVED***
          </p>
        </div>

        <button
          onClick=***REMOVED***() => cambiarSemana(offsetSemana + 1)***REMOVED***
          className="p-2 rounded-full transition-colors"
          style=***REMOVED******REMOVED***
            backgroundColor: colors.transparent10,
            color: colors.primary
          ***REMOVED******REMOVED***
        >
          <ChevronRight size=***REMOVED***20***REMOVED*** />
        </button>
      </Flex>
    </div>
  );
***REMOVED***;

export default WeekNavigator;