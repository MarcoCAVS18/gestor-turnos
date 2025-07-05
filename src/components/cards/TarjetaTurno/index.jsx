import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shift/ShiftDetails';
import ShiftTypeBadge from '../../shift/ShiftTypeBadge';
import { useApp } from '../../../contexts/AppContext';
import { getTagForShift } from '../../../utils/shiftUtils';

const TarjetaTurno = ({ 
  turno, 
  trabajo, 
  onEdit, 
  onDelete, 
  showActions = true,
  variant = 'card'
}) => {
  const { shiftRanges } = useApp(); 


  const tipoTurno = getTagForShift(turno.horaInicio, shiftRanges);

  const actions = [
    { icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) },
    { icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' }
  ];
  
  const cardContent = (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 mb-2">{trabajo.nombre}</h3>
        
        <ShiftDetails 
          turno={turno} 
          trabajo={trabajo}
          badges={
            <ShiftTypeBadge tipoTurno={tipoTurno.toLowerCase()} />
          }
        />
      </div>

      {showActions && <ActionsMenu actions={actions} />}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="rounded-lg transition-colors">
        {cardContent}
      </div>
    );
  }

  return (
    <Card className="relative">
      {cardContent}
    </Card>
  );
};

export default TarjetaTurno;