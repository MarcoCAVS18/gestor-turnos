// src/components/changelog/ChangeLog/index.jsx

import React from 'react';
import { Gift } from 'lucide-react';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const ChangeLog = () => {
  const changes = [
    {
      version: 'v1.1.0',
      date: '2025-11-30',
      title: 'Barra de Progreso Mejorada',
      description:
        'Se ha añadido un nuevo componente de barra de progreso animada para una visualización más atractiva de las estadísticas. Ahora, los resúmenes semanales, las metas y las comparativas de plataformas tienen una apariencia más moderna y consistente.',
      features: [
        'Nuevo componente ProgressBar reutilizable',
        'Animación de llenado para mayor dinamismo',
        'Refactorización de Esta Semana, Progreso Semanal y Plataformas',
      ],
    },
  ];

  return (
    <Card>
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Gift size={20} className="mr-2" />
          Novedades
        </h3>
      </Flex>
      <div className="space-y-4">
        {changes.map((change, index) => (
          <div key={index}>
            <h4 className="font-semibold">{change.title}</h4>
            <p className="text-sm text-gray-500 mb-2">
              {change.date}
            </p>
            <p className="text-sm text-gray-700 mb-2">{change.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {change.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChangeLog;
