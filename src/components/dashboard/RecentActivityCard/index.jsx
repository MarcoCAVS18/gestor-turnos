// src/components/dashboard/RecentActivityCard/index.jsx - Versión Simplificada

import React from 'react';
import ***REMOVED*** Activity, Briefcase, ArrowRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../utils/time';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const RecentActivityCard = (***REMOVED*** stats, todosLosTrabajos, todosLosTurnos ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();

  // Determinar límite según dispositivo
  const [limite, setLimite] = React.useState(window.innerWidth >= 768 ? 5 : 2);

  React.useEffect(() => ***REMOVED***
    const handleResize = () => ***REMOVED***
      setLimite(window.innerWidth >= 768 ? 5 : 2);
    ***REMOVED***;

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  ***REMOVED***, []);

  // Obtener turnos recientes con límite responsivo
  const turnosRecientes = React.useMemo(() => ***REMOVED***
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

  // Función para formatear fecha relativa - SIMPLIFICADA
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

  // Calcular ganancia del turno - SIMPLIFICADO
  const calcularGananciaDisplay = (turno) => ***REMOVED***
    if (turno.tipo === 'delivery') ***REMOVED***
      return turno.gananciaTotal || 0;
    ***REMOVED***
    
    const trabajo = getTrabajo(turno.trabajoId);
    if (!trabajo) return 0;
    
    // Cálculo básico de horas * tarifa
    const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
    let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
    if (horas < 0) horas += 24;
    
    return horas * (trabajo.tarifaBase || 0);
  ***REMOVED***;

  if (turnosRecientes.length === 0) ***REMOVED***
    return (
      <Card className="h-full">
        <Flex variant="between" className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
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
          <button
            onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
            className="text-white px-3 py-1.5 rounded-lg text-xs transition-colors hover:opacity-90"
            style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
          >
            Agregar turno
          </button>
        </div>
      </Card>
    );
  ***REMOVED***

  return (
    <Card className="h-full">
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Recientes
        </h3>
        <button
          onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ArrowRight size=***REMOVED***12***REMOVED*** />
        </button>
      </Flex>

      <div className="space-y-3">
        ***REMOVED***turnosRecientes.map((turno, index) => ***REMOVED***
          const trabajo = getTrabajo(turno.trabajoId);
          const ganancia = calcularGananciaDisplay(turno);
          const fechaRelativa = formatearFechaRelativa(turno.fechaInicio || turno.fecha);

          return (
            <Flex variant="between"
              key=***REMOVED***turno.id || index***REMOVED***
              className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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