// src/components/shifts/WeeklyShiftsSection/index.jsx - Actualizado

import React from 'react';
import ***REMOVED*** Calendar, TrendingUp ***REMOVED*** from 'lucide-react';
import TarjetaTurno from '../../cards/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/TarjetaTurnoDelivery';

const WeeklyShiftsSection = (***REMOVED*** 
  rangoSemana, 
  turnos, 
  totalTurnos, 
  allJobs, 
  onEditShift, 
  onDeleteShift, 
  thematicColors 
***REMOVED***) => ***REMOVED***
  
  // Convertir objeto de turnos a array ordenado por fecha
  const turnosOrdenados = Object.entries(turnos)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
    .flatMap(([fecha, turnosDia]) => 
      turnosDia.map(turno => (***REMOVED*** ...turno, fecha ***REMOVED***))
    );

  // Calcular estadísticas de la semana
  const estadisticasSemana = React.useMemo(() => ***REMOVED***
    let totalGanancias = 0;
    let totalHoras = 0;

    turnosOrdenados.forEach(turno => ***REMOVED***
      // Para turnos de delivery
      if (turno.tipo === 'delivery') ***REMOVED***
        totalGanancias += turno.gananciaTotal || 0;
        
        // Calcular horas para delivery
        if (turno.horaInicio && turno.horaFin) ***REMOVED***
          const [horaI, minI] = turno.horaInicio.split(':').map(Number);
          const [horaF, minF] = turno.horaFin.split(':').map(Number);
          let horas = (horaF + minF/60) - (horaI + minI/60);
          if (horas < 0) horas += 24;
          totalHoras += horas;
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        // Para turnos tradicionales, necesitaríamos calcular con las tarifas
        // Por simplicidad, estimamos basándonos en horas
        if (turno.horaInicio && turno.horaFin) ***REMOVED***
          const [horaI, minI] = turno.horaInicio.split(':').map(Number);
          const [horaF, minF] = turno.horaFin.split(':').map(Number);
          let horas = (horaF + minF/60) - (horaI + minI/60);
          if (horas < 0) horas += 24;
          totalHoras += horas;
          
          // Estimación de ganancia (esto se puede mejorar)
          const trabajo = allJobs.find(j => j.id === turno.trabajoId);
          if (trabajo) ***REMOVED***
            totalGanancias += horas * (trabajo.tarifaBase || 0);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);

    return ***REMOVED***
      totalGanancias,
      totalHoras,
      promedioPorHora: totalHoras > 0 ? totalGanancias / totalHoras : 0
    ***REMOVED***;
  ***REMOVED***, [turnosOrdenados, allJobs]);

  // Función para renderizar el turno correcto según el tipo
  const renderTurno = (turno, index) => ***REMOVED***
    const trabajo = allJobs.find(j => j.id === turno.trabajoId);
    
    // Props comunes para ambos tipos de tarjeta
    const commonProps = ***REMOVED***
      key: `$***REMOVED***turno.id***REMOVED***-$***REMOVED***index***REMOVED***`,
      turno: turno,
      trabajo: trabajo,
      onEdit: () => onEditShift(turno),
      onDelete: () => onDeleteShift(turno),
      variant: 'default',
      compact: true // Para que se vean más compactas en el grid
    ***REMOVED***;

    // Determinar si es delivery y renderizar el componente apropiado
    if (turno.tipo === 'delivery') ***REMOVED***
      return <TarjetaTurnoDelivery ***REMOVED***...commonProps***REMOVED*** />;
    ***REMOVED***
    
    return <TarjetaTurno ***REMOVED***...commonProps***REMOVED*** />;
  ***REMOVED***;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      ***REMOVED***/* Header de la semana */***REMOVED***
      <div 
        className="px-6 py-4 border-b"
        style=***REMOVED******REMOVED*** 
          backgroundColor: thematicColors?.transparent5,
          borderBottomColor: thematicColors?.transparent20
        ***REMOVED******REMOVED***
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar 
              size=***REMOVED***20***REMOVED*** 
              style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
            />
            <div>
              <h3 
                className="font-semibold text-lg"
                style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
              >
                Semana ***REMOVED***rangoSemana***REMOVED***
              </h3>
              <p className="text-sm text-gray-600">
                ***REMOVED***totalTurnos***REMOVED*** ***REMOVED***totalTurnos === 1 ? 'turno' : 'turnos'***REMOVED***
              </p>
            </div>
          </div>

          ***REMOVED***/* Estadísticas de la semana */***REMOVED***
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp size=***REMOVED***16***REMOVED*** />
              <span>$***REMOVED***estadisticasSemana.totalGanancias.toFixed(2)***REMOVED***</span>
            </div>
            <p className="text-xs text-gray-500">
              ***REMOVED***estadisticasSemana.totalHoras.toFixed(1)***REMOVED***h trabajadas
            </p>
          </div>
        </div>
      </div>

      ***REMOVED***/* Grid de turnos - 3 columnas con nuevos componentes */***REMOVED***
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ***REMOVED***turnosOrdenados.map((turno, index) => renderTurno(turno, index))***REMOVED***
        </div>

        ***REMOVED***/* Mensaje si no hay turnos */***REMOVED***
        ***REMOVED***turnosOrdenados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar size=***REMOVED***32***REMOVED*** className="mx-auto mb-2 text-gray-300" />
            <p>No hay turnos en esta semana</p>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default WeeklyShiftsSection;