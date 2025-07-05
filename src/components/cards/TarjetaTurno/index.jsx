import React from 'react';
import ***REMOVED*** Edit, Trash2 ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shift/ShiftDetails';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** getTagForShift ***REMOVED*** from '../../../utils/shiftUtils';

const TarjetaTurno = (***REMOVED*** 
  turno, 
  trabajo, 
  onEdit, 
  onDelete, 
  showActions = true,
  variant = 'card'
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftRanges ***REMOVED*** = useApp(); 


  const tipoTurno = getTagForShift(turno.horaInicio, shiftRanges);

  console.log(tipoTurno)

  const actions = [
    ***REMOVED*** icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) ***REMOVED***,
    ***REMOVED*** icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' ***REMOVED***
  ];
  
  const cardContent = (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 mb-2">***REMOVED***trabajo.nombre***REMOVED***</h3>
        
        <ShiftDetails 
          turno=***REMOVED***turno***REMOVED*** 
          trabajo=***REMOVED***trabajo***REMOVED***
        />
      </div>

      ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
    </div>
  );

  if (variant === 'compact') ***REMOVED***
    return (
      <div className="rounded-lg transition-colors">
        ***REMOVED***cardContent***REMOVED***
      </div>
    );
  ***REMOVED***

  return (
    <Card className="relative">
      ***REMOVED***cardContent***REMOVED***
    </Card>
  );
***REMOVED***;

export default TarjetaTurno;