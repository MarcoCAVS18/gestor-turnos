// src/pages/TrabajoCompartido.jsx

import { motion } from 'framer-motion';
import { Share2, Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSharedWork } from '../hooks/useSharedWork';
import { useAuth } from '../contexts/AuthContext';
import WorkPreviewCard from '../components/shared/WorkPreviewCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/other/Loader';

const TrabajoCompartido = () => {
  const { trabajoCompartido, cargando, error, agregando, agregarTrabajo, tokenInfo } = useSharedWork();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Inicia sesión</h2>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para agregar este trabajo a tu cuenta
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/login', { 
                state: { redirectTo: window.location.pathname } 
              })}
              className="w-full"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() => navigate('/register', { 
                state: { redirectTo: window.location.pathname } 
              })}
              variant="outline"
              className="w-full"
            >
              Crear cuenta
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/trabajos')}
            variant="outline"
            icon={ArrowLeft}
          >
            Ir a mis trabajos
          </Button>
        </Card>
      </div>
    );
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div variants={headerVariants} initial="hidden" animate="visible">
        <Card className="text-center">
          <Share2 size={32} className="mx-auto mb-3 text-blue-500" />
          <h1 className="text-2xl font-bold mb-2">Trabajo Compartido</h1>
          <p className="text-gray-600">Alguien compartió este trabajo contigo</p>
          
          {/* Información adicional del enlace */}
          {tokenInfo && (
            <div className="mt-4 text-xs text-gray-500">
              <p>Usado {tokenInfo.vecesUsado} veces</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Vista previa del trabajo */}
      {trabajoCompartido && <WorkPreviewCard trabajo={trabajoCompartido} />}

      {/* Botones de acción */}
      <div className="space-y-3">
        <Button
          onClick={agregarTrabajo}
          disabled={agregando}
          loading={agregando}
          className="w-full"
          icon={Plus}
        >
          {agregando ? 'Agregando...' : 'Agregar a mis trabajos'}
        </Button>
        
        <Button
          onClick={() => navigate('/trabajos')}
          variant="outline"
          className="w-full"
          icon={ArrowLeft}
        >
          Ir a mis trabajos
        </Button>
      </div>

      {/* Mensaje de ayuda */}
      <Card className="text-center py-4" padding="sm">
        <p className="text-xs text-gray-500">
          Al agregar este trabajo, se copiará a tu cuenta con todas sus configuraciones.
        </p>
      </Card>
    </div>
  );
};

export default TrabajoCompartido;