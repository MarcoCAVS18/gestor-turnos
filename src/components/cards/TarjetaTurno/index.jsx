// src/components/cards/TarjetaTurno/index.jsx - Con soporte para showActions

import React from 'react';
import ***REMOVED*** Edit, Trash2 ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shifts/ShiftDetails';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** determinarTipoTurno, getTipoTurnoLabel ***REMOVED*** from '../../../utils/shiftDetailsUtils';

const TarjetaTurno = (***REMOVED*** 
  turno, 
  trabajo, 
  onEdit, 
  onDelete, 
  showActions = true, // Nueva prop para controlar las acciones
  variant = 'card'
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftRanges ***REMOVED*** = useApp(); 

  // Validaciones defensivas
  if (!turno) ***REMOVED***
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Turno no encontrado</p>
        </div>
      </Card>
    );
  ***REMOVED***

  if (!trabajo) ***REMOVED***
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Trabajo eliminado</p>
          <p className="text-xs text-gray-400 mt-1">
            ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  // Usar la utilidad centralizada
  const tipoTurno = determinarTipoTurno(turno, shiftRanges);
  const labelTipoTurno = getTipoTurnoLabel(tipoTurno);

  const actions = [
    ***REMOVED*** icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) ***REMOVED***,
    ***REMOVED*** icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' ***REMOVED***
  ];

  // Función para obtener el color de la etiqueta según el tipo
  const getTagColor = (tipo) => ***REMOVED***
    const colors = ***REMOVED***
      diurno: 'bg-yellow-100 text-yellow-700',
      tarde: 'bg-orange-100 text-orange-700', 
      noche: 'bg-blue-100 text-blue-700',
      sabado: 'bg-purple-100 text-purple-700',
      domingo: 'bg-red-100 text-red-700',
      delivery: 'bg-green-100 text-green-700',
      mixto: 'bg-gray-100 text-gray-700'
    ***REMOVED***;
    return colors[tipo] || 'bg-gray-100 text-gray-700';
  ***REMOVED***;
  
  const cardContent = (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        ***REMOVED***/* Título con etiqueta del tipo de turno */***REMOVED***
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h3>
          ***REMOVED***/* Etiqueta del tipo de turno al lado del nombre */***REMOVED***
          <span className=***REMOVED***`text-xs px-2 py-1 rounded-full $***REMOVED***getTagColor(tipoTurno)***REMOVED***`***REMOVED***>
            ***REMOVED***labelTipoTurno***REMOVED***
          </span>
        </div>
        
        <ShiftDetails 
          turno=***REMOVED***turno***REMOVED*** 
          trabajo=***REMOVED***trabajo***REMOVED***
        />
      </div>

      ***REMOVED***/* Solo mostrar acciones si showActions es true */***REMOVED***
      ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
    </div>
  );

  if (variant === 'compact') ***REMOVED***
    return (
      <div className="p-3 rounded-lg transition-colors">
        ***REMOVED***cardContent***REMOVED***
      </div>
    );
  ***REMOVED***

  return (
    <Card className="relative !shadow-none">
      ***REMOVED***cardContent***REMOVED***
    </Card>
  );
***REMOVED***;

export default TarjetaTurno;