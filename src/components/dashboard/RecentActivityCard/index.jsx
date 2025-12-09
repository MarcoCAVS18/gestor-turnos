// src/components/dashboard/RecentActivityCard/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Activity, Briefcase, ChevronRight ***REMOVED*** from 'lucide-react'; // Cambiamos ArrowRight por ChevronRight
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile'; // Importamos el hook
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../utils/time';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import Button from '../../ui/Button'; // Importamos el componente Button

const RecentActivityCard = (***REMOVED*** stats, todosLosTrabajos, todosLosTurnos ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile(); // Hook para detectar móvil

  // Definir límite de forma reactiva (mucho más limpio que el useEffect anterior)
  const limite = isMobile ? 2 : 5;

  // Obtener turnos recientes
  const turnosRecientes = useMemo(() => ***REMOVED***
    if (!Array.isArray(todosLosTurnos)) return [];
    
    return todosLosTurnos
      .sort((a, b) => ***REMOVED***
        const fechaA = new Date((a.fechaInicio || a.fecha) + 'T' + a.horaInicio);
        const fechaB = new Date((b.fechaInicio || b.fecha) + 'T' + b.horaInicio);
        return fechaB - fechaA;
      ***REMOVED***)
      .slice(0, limite);
  ***REMOVED***, [todosLosTurnos, limite]);

  // Función para obtener trabajo
  const getTrabajo = (trabajoId) => ***REMOVED***
    return todosLosTrabajos?.find(t => t.id === trabajoId);
  ***REMOVED***;

  // Función para formatear fecha relativa
  const formatearFechaRelativa = (fechaStr) => ***REMOVED***
    try ***REMOVED***
      const fecha = createSafeDate(fechaStr);
      const hoy = new Date();
      const ayer = new Date(hoy);
      ayer.setDate(hoy.getDate() - 1);

      if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
      if (fecha.toDateString() === ayer.toDateString()) return 'Ayer';

      return fecha.toLocaleDateString('es-ES', ***REMOVED***
        day: 'numeric',
        month: 'short'
      ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      return fechaStr;
    ***REMOVED***
  ***REMOVED***;

  // Calcular ganancia del turno
  const calcularGananciaDisplay = (turno) => ***REMOVED***
    if (turno.tipo === 'delivery') ***REMOVED***
      return turno.gananciaTotal || 0;
    ***REMOVED***
    
    const trabajo = getTrabajo(turno.trabajoId);
    if (!trabajo) return 0;
    
    const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
    let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
    if (horas < 0) horas += 24;
    
    return horas * (trabajo.tarifaBase || 0);
  ***REMOVED***;

  // Estado vacío
  if (turnosRecientes.length === 0) ***REMOVED***
    return (
      <Card className="h-full">
        <Flex variant="between" className="mb-4">
          <h3 className="text-base font-semibold flex items-center text-gray-800">
            <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
            Recientes
          </h3>
        </Flex>
        
        <div className="text-center py-6">
          <Flex
            variant="center"
            className="p-3 rounded-full w-12 h-12 mx-auto mb-3"
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
          >
            <Briefcase size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
          </Flex>
          <p className="text-sm text-gray-600 mb-3">Sin turnos recientes</p>
          <Button
            onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
            size="sm"
            variant="primary"
            themeColor=***REMOVED***colors.primary***REMOVED***
          >
            Agregar turno
          </Button>
        </div>
      </Card>
    );
  ***REMOVED***

  return (
    <Card className="h-full flex flex-col">
      ***REMOVED***/* Header con botón animado "Ver todos" */***REMOVED***
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2 flex-shrink-0" />
          <span className="truncate">Recientes</span>
        </h3>
        
        <Button
          onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
          size="sm"
          variant="ghost"
          collapsed=***REMOVED***isMobile***REMOVED*** // Se colapsa en móvil igual que FavoriteWorks
          className="flex-shrink-0 flex items-center whitespace-nowrap"
          themeColor=***REMOVED***colors.primary***REMOVED***
          icon=***REMOVED***ChevronRight***REMOVED***
        >
          Ver todos
        </Button>
      </Flex>

      <div className="space-y-3 flex-grow">
        ***REMOVED***turnosRecientes.map((turno, index) => ***REMOVED***
          const trabajo = getTrabajo(turno.trabajoId);
          const ganancia = calcularGananciaDisplay(turno);
          const fechaRelativa = formatearFechaRelativa(turno.fechaInicio || turno.fecha);

          return (
            <Flex variant="between"
              key=***REMOVED***turno.id || index***REMOVED***
              className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
            >
              <div className="flex items-center flex-1 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                  style=***REMOVED******REMOVED*** backgroundColor: trabajo?.color || trabajo?.colorAvatar || colors.primary ***REMOVED******REMOVED***
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    ***REMOVED***trabajo?.nombre || 'Trabajo eliminado'***REMOVED***
                  </p>
                  <p className="text-xs text-gray-500">
                    ***REMOVED***fechaRelativa***REMOVED***
                  </p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-sm font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                  ***REMOVED***formatCurrency(ganancia)***REMOVED***
                </p>
              </div>
            </Flex>
          );
        ***REMOVED***)***REMOVED***
      </div>

      ***REMOVED***/* Total simple */***REMOVED***
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Flex variant="between">
          <span className="text-sm text-gray-600">Total reciente:</span>
          <span className="text-lg font-bold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
            ***REMOVED***formatCurrency(
              turnosRecientes.reduce((total, turno) => total + calcularGananciaDisplay(turno), 0)
            )***REMOVED***
          </span>
        </Flex>
      </div>
    </Card>
  );
***REMOVED***;

export default RecentActivityCard;