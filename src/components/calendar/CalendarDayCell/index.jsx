// src/components/calendar/CalendarDayCell/index.jsx

import React from 'react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const CalendarDayCell = (***REMOVED***
  dia,
  esHoy,
  esSeleccionado,
  coloresTrabajos,
  onClick
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  return (
    <button
      onClick=***REMOVED***onClick***REMOVED***
      className=***REMOVED***`
        p-2 text-center relative 
        hover:bg-gray-50 
        flex flex-col justify-center items-center
        $***REMOVED***!dia.mesActual ? 'text-gray-400' : 'text-gray-800'***REMOVED***
      `***REMOVED***
      style=***REMOVED******REMOVED***
        backgroundColor: esSeleccionado
          ? colors.transparent10
          : 'transparent'
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Círculo para día actual */***REMOVED***
      ***REMOVED***esHoy && (
        <div
          className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
          style=***REMOVED******REMOVED***
            border: `2px solid $***REMOVED***colors.primary***REMOVED***`
          ***REMOVED******REMOVED***
        />
      )***REMOVED***

      ***REMOVED***/* Contenedor para número del día */***REMOVED***
      <Flex variant="center"
        className="rounded-full w-8 h-8 transition-all duration-200"
        style=***REMOVED******REMOVED***
          backgroundColor: esHoy
            ? colors.primary
            : (esSeleccionado && !esHoy)
              ? colors.transparent20
              : 'transparent',
          color: esHoy
            ? colors.textContrast
            : 'inherit',
          fontWeight: esHoy ? 'bold' : 'normal',
          transform: esHoy ? 'scale(1.1)' : 'scale(1)',
          boxShadow: esHoy
            ? `0 4px 12px $***REMOVED***colors.transparent50***REMOVED***`
            : 'none'
        ***REMOVED******REMOVED***
      >
        <span>***REMOVED***dia.dia***REMOVED***</span>
      </Flex>

      ***REMOVED***/* Indicadores de turnos simplificados */***REMOVED***
      ***REMOVED***dia.tieneTurnos && (
        <div className="absolute bottom-1 flex justify-center gap-0.5 w-full px-1">
          ***REMOVED***/* Mostrar indicadores usando los colores de trabajos pasados como prop */***REMOVED***
          ***REMOVED***coloresTrabajos && coloresTrabajos.length > 0 ? (
            <div className="flex gap-0.5">
              ***REMOVED***coloresTrabajos.length === 1 ? (
                <div
                  className="w-4 h-1 rounded"
                  style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[0] ***REMOVED******REMOVED***
                />
              ) : coloresTrabajos.length === 2 ? (
                <>
                  <div
                    className="w-2 h-1 rounded"
                    style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[0] ***REMOVED******REMOVED***
                  />
                  <div
                    className="w-2 h-1 rounded"
                    style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[1] ***REMOVED******REMOVED***
                  />
                </>
              ) : (
                // 3 o más trabajos
                coloresTrabajos.slice(0, 3).map((color, index) => (
                  <div
                    key=***REMOVED***index***REMOVED***
                    className="w-1 h-1 rounded-full"
                    style=***REMOVED******REMOVED*** backgroundColor: color ***REMOVED******REMOVED***
                  />
                ))
              )***REMOVED***
            </div>
          ) : (
            // Fallback: mostrar indicador genérico si no hay colores específicos
            <div
              className="w-2 h-1 rounded"
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            />
          )***REMOVED***
        </div>
      )***REMOVED***
    </button>
  );
***REMOVED***;

export default CalendarDayCell;
