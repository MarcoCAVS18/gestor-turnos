// src/pages/TrabajoCompartido.jsx

import React from 'react';
import ***REMOVED*** Share2, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useSharedWork ***REMOVED*** from '../hooks/useSharedWork';
import WorkPreviewCard from '../components/shared/WorkPreviewCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/other/Loader';

const TrabajoCompartido = () => ***REMOVED***
  const ***REMOVED*** trabajoCompartido, cargando, error, agregando, agregarTrabajo ***REMOVED*** = useSharedWork();

  if (cargando) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***

  if (error) ***REMOVED***
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <Share2 size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">***REMOVED***error***REMOVED***</p>
        </Card>
      </div>
    );
  ***REMOVED***

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <Card className="text-center">
        <Share2 size=***REMOVED***32***REMOVED*** className="mx-auto mb-3 text-blue-500" />
        <h1 className="text-2xl font-bold mb-2">Trabajo Compartido</h1>
        <p className="text-gray-600">Alguien compartió este trabajo contigo</p>
      </Card>

      <WorkPreviewCard trabajo=***REMOVED***trabajoCompartido***REMOVED*** />

      <Button
        onClick=***REMOVED***agregarTrabajo***REMOVED***
        disabled=***REMOVED***agregando***REMOVED***
        loading=***REMOVED***agregando***REMOVED***
        className="w-full flex items-center justify-center gap-2"
        icon=***REMOVED***Plus***REMOVED***
      >
        Agregar a mis trabajos
      </Button>
    </div>
  );
***REMOVED***;

export default TrabajoCompartido;