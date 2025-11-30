// src/components/changelog/ChangeLog/index.jsx

import React from 'react';
import ***REMOVED*** Gift ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const ChangeLog = () => ***REMOVED***
  const changes = [
    ***REMOVED***
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
    ***REMOVED***,
  ];

  return (
    <Card>
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Gift size=***REMOVED***20***REMOVED*** className="mr-2" />
          Novedades
        </h3>
      </Flex>
      <div className="space-y-4">
        ***REMOVED***changes.map((change, index) => (
          <div key=***REMOVED***index***REMOVED***>
            <h4 className="font-semibold">***REMOVED***change.title***REMOVED***</h4>
            <p className="text-sm text-gray-500 mb-2">
              ***REMOVED***change.date***REMOVED***
            </p>
            <p className="text-sm text-gray-700 mb-2">***REMOVED***change.description***REMOVED***</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              ***REMOVED***change.features.map((feature, i) => (
                <li key=***REMOVED***i***REMOVED***>***REMOVED***feature***REMOVED***</li>
              ))***REMOVED***
            </ul>
          </div>
        ))***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default ChangeLog;
