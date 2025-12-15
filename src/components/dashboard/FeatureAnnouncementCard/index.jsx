// src/components/dashboard/FeatureAnnouncementCard/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Sparkles, Clock, Timer ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** generateColorVariations ***REMOVED*** from '../../../utils/colorUtils'; // Importamos tu utilidad de colores
import Button from '../../ui/Button';

const FeatureAnnouncementCard = (***REMOVED*** onClick, className ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  // Generamos una paleta rica basada en tu color primario actual
  // Usamos useMemo para que no recalcule en cada render si el color no cambia
  const palette = useMemo(() => ***REMOVED***
    return generateColorVariations(colors.primary) || ***REMOVED***
      // Fallback por seguridad
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    ***REMOVED***;
  ***REMOVED***, [colors.primary, colors.primaryDark]);

  return (
    <div 
      className=***REMOVED***`relative overflow-hidden rounded-3xl transition-all hover:shadow-lg group cursor-pointer $***REMOVED***className***REMOVED***`***REMOVED***
      onClick=***REMOVED***onClick***REMOVED***
      style=***REMOVED******REMOVED***
        // AQUÍ ESTÁ LA MAGIA:
        // Creamos un gradiente diagonal desde el tono claro -> base -> oscuro
        // Esto le da ese efecto 3D "lujoso" sin importar qué color elija el usuario
        background: `linear-gradient(135deg, $***REMOVED***palette.lighter***REMOVED*** 0%, $***REMOVED***colors.primary***REMOVED*** 50%, $***REMOVED***palette.darker***REMOVED*** 100%)`
      ***REMOVED******REMOVED***
    >
      
      ***REMOVED***/* Elementos decorativos de fondo (patrones abstractos) */***REMOVED***
      ***REMOVED***/* Círculo superior: Blanco sutil (funciona con todo) */***REMOVED***
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />
      
      ***REMOVED***/* Círculo inferior: Usamos el tono oscuro de tu paleta para que mezcle bien */***REMOVED***
      <div 
        className="absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 opacity-30 rounded-full blur-2xl pointer-events-none"
        style=***REMOVED******REMOVED*** backgroundColor: palette.dark ***REMOVED******REMOVED*** 
      />

      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 h-full">
        
        ***REMOVED***/* Lado Izquierdo: Contenido de texto */***REMOVED***
        <div className="flex-1 space-y-4">
          ***REMOVED***/* Badge de Novedad */***REMOVED***
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles size=***REMOVED***12***REMOVED*** className="text-yellow-300" />
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

          ***REMOVED***/* Botón de Acción */***REMOVED***
          <div className="pt-2">
            <Button 
                onClick=***REMOVED***(e) => ***REMOVED***
                    e.stopPropagation();
                    onClick?.();
                ***REMOVED******REMOVED***
                className="bg-white border-none font-semibold shadow-md active:scale-95 transition-transform hover:bg-gray-50"
                // Forzamos el texto del botón a ser del color primario para mantener consistencia
                style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            >
              Probar ahora
            </Button>
          </div>
        </div>

        ***REMOVED***/* Lado Derecho: Ilustración / Iconografía */***REMOVED***
        <div className="hidden sm:flex flex-col items-center justify-center relative">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform rotate-6 transition-transform group-hover:rotate-12 shadow-xl">
                <Timer size=***REMOVED***48***REMOVED*** className="text-white drop-shadow-lg" />
            </div>
            
            ***REMOVED***/* Elemento flotante pequeño */***REMOVED***
            <div 
                className="absolute -bottom-2 -left-4 w-12 h-12 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center transform -rotate-12 shadow-lg animate-pulse"
                style=***REMOVED******REMOVED*** backgroundColor: palette.light ***REMOVED******REMOVED*** // Usamos tu color light
            >
                <Clock size=***REMOVED***24***REMOVED*** className="text-white" />
            </div>
        </div>

      </div>
    </div>
  );
***REMOVED***;

export default FeatureAnnouncementCard;