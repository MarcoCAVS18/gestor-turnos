// src/pages/TrabajoCompartido.jsx

import React from 'react';
import { Share2, Plus } from 'lucide-react';
import { useSharedWork } from '../hooks/useSharedWork';
import WorkPreviewCard from '../components/shared/WorkPreviewCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/other/Loader';

const TrabajoCompartido = () => {
  const { trabajoCompartido, cargando, error, agregando, agregarTrabajo } = useSharedWork();

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <Share2 size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <Card className="text-center">
        <Share2 size={32} className="mx-auto mb-3 text-blue-500" />
        <h1 className="text-2xl font-bold mb-2">Trabajo Compartido</h1>
        <p className="text-gray-600">Alguien compartió este trabajo contigo</p>
      </Card>

      <WorkPreviewCard trabajo={trabajoCompartido} />

      <Button
        onClick={agregarTrabajo}
        disabled={agregando}
        loading={agregando}
        className="w-full flex items-center justify-center gap-2"
        icon={Plus}
      >
        Agregar a mis trabajos
      </Button>
    </div>
  );
};

export default TrabajoCompartido;