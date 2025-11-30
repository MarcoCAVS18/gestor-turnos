import React from 'react';
import ***REMOVED*** ChevronLeft, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile'; // Importar hook

const WeekNavigator = (***REMOVED***
  offsetSemana = 0,
  onSemanaChange,
  fechaInicio,
  fechaFin,
  variant = 'default', // 'default' o 'transparent'
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const isMobile = useIsMobile(); // Usar hook

  const cambiarSemana = typeof onSemanaChange === 'function' ? onSemanaChange : () => ***REMOVED******REMOVED***;
  const fechaInicioValida = fechaInicio instanceof Date ? fechaInicio : new Date();
  const fechaFinValida = fechaFin instanceof Date ? fechaFin : new Date();

  const obtenerTituloSemana = () => ***REMOVED***
    if (offsetSemana === 0) return 'Esta semana';
    if (offsetSemana === -1) return 'Semana pasada';
    // ... (resto de la lógica)
    if (offsetSemana === 1) return 'Próxima semana';
    if (offsetSemana > 1) return `En $***REMOVED***offsetSemana***REMOVED*** semanas`;
    return `Hace $***REMOVED***Math.abs(offsetSemana)***REMOVED*** semanas`;
  ***REMOVED***;

  const formatearFecha = (fecha) => ***REMOVED***
    try ***REMOVED***
      return fecha.toLocaleDateString('es-ES', ***REMOVED*** day: 'numeric', month: 'long' ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      return 'Fecha inválida';
    ***REMOVED***
  ***REMOVED***;

  const isTransparent = variant === 'transparent';

  const containerClasses = isTransparent
    ? 'p-4'
    : 'bg-white rounded-xl shadow-md p-4';

  const titleClasses = isTransparent
    ? 'text-lg text-gray-700'
    : 'text-xl font-semibold';

  const subtitleClasses = isTransparent ? 'text-gray-500' : 'text-sm text-gray-600';

  // Unificar botones para evitar duplicación
  const renderNavButton = (direction) => (
    <button
      onClick=***REMOVED***() => cambiarSemana(offsetSemana + (direction === 'left' ? -1 : 1))***REMOVED***
      className=***REMOVED***`p-2 rounded-full transition-colors $***REMOVED***isMobile && !isTransparent ? 'p-3' : ''***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10, color: colors.primary ***REMOVED******REMOVED***
    >
      ***REMOVED***direction === 'left' ? <ChevronLeft size=***REMOVED***20***REMOVED*** /> : <ChevronRight size=***REMOVED***20***REMOVED*** />***REMOVED***
    </button>
  );

  // Renderizado condicional basado en isMobile y variant
  if (isMobile && isTransparent) ***REMOVED***
    // Layout para móvil y transparente (debajo del título)
    return (
      <div className="flex items-center justify-between w-full">
        ***REMOVED***renderNavButton('left')***REMOVED***
        <div className="text-center">
          <h2 className="text-lg font-semibold">***REMOVED***obtenerTituloSemana()***REMOVED***</h2>
          <p className="text-sm text-gray-500">
            ***REMOVED***formatearFecha(fechaInicioValida)***REMOVED*** - ***REMOVED***formatearFecha(fechaFinValida)***REMOVED***
          </p>
        </div>
        ***REMOVED***renderNavButton('right')***REMOVED***
      </div>
    );
  ***REMOVED***

  // Layout original para desktop o cuando no es transparente en móvil
  return (
    <div className=***REMOVED***containerClasses***REMOVED***>
      <div className="flex flex-row items-center justify-between">
        ***REMOVED***/* Botón Izquierda */***REMOVED***
        ***REMOVED***renderNavButton('left')***REMOVED***

        ***REMOVED***/* Contenido Central */***REMOVED***
        <div className="text-center">
          <h2 className=***REMOVED***titleClasses***REMOVED***>***REMOVED***obtenerTituloSemana()***REMOVED***</h2>
          <p className=***REMOVED***subtitleClasses***REMOVED***>
            ***REMOVED***formatearFecha(fechaInicioValida)***REMOVED*** - ***REMOVED***formatearFecha(fechaFinValida)***REMOVED***
          </p>
        </div>

        ***REMOVED***/* Botón Derecha */***REMOVED***
        ***REMOVED***renderNavButton('right')***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default WeekNavigator;
