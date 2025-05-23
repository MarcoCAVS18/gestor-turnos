// src/pages/TrabajoCompartido.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { obtenerTrabajoCompartido, aceptarTrabajoCompartido } from '../services/shareService';
import { Briefcase, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import DynamicButton from '../components/DynamicButton';
import Loader from '../components/Loader';

const TrabajoCompartido = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [trabajoData, setTrabajoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aceptando, setAceptando] = useState(false);
  const [exitoso, setExitoso] = useState(false);

  useEffect(() => {
    const cargarTrabajoCompartido = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!token) {
          throw new Error('Token de compartir inválido');
        }

        console.log('Cargando trabajo compartido con token:', token);
        const datos = await obtenerTrabajoCompartido(token);
        console.log('Datos del trabajo compartido:', datos);
        setTrabajoData(datos);
        
      } catch (err) {
        console.error('Error al cargar trabajo compartido:', err);
        setError(err.message || 'No se pudo cargar el trabajo compartido');
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar si hay un usuario logueado
    if (currentUser && token) {
      cargarTrabajoCompartido();
    } else if (!currentUser) {
      setError('Debes iniciar sesión para ver este trabajo compartido');
      setLoading(false);
    } else {
      setError('Token de compartir inválido');
      setLoading(false);
    }
  }, [token, currentUser]);

  const handleAceptarTrabajo = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setAceptando(true);
      setError('');
      
      console.log('Aceptando trabajo compartido...');
      await aceptarTrabajoCompartido(currentUser.uid, token);
      console.log('Trabajo aceptado exitosamente');
      
      setExitoso(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/trabajos');
      }, 3000);
      
    } catch (err) {
      console.error('Error al aceptar trabajo:', err);
      setError(err.message || 'No se pudo agregar el trabajo a tu perfil');
    } finally {
      setAceptando(false);
    }
  };

  const handleRechazar = () => {
    navigate('/dashboard');
  };

  const handleIniciarSesion = () => {
    navigate('/login', { state: { redirectTo: `/compartir/${token}` } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full mx-4">
          <Loader size={65} />
          <p className="text-center text-gray-600 mt-4">Cargando trabajo compartido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
            Error al cargar
          </h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            {!currentUser ? (
              <>
                <DynamicButton
                  onClick={handleIniciarSesion}
                  className="flex-1"
                >
                  Iniciar sesión
                </DynamicButton>
                <DynamicButton
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </DynamicButton>
              </>
            ) : (
              <DynamicButton
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Volver al inicio
              </DynamicButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (exitoso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
            ¡Trabajo agregado exitosamente!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            El trabajo "{trabajoData?.trabajoData?.nombre}" ha sido agregado a tu perfil.
          </p>
          <p className="text-center text-sm text-gray-500">
            Serás redirigido a tu lista de trabajos en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  if (!trabajoData) {
    return null;
  }

  const trabajo = trabajoData.trabajoData;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md max-w-lg w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: trabajo.color + '20' }}
            >
              <Briefcase size={24} style={{ color: trabajo.color }} />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Trabajo Compartido
          </h1>
          <p className="text-center text-gray-600">
            Alguien ha compartido este trabajo contigo
          </p>
        </div>

        {/* Contenido del trabajo */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: trabajo.color }}
              />
              {trabajo.nombre}
            </h2>
            
            {trabajo.descripcion && (
              <p className="text-gray-600 mb-4">{trabajo.descripcion}</p>
            )}
          </div>

          {/* Detalles de tarifas */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <DollarSign size={18} className="mr-2" />
              Tarifas
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base:</span>
                <span className="font-medium">${trabajo.tarifaBase?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diurno:</span>
                <span className="font-medium">${trabajo.tarifas?.diurno?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarde:</span>
                <span className="font-medium">${trabajo.tarifas?.tarde?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Noche:</span>
                <span className="font-medium">${trabajo.tarifas?.noche?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sábado:</span>
                <span className="font-medium">${trabajo.tarifas?.sabado?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Domingo:</span>
                <span className="font-medium">${trabajo.tarifas?.domingo?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">
                  ¿Deseas agregar este trabajo a tu perfil?
                </p>
                <p className="text-blue-600">
                  Al aceptar, este trabajo se agregará a tu lista de trabajos y podrás crear turnos para él.
                  Este enlace ha sido usado {trabajoData.vecesUsado} veces.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <DynamicButton
              onClick={handleRechazar}
              variant="outline"
              className="flex-1"
              disabled={aceptando}
            >
              No, gracias
            </DynamicButton>
            <DynamicButton
              onClick={handleAceptarTrabajo}
              className="flex-1"
              disabled={aceptando}
            >
              {aceptando ? (
                <span className="flex items-center">
                  <div className="mr-2">
                    <Loader size={16} />
                  </div>
                  Agregando...
                </span>
              ) : (
                'Sí, agregar trabajo'
              )}
            </DynamicButton>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrabajoCompartido;