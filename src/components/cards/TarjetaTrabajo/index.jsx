// src/components/cards/TarjetaTrabajo/index.jsx

import { Edit, Trash2, Share2 } from 'lucide-react';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import WorkRates from '../../work/WorkRates';
import ActionsMenu from '../../ui/ActionsMenu';

const TarjetaTrabajo = ({ trabajo, onEdit, onDelete, onShare, showActions = true }) => {
  // Validación defensiva - si no hay trabajo, mostrar estado de error
  if (!trabajo) {
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Trabajo no encontrado</p>
        </div>
      </Card>
    );
  }

  // Validaciones defensivas para propiedades del trabajo
  const nombreTrabajo = trabajo.nombre || 'Trabajo sin nombre';
  const colorTrabajo = trabajo.color || '#EC4899';
  const descripcion = trabajo.descripcion && trabajo.descripcion.trim() 
    ? trabajo.descripcion 
    : 'No olvides guardar más información sobre tu trabajo.';

  // Configurar acciones del menú
  const actions = [
    { 
      icon: Edit, 
      label: 'Editar', 
      onClick: () => onEdit?.(trabajo) 
    },
    ...(onShare ? [{ 
      icon: Share2, 
      label: 'Compartir', 
      onClick: () => onShare?.(trabajo) 
    }] : []),
    { 
      icon: Trash2, 
      label: 'Eliminar', 
      onClick: () => onDelete?.(trabajo), 
      variant: 'danger' 
    }
  ];

  return (
    <Card className="relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1">
          <WorkAvatar 
            nombre={nombreTrabajo} 
            color={colorTrabajo} 
          />
          
          <div className="flex-1 ml-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              {nombreTrabajo}
            </h3>
            <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
              {descripcion}
            </p>
            <WorkRates trabajo={trabajo} />
          </div>
        </div>

        {showActions && <ActionsMenu actions={actions} />}
      </div>
    </Card>
  );
};

export default TarjetaTrabajo;