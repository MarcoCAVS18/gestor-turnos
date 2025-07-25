// src/components/dashboard/ProjectionCard/index.jsx - Versión vertical mejorada

import { BarChart3 } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ProjectionCard = ({ proyeccionMensual, horasTrabajadas }) => {
  const { thematicColors } = useApp();

  if (proyeccionMensual <= 0) return null;

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <BarChart3 size={20} style={{ color: thematicColors?.base }} className="mr-2" />
        Proyección mensual
      </h3>
      
      {/* Content - Layout vertical centrado */}
      <div className="flex-1 flex flex-col justify-center text-center space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Si mantienes este ritmo durante todo el mes
          </p>
          <p 
            className="text-4xl font-bold mb-2" 
            style={{ color: thematicColors?.base }}
          >
            ${proyeccionMensual.toFixed(0)}
          </p>
          <p className="text-sm text-gray-500">
            ~{(horasTrabajadas * 4.33).toFixed(0)} horas
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProjectionCard;