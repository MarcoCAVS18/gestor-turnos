// src/components/cards/TarjetaTurno/index.jsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shift/ShiftDetails';
import ShiftTypeBadge from '../../shift/ShiftTypeBadge';
import { useApp } from '../../../contexts/AppContext';

const TarjetaTurno = ({ 
  turno, 
  trabajo, 
  onEdit, 
  onDelete, 
  showActions = true,
  variant = 'card' // 'card' | 'compact'
}) => {
  const { rangosTurnos } = useApp();

  const obtenerTipoTurno = (hora) => {
    const horaNum = parseInt(hora.split(':')[0]);
    
    const rangos = rangosTurnos

    if (horaNum >= rangos.diurnoInicio && horaNum < rangos.diurnoFin) {
      return 'diurno';
    } else if (horaNum >= rangos.tardeInicio && horaNum < rangos.tardeFin) {
      return 'tarde';
    } else {
      return 'noche';
    }
  };

  const tipoInicio = obtenerTipoTurno(turno.horaInicio);
  const tipoFin = obtenerTipoTurno(turno.horaFin);

  const actions = [
    { icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) },
    { icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' }
  ];

  // Si es variant 'compact', no usar Card wrapper
  if (variant === 'compact') {
    return (
      <div className=" rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">{trabajo.nombre}</h3>
            
            <ShiftDetails 
              turno={turno} 
              trabajo={trabajo}
              badges={
                <div className="flex items-center gap-1">
                  <ShiftTypeBadge tipoTurno={tipoInicio} />
                  {tipoInicio !== tipoFin && (
                    <ShiftTypeBadge tipoTurno={tipoFin} />
                  )}
                </div>
              }
            />
          </div>

          {showActions && <ActionsMenu actions={actions} />}
        </div>
      </div>
    );
  }

  // Variante por defecto con Card
  return (
    <Card className="relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">{trabajo.nombre}</h3>
          
          <ShiftDetails 
            turno={turno} 
            trabajo={trabajo}
            badges={
              <div className="flex items-center gap-1">
                <ShiftTypeBadge tipoTurno={tipoInicio} />
                {tipoInicio !== tipoFin && (
                  <ShiftTypeBadge tipoTurno={tipoFin} />
                )}
              </div>
            }
          />
        </div>

        {showActions && <ActionsMenu actions={actions} />}
      </div>
    </Card>
  );
};

export default TarjetaTurno;