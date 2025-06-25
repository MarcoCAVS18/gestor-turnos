// src/components/cards/TarjetaTrabajo/index.jsx

import ***REMOVED*** Edit, Trash2, Share2 ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import WorkRates from '../../work/WorkRates';
import ActionsMenu from '../../ui/ActionsMenu';

const TarjetaTrabajo = (***REMOVED*** trabajo, onEdit, onDelete, onShare, showActions = true ***REMOVED***) => ***REMOVED***
  const descripcion = trabajo.descripcion && trabajo.descripcion.trim() 
    ? trabajo.descripcion 
    : 'No olvides guardar más información sobre tu trabajo.';

  const actions = [
    ***REMOVED*** icon: Edit, label: 'Editar', onClick: () => onEdit?.(trabajo) ***REMOVED***,
    ...(onShare ? [***REMOVED*** icon: Share2, label: 'Compartir', onClick: () => onShare?.(trabajo) ***REMOVED***] : []),
    ***REMOVED*** icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(trabajo), variant: 'danger' ***REMOVED***
  ];

  return (
    <Card className="relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1">
          <WorkAvatar nombre=***REMOVED***trabajo.nombre***REMOVED*** color=***REMOVED***trabajo.color***REMOVED*** />
          
          <div className="flex-1 ml-4">
            <h3 className="font-semibold text-gray-800 mb-1">***REMOVED***trabajo.nombre***REMOVED***</h3>
            <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
              ***REMOVED***descripcion***REMOVED***
            </p>
            <WorkRates trabajo=***REMOVED***trabajo***REMOVED*** />
          </div>
        </div>

        ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default TarjetaTrabajo;