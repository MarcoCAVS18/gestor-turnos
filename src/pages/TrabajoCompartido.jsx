// src/pages/TrabajoCompartido.jsx

import ***REMOVED*** Share2, Plus, ArrowLeft, AlertCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useSharedWork ***REMOVED*** from '../hooks/useSharedWork';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import WorkPreviewCard from '../components/shared/WorkPreviewCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/other/Loader';
import PageHeader from '../components/layout/PageHeader'; // Added import

const TrabajoCompartido = () => ***REMOVED***
  const ***REMOVED*** trabajoCompartido, cargando, error, agregando, agregarTrabajo ***REMOVED*** = useSharedWork();
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const navigate = useNavigate();

  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) ***REMOVED***
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <AlertCircle size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Inicia sesión</h2>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para agregar este trabajo a tu cuenta
          </p>
          <div className="space-y-3">
            <Button
              onClick=***REMOVED***() => navigate('/login', ***REMOVED*** 
                state: ***REMOVED*** redirectTo: window.location.pathname ***REMOVED*** 
              ***REMOVED***)***REMOVED***
              className="w-full"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick=***REMOVED***() => navigate('/register', ***REMOVED*** 
                state: ***REMOVED*** redirectTo: window.location.pathname ***REMOVED*** 
              ***REMOVED***)***REMOVED***
              variant="outline"
              className="w-full"
            >
              Crear cuenta
            </Button>
          </div>
        </Card>
      </div>
    );
  ***REMOVED***

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
          <p className="text-gray-600 mb-6">***REMOVED***error***REMOVED***</p>
          <Button
            onClick=***REMOVED***() => navigate('/trabajos')***REMOVED***
            variant="outline"
            icon=***REMOVED***ArrowLeft***REMOVED***
          >
            Ir a mis trabajos
          </Button>
        </Card>
      </div>
    );
  ***REMOVED***

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Trabajo Compartido"
        subtitle="Detalles del trabajo compartido contigo."
        icon=***REMOVED***Share2***REMOVED***
      />
      ***REMOVED***/* Vista previa del trabajo */***REMOVED***
      ***REMOVED***trabajoCompartido && <WorkPreviewCard trabajo=***REMOVED***trabajoCompartido***REMOVED*** />***REMOVED***

      ***REMOVED***/* Botones de acción */***REMOVED***
      <div className="space-y-3">
        <Button
          onClick=***REMOVED***agregarTrabajo***REMOVED***
          disabled=***REMOVED***agregando***REMOVED***
          loading=***REMOVED***agregando***REMOVED***
          className="w-full"
          icon=***REMOVED***Plus***REMOVED***
        >
          ***REMOVED***agregando ? 'Agregando...' : 'Agregar a mis trabajos'***REMOVED***
        </Button>
        
        <Button
          onClick=***REMOVED***() => navigate('/trabajos')***REMOVED***
          variant="outline"
          className="w-full"
          icon=***REMOVED***ArrowLeft***REMOVED***
        >
          Ir a mis trabajos
        </Button>
      </div>

      ***REMOVED***/* Mensaje de ayuda */***REMOVED***
      <Card className="text-center py-4" padding="sm">
        <p className="text-xs text-gray-500">
          Al agregar este trabajo, se copiará a tu cuenta con todas sus configuraciones.
        </p>
      </Card>
    </div>
  );
***REMOVED***;

export default TrabajoCompartido;