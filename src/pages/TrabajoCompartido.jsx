// src/pages/TrabajoCompartido.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useParams, useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** obtenerTrabajoCompartido, aceptarTrabajoCompartido ***REMOVED*** from '../services/shareService';
import ***REMOVED*** Briefcase, DollarSign, AlertCircle, CheckCircle ***REMOVED*** from 'lucide-react';
import DynamicButton from '../components/DynamicButton';
import Loader from '../components/Loader';

const TrabajoCompartido = () => ***REMOVED***
  const ***REMOVED*** token ***REMOVED*** = useParams();
  const navigate = useNavigate();
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  
  const [trabajoData, setTrabajoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aceptando, setAceptando] = useState(false);
  const [exitoso, setExitoso] = useState(false);

  useEffect(() => ***REMOVED***
    const cargarTrabajoCompartido = async () => ***REMOVED***
      try ***REMOVED***
        setLoading(true);
        setError('');
        
        if (!token) ***REMOVED***
          throw new Error('Token de compartir inválido');
        ***REMOVED***

        console.log('Cargando trabajo compartido con token:', token);
        const datos = await obtenerTrabajoCompartido(token);
        console.log('Datos del trabajo compartido:', datos);
        setTrabajoData(datos);
        
      ***REMOVED*** catch (err) ***REMOVED***
        console.error('Error al cargar trabajo compartido:', err);
        setError(err.message || 'No se pudo cargar el trabajo compartido');
      ***REMOVED*** finally ***REMOVED***
        setLoading(false);
      ***REMOVED***
    ***REMOVED***;

    // Solo cargar si hay un usuario logueado
    if (currentUser && token) ***REMOVED***
      cargarTrabajoCompartido();
    ***REMOVED*** else if (!currentUser) ***REMOVED***
      setError('Debes iniciar sesión para ver este trabajo compartido');
      setLoading(false);
    ***REMOVED*** else ***REMOVED***
      setError('Token de compartir inválido');
      setLoading(false);
    ***REMOVED***
  ***REMOVED***, [token, currentUser]);

  const handleAceptarTrabajo = async () => ***REMOVED***
    if (!currentUser) ***REMOVED***
      navigate('/login');
      return;
    ***REMOVED***

    try ***REMOVED***
      setAceptando(true);
      setError('');
      
      console.log('Aceptando trabajo compartido...');
      await aceptarTrabajoCompartido(currentUser.uid, token);
      console.log('Trabajo aceptado exitosamente');
      
      setExitoso(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => ***REMOVED***
        navigate('/trabajos');
      ***REMOVED***, 3000);
      
    ***REMOVED*** catch (err) ***REMOVED***
      console.error('Error al aceptar trabajo:', err);
      setError(err.message || 'No se pudo agregar el trabajo a tu perfil');
    ***REMOVED*** finally ***REMOVED***
      setAceptando(false);
    ***REMOVED***
  ***REMOVED***;

  const handleRechazar = () => ***REMOVED***
    navigate('/dashboard');
  ***REMOVED***;

  const handleIniciarSesion = () => ***REMOVED***
    navigate('/login', ***REMOVED*** state: ***REMOVED*** redirectTo: `/compartir/$***REMOVED***token***REMOVED***` ***REMOVED*** ***REMOVED***);
  ***REMOVED***;

  if (loading) ***REMOVED***
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full mx-4">
          <Loader size=***REMOVED***65***REMOVED*** />
          <p className="text-center text-gray-600 mt-4">Cargando trabajo compartido...</p>
        </div>
      </div>
    );
  ***REMOVED***

  if (error) ***REMOVED***
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
            Error al cargar
          </h2>
          <p className="text-center text-gray-600 mb-6">***REMOVED***error***REMOVED***</p>
          <div className="flex gap-3">
            ***REMOVED***!currentUser ? (
              <>
                <DynamicButton
                  onClick=***REMOVED***handleIniciarSesion***REMOVED***
                  className="flex-1"
                >
                  Iniciar sesión
                </DynamicButton>
                <DynamicButton
                  onClick=***REMOVED***() => navigate('/')***REMOVED***
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </DynamicButton>
              </>
            ) : (
              <DynamicButton
                onClick=***REMOVED***() => navigate('/dashboard')***REMOVED***
                className="w-full"
              >
                Volver al inicio
              </DynamicButton>
            )***REMOVED***
          </div>
        </div>
      </div>
    );
  ***REMOVED***

  if (exitoso) ***REMOVED***
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
            El trabajo "***REMOVED***trabajoData?.trabajoData?.nombre***REMOVED***" ha sido agregado a tu perfil.
          </p>
          <p className="text-center text-sm text-gray-500">
            Serás redirigido a tu lista de trabajos en unos segundos...
          </p>
        </div>
      </div>
    );
  ***REMOVED***

  if (!trabajoData) ***REMOVED***
    return null;
  ***REMOVED***

  const trabajo = trabajoData.trabajoData;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md max-w-lg w-full">
        ***REMOVED***/* Header */***REMOVED***
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style=***REMOVED******REMOVED*** backgroundColor: trabajo.color + '20' ***REMOVED******REMOVED***
            >
              <Briefcase size=***REMOVED***24***REMOVED*** style=***REMOVED******REMOVED*** color: trabajo.color ***REMOVED******REMOVED*** />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Trabajo Compartido
          </h1>
          <p className="text-center text-gray-600">
            Alguien ha compartido este trabajo contigo
          </p>
        </div>

        ***REMOVED***/* Contenido del trabajo */***REMOVED***
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
              />
              ***REMOVED***trabajo.nombre***REMOVED***
            </h2>
            
            ***REMOVED***trabajo.descripcion && (
              <p className="text-gray-600 mb-4">***REMOVED***trabajo.descripcion***REMOVED***</p>
            )***REMOVED***
          </div>

          ***REMOVED***/* Detalles de tarifas */***REMOVED***
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <DollarSign size=***REMOVED***18***REMOVED*** className="mr-2" />
              Tarifas
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base:</span>
                <span className="font-medium">$***REMOVED***trabajo.tarifaBase?.toFixed(2)***REMOVED***</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diurno:</span>
                <span className="font-medium">$***REMOVED***trabajo.tarifas?.diurno?.toFixed(2)***REMOVED***</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarde:</span>
                <span className="font-medium">$***REMOVED***trabajo.tarifas?.tarde?.toFixed(2)***REMOVED***</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Noche:</span>
                <span className="font-medium">$***REMOVED***trabajo.tarifas?.noche?.toFixed(2)***REMOVED***</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sábado:</span>
                <span className="font-medium">$***REMOVED***trabajo.tarifas?.sabado?.toFixed(2)***REMOVED***</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Domingo:</span>
                <span className="font-medium">$***REMOVED***trabajo.tarifas?.domingo?.toFixed(2)***REMOVED***</span>
              </div>
            </div>
          </div>

          ***REMOVED***/* Información adicional */***REMOVED***
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">
                  ¿Deseas agregar este trabajo a tu perfil?
                </p>
                <p className="text-blue-600">
                  Al aceptar, este trabajo se agregará a tu lista de trabajos y podrás crear turnos para él.
                  Este enlace ha sido usado ***REMOVED***trabajoData.vecesUsado***REMOVED*** veces.
                </p>
              </div>
            </div>
          </div>

          ***REMOVED***/* Botones de acción */***REMOVED***
          <div className="flex gap-3">
            <DynamicButton
              onClick=***REMOVED***handleRechazar***REMOVED***
              variant="outline"
              className="flex-1"
              disabled=***REMOVED***aceptando***REMOVED***
            >
              No, gracias
            </DynamicButton>
            <DynamicButton
              onClick=***REMOVED***handleAceptarTrabajo***REMOVED***
              className="flex-1"
              disabled=***REMOVED***aceptando***REMOVED***
            >
              ***REMOVED***aceptando ? (
                <span className="flex items-center">
                  <div className="mr-2">
                    <Loader size=***REMOVED***16***REMOVED*** />
                  </div>
                  Agregando...
                </span>
              ) : (
                'Sí, agregar trabajo'
              )***REMOVED***
            </DynamicButton>
          </div>

          ***REMOVED***/* Error message */***REMOVED***
          ***REMOVED***error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
            </div>
          )***REMOVED***
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default TrabajoCompartido;