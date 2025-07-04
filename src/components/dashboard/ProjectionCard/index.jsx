// src/components/dashboard/ProjectionCard/index.jsx

import { BarChart3 } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ProjectionCard = ({ proyeccionMensual, horasTrabajadas }) => {
  const { thematicColors } = useApp();

  if (proyeccionMensual <= 0) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <BarChart3 size={20} style={{ color: thematicColors?.base }} className="mr-2" />
        Proyección mensual
      </h3>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Si mantienes este ritmo durante todo el mes
        </p>
        <p 
          className="text-3xl font-bold" 
          style={{ color: thematicColors?.base }}
        >
          ${proyeccionMensual.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          ~{(horasTrabajadas * 4.33).toFixed(0)} horas
        </p>
      </div>
    </Card>
  );
};

export default ProjectionCard;