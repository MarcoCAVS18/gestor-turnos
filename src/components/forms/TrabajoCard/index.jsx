// src/components/cards/TrabajoCard/index.jsx
import React from 'react';
import { Edit, Trash2, Share2, Info } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useShare } from '../../../hooks/useShare';
import { formatCurrency } from '../../../utils/helpers';

const TrabajoCard = ({ 
  trabajo, 
  turnosCount = 0,
  onEdit, 
  onDelete,
  onToggleDetails 
}) => {
  const { sharing, messages, shareWork } = useShare();
  const [showDetails, setShowDetails] = React.useState(false);
  
  const isSharing = sharing[trabajo.id] || false;
  const shareMessage = messages[trabajo.id] || '';

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    if (onToggleDetails) {
      onToggleDetails(trabajo.id, !showDetails);
    }
  };

  return (
    <Card
      borderColor={trabajo.color}
      borderPosition="left"
      className="transition-all hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: trabajo.color }}
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {trabajo.nombre}
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            {turnosCount} {turnosCount === 1 ? 'turno registrado' : 'turnos registrados'}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleDetails}
            icon={Info}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(trabajo)}
            icon={Edit}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => shareWork(trabajo)}
            loading={isSharing}
            icon={Share2}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(trabajo)}
            icon={Trash2}
          />
        </div>
      </div>
      
      {/* Share Message */}
      {shareMessage && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{shareMessage}</p>
        </div>
      )}
      
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tarifa base:</span>
            <span className="font-medium">{formatCurrency(trabajo.tarifaBase)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Diurno:</span>
            <span className="font-medium">{formatCurrency(trabajo.tarifas?.diurno || 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tarde:</span>
            <span className="font-medium">{formatCurrency(trabajo.tarifas?.tarde || 0)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Noche:</span>
            <span className="font-medium">{formatCurrency(trabajo.tarifas?.noche || 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sábado:</span>
            <span className="font-medium">{formatCurrency(trabajo.tarifas?.sabado || 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Domingo:</span>
            <span className="font-medium">{formatCurrency(trabajo.tarifas?.domingo || 0)}</span>
          </div>
        </div>
      </div>
      
      {/* Description */}
      {trabajo.descripcion && (showDetails || trabajo.descripcion.length < 100) && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{trabajo.descripcion}</p>
        </div>
      )}
    </Card>
  );
};

export default TrabajoCard;