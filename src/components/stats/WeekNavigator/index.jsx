import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile'; // Importar hook

const WeekNavigator = ({
  offsetSemana = 0,
  onSemanaChange,
  fechaInicio,
  fechaFin,
  variant = 'default', // 'default' o 'transparent'
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile(); // Usar hook

  const cambiarSemana = typeof onSemanaChange === 'function' ? onSemanaChange : () => {};
  const fechaInicioValida = fechaInicio instanceof Date ? fechaInicio : new Date();
  const fechaFinValida = fechaFin instanceof Date ? fechaFin : new Date();

  const obtenerTituloSemana = () => {
    if (offsetSemana === 0) return 'Esta semana';
    if (offsetSemana === -1) return 'Semana pasada';
    // ... (resto de la lógica)
    if (offsetSemana === 1) return 'Próxima semana';
    if (offsetSemana > 1) return `En ${offsetSemana} semanas`;
    return `Hace ${Math.abs(offsetSemana)} semanas`;
  };

  const formatearFecha = (fecha) => {
    try {
      return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

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
      onClick={() => cambiarSemana(offsetSemana + (direction === 'left' ? -1 : 1))}
      className={`p-2 rounded-full transition-colors ${isMobile && !isTransparent ? 'p-3' : ''}`}
      style={{ backgroundColor: colors.transparent10, color: colors.primary }}
    >
      {direction === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );

  // Renderizado condicional basado en isMobile y variant
  if (isMobile && isTransparent) {
    // Layout para móvil y transparente (debajo del título)
    return (
      <div className="flex items-center justify-between w-full">
        {renderNavButton('left')}
        <div className="text-center">
          <h2 className="text-lg font-semibold">{obtenerTituloSemana()}</h2>
          <p className="text-sm text-gray-500">
            {formatearFecha(fechaInicioValida)} - {formatearFecha(fechaFinValida)}
          </p>
        </div>
        {renderNavButton('right')}
      </div>
    );
  }

  // Layout original para desktop o cuando no es transparente en móvil
  return (
    <div className={containerClasses}>
      <div className="flex flex-row items-center justify-between">
        {/* Botón Izquierda */}
        {renderNavButton('left')}

        {/* Contenido Central */}
        <div className="text-center">
          <h2 className={titleClasses}>{obtenerTituloSemana()}</h2>
          <p className={subtitleClasses}>
            {formatearFecha(fechaInicioValida)} - {formatearFecha(fechaFinValida)}
          </p>
        </div>

        {/* Botón Derecha */}
        {renderNavButton('right')}
      </div>
    </div>
  );
};

export default WeekNavigator;
