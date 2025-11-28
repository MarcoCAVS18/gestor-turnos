// src/components/shifts/WeeklyShiftsSection/index.jsx

import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import TarjetaTurno from '../../cards/shift/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/shift/TarjetaTurnoDelivery';
import { formatTurnosCount } from '../../../utils/pluralization';

const WeeklyShiftsSection = ({ 
  rangoSemana, 
  turnos, 
  totalTurnos, 
  allJobs, 
  onEditShift, 
  onDeleteShift, 
  thematicColors 
}) => {
  
  // Convertir objeto de turnos a array ordenado por fecha
  const turnosOrdenados = Object.entries(turnos)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
    .flatMap(([fecha, turnosDia]) => 
      turnosDia.map(turno => ({ ...turno, fecha }))
    );

  // Calcular estadísticas de la semana
  const estadisticasSemana = React.useMemo(() => {
    let totalGanancias = 0;
    let totalHoras = 0;

    turnosOrdenados.forEach(turno => {
      // Para turnos de delivery
      if (turno.tipo === 'delivery') {
        totalGanancias += turno.gananciaTotal || 0;
        
        // Calcular horas para delivery
        if (turno.horaInicio && turno.horaFin) {
          const [horaI, minI] = turno.horaInicio.split(':').map(Number);
          const [horaF, minF] = turno.horaFin.split(':').map(Number);
          let horas = (horaF + minF/60) - (horaI + minI/60);
          if (horas < 0) horas += 24;
          totalHoras += horas;
        }
      } else {
        // Para turnos tradicionales, necesitaríamos calcular con las tarifas
        // Por simplicidad, estimamos basándonos en horas
        if (turno.horaInicio && turno.horaFin) {
          const [horaI, minI] = turno.horaInicio.split(':').map(Number);
          const [horaF, minF] = turno.horaFin.split(':').map(Number);
          let horas = (horaF + minF/60) - (horaI + minI/60);
          if (horas < 0) horas += 24;
          totalHoras += horas;
          
          // Estimación de ganancia (esto se puede mejorar)
          const trabajo = allJobs.find(j => j.id === turno.trabajoId);
          if (trabajo) {
            totalGanancias += horas * (trabajo.tarifaBase || 0);
          }
        }
      }
    });

    return {
      totalGanancias,
      totalHoras,
      promedioPorHora: totalHoras > 0 ? totalGanancias / totalHoras : 0
    };
  }, [turnosOrdenados, allJobs]);

  // Función para renderizar el turno correcto según el tipo
  const renderTurno = (turno, index) => {
    const trabajo = allJobs.find(j => j.id === turno.trabajoId);
    
    // Props comunes para ambos tipos de tarjeta
    const commonProps = {
      turno: turno,
      trabajo: trabajo,
      fecha: turno.fecha,
      onEdit: () => onEditShift(turno),
      onDelete: () => onDeleteShift(turno),
      variant: 'default',
      compact: true
    };

    // Determinar si es delivery y renderizar el componente apropiado
    if (turno.tipo === 'delivery') {
      return <TarjetaTurnoDelivery key={`${turno.id}-${index}`} {...commonProps} />;
    }
    
    return <TarjetaTurno key={`${turno.id}-${index}`} {...commonProps} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header de la semana */}
      <div 
        className="px-6 py-4 border-b"
        style={{ 
          backgroundColor: thematicColors?.transparent5,
          borderBottomColor: thematicColors?.transparent20
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar 
              size={20} 
              style={{ color: thematicColors?.base }}
            />
            <div>
              <h3 
                className="font-semibold text-lg"
                style={{ color: thematicColors?.base }}
              >
                Semana {rangoSemana}
              </h3>
              {/* ✅ AQUÍ ESTÁ EL CAMBIO PRINCIPAL */}
              <p className="text-sm text-gray-600">
                {formatTurnosCount(totalTurnos)}
              </p>
            </div>
          </div>

          {/* Estadísticas de la semana */}
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp size={16} />
              <span>${estadisticasSemana.totalGanancias.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">
              {estadisticasSemana.totalHoras.toFixed(1)}h trabajadas
            </p>
          </div>
        </div>
      </div>

      {/* Grid de turnos - 3 columnas con nuevos componentes */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turnosOrdenados.map((turno, index) => renderTurno(turno, index))}
        </div>

        {/* Mensaje si no hay turnos */}
        {turnosOrdenados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No hay turnos en esta semana</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyShiftsSection;