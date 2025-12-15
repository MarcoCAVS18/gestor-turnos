// src/components/dashboard/RecentActivityCard/index.jsx

import React, { useMemo } from 'react';
import { Activity, Briefcase, ChevronRight } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile'; 
import { formatCurrency } from '../../../utils/currency';
import { createSafeDate } from '../../../utils/time';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import Button from '../../ui/Button'; 

const RecentActivityCard = ({ stats, todosLosTrabajos, todosLosTurnos }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const isMobile = useIsMobile(); 

  // Definir límite de forma reactiva (mucho más limpio que el useEffect anterior)
  const limite = isMobile ? 2 : 6;

  // Obtener turnos recientes
  const turnosRecientes = useMemo(() => {
    if (!Array.isArray(todosLosTurnos)) return [];
    
    return todosLosTurnos
      .sort((a, b) => {
        const fechaA = new Date((a.fechaInicio || a.fecha) + 'T' + a.horaInicio);
        const fechaB = new Date((b.fechaInicio || b.fecha) + 'T' + b.horaInicio);
        return fechaB - fechaA;
      })
      .slice(0, limite);
  }, [todosLosTurnos, limite]);

  // Función para obtener trabajo
  const getTrabajo = (trabajoId) => {
    return todosLosTrabajos?.find(t => t.id === trabajoId);
  };

  // Función para formatear fecha relativa
  const formatearFechaRelativa = (fechaStr) => {
    try {
      const fecha = createSafeDate(fechaStr);
      const hoy = new Date();
      const ayer = new Date(hoy);
      ayer.setDate(hoy.getDate() - 1);

      if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
      if (fecha.toDateString() === ayer.toDateString()) return 'Ayer';

      return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return fechaStr;
    }
  };

  // Calcular ganancia del turno
  const calcularGananciaDisplay = (turno) => {
    if (turno.tipo === 'delivery') {
      return turno.gananciaTotal || 0;
    }
    
    const trabajo = getTrabajo(turno.trabajoId);
    if (!trabajo) return 0;
    
    const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
    let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
    if (horas < 0) horas += 24;
    
    return horas * (trabajo.tarifaBase || 0);
  };

  // Estado vacío
  if (turnosRecientes.length === 0) {
    return (
      <Card className="h-full">
        <Flex variant="between" className="mb-4">
          <h3 className="text-base font-semibold flex items-center text-gray-800">
            <Activity size={20} style={{ color: colors.primary }} className="mr-2" />
            Recientes
          </h3>
        </Flex>
        
        <div className="text-center py-6">
          <Flex
            variant="center"
            className="p-3 rounded-full w-12 h-12 mx-auto mb-3"
            style={{ backgroundColor: colors.transparent10 }}
          >
            <Briefcase size={20} style={{ color: colors.primary }} />
          </Flex>
          <p className="text-sm text-gray-600 mb-3">Sin turnos recientes</p>
          <Button
            onClick={() => navigate('/turnos')}
            size="sm"
            variant="primary"
            themeColor={colors.primary}
          >
            Agregar turno
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <Flex variant="between" className="mb-4 flex-nowrap gap-3">
        <h3 className="text-base font-semibold flex items-center text-gray-800 truncate">
          <Activity size={20} style={{ color: colors.primary }} className="mr-2 flex-shrink-0" />
          <span className="truncate">Recientes</span>
        </h3>
        
        <Button
          onClick={() => navigate('/estadisticas')}
          size="sm"
          variant="ghost" 
          animatedChevron 
          collapsed={isMobile}
          className="flex-shrink-0 whitespace-nowrap text-gray-400 hover:text-gray-600"
          themeColor={colors.primary}
          icon={ChevronRight}
          iconPosition="right"
        >
          Ver todos
        </Button>
      </Flex>

      <div className="space-y-3 flex-grow">
        {turnosRecientes.map((turno, index) => {
          const trabajo = getTrabajo(turno.trabajoId);
          const ganancia = calcularGananciaDisplay(turno);
          const fechaRelativa = formatearFechaRelativa(turno.fechaInicio || turno.fecha);

          return (
            <Flex variant="between"
              key={turno.id || index}
              className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              onClick={() => navigate('/turnos')}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: trabajo?.color || trabajo?.colorAvatar || colors.primary }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {trabajo?.nombre || 'Trabajo eliminado'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {fechaRelativa}
                  </p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                  {formatCurrency(ganancia)}
                </p>
              </div>
            </Flex>
          );
        })}
      </div>

      {/* Total simple */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Flex variant="between">
          <span className="text-sm text-gray-600">Total reciente:</span>
          <span className="text-lg font-bold" style={{ color: colors.primary }}>
            {formatCurrency(
              turnosRecientes.reduce((total, turno) => total + calcularGananciaDisplay(turno), 0)
            )}
          </span>
        </Flex>
      </div>
    </Card>
  );
};

export default RecentActivityCard;