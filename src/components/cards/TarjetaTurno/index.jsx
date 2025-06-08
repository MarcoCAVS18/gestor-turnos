// src/components/cards/TarjetaTurno/index.jsx - SIMPLIFICADO
import React from 'react';
import ***REMOVED*** Edit, Trash2 ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shift/ShiftDetails';
import ShiftTypeBadge from '../../shift/ShiftTypeBadge';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const TarjetaTurno = (***REMOVED*** turno, trabajo, onEdit, onDelete, showActions = true ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** rangosTurnos ***REMOVED*** = useApp();

  const obtenerTipoTurno = (hora) => ***REMOVED***
    const horaNum = parseInt(hora.split(':')[0]);
    
    const rangos = rangosTurnos

    if (horaNum >= rangos.diurnoInicio && horaNum < rangos.diurnoFin) ***REMOVED***
      return 'diurno';
    ***REMOVED*** else if (horaNum >= rangos.tardeInicio && horaNum < rangos.tardeFin) ***REMOVED***
      return 'tarde';
    ***REMOVED*** else ***REMOVED***
      return 'noche';
    ***REMOVED***
  ***REMOVED***;

  const tipoInicio = obtenerTipoTurno(turno.horaInicio);
  const tipoFin = obtenerTipoTurno(turno.horaFin);

  const actions = [
    ***REMOVED*** icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) ***REMOVED***,
    ***REMOVED*** icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' ***REMOVED***
  ];

  return (
    <Card className="relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h3>
            
            ***REMOVED***/* Badges de tipos de turno */***REMOVED***
            <div className="flex items-center gap-1">
              <ShiftTypeBadge tipoTurno=***REMOVED***tipoInicio***REMOVED*** />
              ***REMOVED***tipoInicio !== tipoFin && (
                <ShiftTypeBadge tipoTurno=***REMOVED***tipoFin***REMOVED*** />
              )***REMOVED***
            </div>
          </div>
          
          <ShiftDetails turno=***REMOVED***turno***REMOVED*** trabajo=***REMOVED***trabajo***REMOVED*** />
        </div>

        ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default TarjetaTurno;