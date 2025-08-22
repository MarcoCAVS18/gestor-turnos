// src/components/cards/TarjetaTurno/index.jsx - Con soporte para showActions

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shifts/ShiftDetails';
import { useApp } from '../../../contexts/AppContext';
import { determinarTipoTurno, getTipoTurnoLabel } from '../../../utils/shiftDetailsUtils';

const TarjetaTurno = ({ 
  turno, 
  trabajo, 
  onEdit, 
  onDelete, 
  showActions = true, // Nueva prop para controlar las acciones
  variant = 'card'
}) => {
  const { shiftRanges } = useApp(); 

  // Validaciones defensivas
  if (!turno) {
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Turno no encontrado</p>
        </div>
      </Card>
    );
  }

  if (!trabajo) {
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Trabajo eliminado</p>
          <p className="text-xs text-gray-400 mt-1">
            {turno.horaInicio} - {turno.horaFin}
          </p>
        </div>
      </Card>
    );
  }

  // Usar la utilidad centralizada
  const tipoTurno = determinarTipoTurno(turno, shiftRanges);
  const labelTipoTurno = getTipoTurnoLabel(tipoTurno);

  const actions = [
    { icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) },
    { icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' }
  ];

  // Función para obtener el color de la etiqueta según el tipo
  const getTagColor = (tipo) => {
    const colors = {
      diurno: 'bg-yellow-100 text-yellow-700',
      tarde: 'bg-orange-100 text-orange-700', 
      noche: 'bg-blue-100 text-blue-700',
      sabado: 'bg-purple-100 text-purple-700',
      domingo: 'bg-red-100 text-red-700',
      delivery: 'bg-green-100 text-green-700',
      mixto: 'bg-gray-100 text-gray-700'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-700';
  };
  
  const cardContent = (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {/* Título con etiqueta del tipo de turno */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-800">{trabajo.nombre}</h3>
          {/* Etiqueta del tipo de turno al lado del nombre */}
          <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(tipoTurno)}`}>
            {labelTipoTurno}
          </span>
        </div>
        
        <ShiftDetails 
          turno={turno} 
          trabajo={trabajo}
        />
      </div>

      {/* Solo mostrar acciones si showActions es true */}
      {showActions && <ActionsMenu actions={actions} />}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="p-3 rounded-lg transition-colors">
        {cardContent}
      </div>
    );
  }

  return (
    <Card className="relative !shadow-none">
      {cardContent}
    </Card>
  );
};

export default TarjetaTurno;