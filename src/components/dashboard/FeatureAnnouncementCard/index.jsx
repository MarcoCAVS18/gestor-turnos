// src/components/dashboard/FeatureAnnouncementCard/index.jsx

import React, { useMemo } from 'react';
import { Sparkles, Clock, Timer } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { generateColorVariations } from '../../../utils/colorUtils'; // Importamos tu utilidad de colores
import Button from '../../ui/Button';

const FeatureAnnouncementCard = ({ onClick, className }) => {
  const colors = useThemeColors();
  
  // Generamos una paleta rica basada en tu color primario actual
  // Usamos useMemo para que no recalcule en cada render si el color no cambia
  const palette = useMemo(() => {
    return generateColorVariations(colors.primary) || {
      // Fallback por seguridad
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
  }, [colors.primary, colors.primaryDark]);

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl transition-all hover:shadow-lg group cursor-pointer ${className}`}
      onClick={onClick}
      style={{
        // AQUÍ ESTÁ LA MAGIA:
        // Creamos un gradiente diagonal desde el tono claro -> base -> oscuro
        // Esto le da ese efecto 3D "lujoso" sin importar qué color elija el usuario
        background: `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`
      }}
    >
      
      {/* Elementos decorativos de fondo (patrones abstractos) */}
      {/* Círculo superior: Blanco sutil (funciona con todo) */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Círculo inferior: Usamos el tono oscuro de tu paleta para que mezcle bien */}
      <div 
        className="absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 opacity-30 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: palette.dark }} 
      />

      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 h-full">
        
        {/* Lado Izquierdo: Contenido de texto */}
        <div className="flex-1 space-y-4">
          {/* Badge de Novedad */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles size={12} className="text-yellow-300" />
            <span>Nueva Funcionalidad</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              Modo Live
            </h2>
            <p className="text-white text-sm sm:text-base leading-relaxed max-w-md opacity-90">
              Control total de tus turnos en tiempo real. Ficha, pausa y monitorea tus ganancias al instante.
            </p>
          </div>

          {/* Botón de Acción */}
          <div className="pt-2">
            <Button 
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                variant='solid'
                className="bg-white border-none font-semibold shadow-md active:scale-95 transition-transform hover:bg-gray-50"
                themeColor={colors.primary}
            >
              Probar ahora
            </Button>

          

          </div>
        </div>

        {/* Lado Derecho: Ilustración / Iconografía */}
        <div className="hidden sm:flex flex-col items-center justify-center relative">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform rotate-6 transition-transform group-hover:rotate-12 shadow-xl">
                <Timer size={48} className="text-white drop-shadow-lg" />
            </div>
            
            {/* Elemento flotante pequeño */}
            <div 
                className="absolute -bottom-2 -left-4 w-12 h-12 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center transform -rotate-12 shadow-lg animate-pulse"
                style={{ backgroundColor: palette.light }} // Usamos tu color light
            >
                <Clock size={24} className="text-white" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default FeatureAnnouncementCard;