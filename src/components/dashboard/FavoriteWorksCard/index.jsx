// src/components/dashboard/FavoriteWorksCard/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const FavoriteWorksCard = ({ trabajosFavoritos }) => {
  const { thematicColors } = useApp();
  const navigate = useNavigate();

  if (trabajosFavoritos.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size={20} style={{ color: thematicColors?.base }} className="mr-2" />
          Trabajos favoritos
        </h3>
        <Button
          onClick={() => navigate('/estadisticas')}
          size="sm"
          variant="ghost"
          className="flex items-center gap-1"
          icon={ChevronRight}
        >
          Ver más
        </Button>
      </div>
      
      <div className="space-y-3">
        {trabajosFavoritos.map((trabajoInfo, index) => (
          <div key={trabajoInfo.trabajo.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-400 mr-3">
                #{index + 1}
              </span>
              <div 
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: trabajoInfo.trabajo.color }}
              />
              <div>
                <p className="font-medium text-gray-800">{trabajoInfo.trabajo.nombre}</p>
                <p className="text-xs text-gray-500">{trabajoInfo.turnos} turnos</p>
              </div>
            </div>
            <p 
              className="text-sm font-semibold" 
              style={{ color: thematicColors?.base }}
            >
              ${trabajoInfo.ganancia.toFixed(0)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FavoriteWorksCard;