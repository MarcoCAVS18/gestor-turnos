
// src/pages/Trabajos.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ModalTrabajo from '../components/ModalTrabajo';
import AlertaEliminacion from '../components/AlertaEliminacion';
import Loader from '../components/Loader';
import DynamicButton from '../components/DynamicButton';
import ***REMOVED*** PlusCircle, Briefcase, Edit, Trash2, Share2 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** compartirTrabajoNativo ***REMOVED*** from '../services/shareService';

const Trabajos = () => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** trabajos, cargando, borrarTrabajo, turnos ***REMOVED*** = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Estados para modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trabajoAEliminar, setTrabajoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  
  // Estados para funcionalidad de compartir
  const [compartiendoTrabajo, setCompartiendoTrabajo] = useState(***REMOVED******REMOVED***);
  const [mensajesCompartir, setMensajesCompartir] = useState(***REMOVED******REMOVED***);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => ***REMOVED***
    let timer;
    
    if (cargando) ***REMOVED***
      setShowLoading(true);
    ***REMOVED*** else ***REMOVED***
      timer = setTimeout(() => ***REMOVED***
        setShowLoading(false);
      ***REMOVED***, 2000);
    ***REMOVED***
    
    return () => ***REMOVED***
      if (timer) clearTimeout(timer);
    ***REMOVED***;
  ***REMOVED***, [cargando]);
  
  // Funciones para manejar modales
  const abrirModalNuevoTrabajo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;
  
  const abrirModalEditarTrabajo = (trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  ***REMOVED***;
  
  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***;
  
  // Funciones para manejar eliminación
  const iniciarEliminacion = (trabajo) => ***REMOVED***
    setTrabajoAEliminar(trabajo);
    setShowDeleteModal(true);
  ***REMOVED***;
  
  const cancelarEliminacion = () => ***REMOVED***
    setShowDeleteModal(false);
    setTrabajoAEliminar(null);
  ***REMOVED***;
  
  const confirmarEliminacion = async () => ***REMOVED***
    if (!trabajoAEliminar) return;
    
    setEliminando(true);
    try ***REMOVED***
      await borrarTrabajo(trabajoAEliminar.id);
      setShowDeleteModal(false);
      setTrabajoAEliminar(null);
    ***REMOVED*** catch (error) ***REMOVED***
      // Error ya manejado en el contexto
    ***REMOVED*** finally ***REMOVED***
      setEliminando(false);
    ***REMOVED***
  ***REMOVED***;
  
  // Función para manejar el compartir trabajo
  const handleCompartirTrabajo = async (trabajo) => ***REMOVED***
    try ***REMOVED***
      setCompartiendoTrabajo(prev => (***REMOVED*** ...prev, [trabajo.id]: true ***REMOVED***));
      setMensajesCompartir(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));
      
      // Usar la función de compartir nativo
      await compartirTrabajoNativo(currentUser.uid, trabajo);
      
      setMensajesCompartir(prev => (***REMOVED*** 
        ...prev, 
        [trabajo.id]: 'Trabajo compartido exitosamente' 
      ***REMOVED***));
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => ***REMOVED***
        setMensajesCompartir(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));
      ***REMOVED***, 3000);
      
    ***REMOVED*** catch (error) ***REMOVED***
      setMensajesCompartir(prev => (***REMOVED*** 
        ...prev, 
        [trabajo.id]: 'Error al compartir trabajo' 
      ***REMOVED***));
      setTimeout(() => ***REMOVED***
        setMensajesCompartir(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));
      ***REMOVED***, 3000);
    ***REMOVED*** finally ***REMOVED***
      setCompartiendoTrabajo(prev => (***REMOVED*** ...prev, [trabajo.id]: false ***REMOVED***));
    ***REMOVED***
  ***REMOVED***;
  
  // Función para contar turnos de un trabajo
  const contarTurnosTrabajo = (trabajoId) => ***REMOVED***
    return turnos.filter(turno => turno.trabajoId === trabajoId).length;
  ***REMOVED***;
  
  // Generar detalles para el modal de eliminación
  const generarDetallesTrabajo = (trabajo) => ***REMOVED***
    if (!trabajo) return [];
    
    const turnosAsociados = contarTurnosTrabajo(trabajo.id);
    
    return [
      trabajo.nombre,
      `Tarifa base: $***REMOVED***trabajo.tarifaBase?.toFixed(2) || '0.00'***REMOVED***`,
      turnosAsociados > 0 ? `$***REMOVED***turnosAsociados***REMOVED*** $***REMOVED***turnosAsociados === 1 ? 'turno registrado' : 'turnos registrados'***REMOVED***` : 'Sin turnos registrados'
    ];
  ***REMOVED***;
  
  // Generar advertencia si hay turnos asociados
  const generarAdvertencia = (trabajo) => ***REMOVED***
    if (!trabajo) return null;
    
    const turnosAsociados = contarTurnosTrabajo(trabajo.id);
    
    if (turnosAsociados > 0) ***REMOVED***
      return `Este trabajo tiene $***REMOVED***turnosAsociados***REMOVED*** $***REMOVED***turnosAsociados === 1 ? 'turno asociado' : 'turnos asociados'***REMOVED***. Al eliminarlo, también se $***REMOVED***turnosAsociados === 1 ? 'eliminará este turno' : 'eliminarán estos turnos'***REMOVED***.`;
    ***REMOVED***
    
    return null;
  ***REMOVED***;
  
  if (showLoading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis Trabajos</h2>
        <DynamicButton 
          onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
          className="flex items-center gap-2"
        >
          <PlusCircle size=***REMOVED***20***REMOVED*** />
          <span>Nuevo Trabajo</span>
        </DynamicButton>
      </div>
      
      ***REMOVED***/* Contenido principal */***REMOVED***
      ***REMOVED***trabajos.length > 0 ? (
        <div className="space-y-4">
          ***REMOVED***trabajos.map(trabajo => ***REMOVED***
            const turnosCount = contarTurnosTrabajo(trabajo.id);
            const estaCompartiendo = compartiendoTrabajo[trabajo.id] || false;
            const mensajeCompartir = mensajesCompartir[trabajo.id] || '';
            
            return (
              <div 
                key=***REMOVED***trabajo.id***REMOVED***
                className="bg-white rounded-xl shadow-md overflow-hidden border-l-4"
                style=***REMOVED******REMOVED*** borderLeftColor: trabajo.color ***REMOVED******REMOVED***
              >
                <div className="p-4">
                  ***REMOVED***/* Encabezado con nombre y acciones */***REMOVED***
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          ***REMOVED***trabajo.nombre***REMOVED***
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        ***REMOVED***turnosCount***REMOVED*** ***REMOVED***turnosCount === 1 ? 'turno registrado' : 'turnos registrados'***REMOVED***
                      </p>
                    </div>
                    
                    ***REMOVED***/* Botones de acción */***REMOVED***
                    <div className="flex gap-2">
                      <button
                        onClick=***REMOVED***() => abrirModalEditarTrabajo(trabajo)***REMOVED***
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size=***REMOVED***18***REMOVED*** />
                      </button>
                      <button
                        onClick=***REMOVED***() => handleCompartirTrabajo(trabajo)***REMOVED***
                        disabled=***REMOVED***estaCompartiendo***REMOVED***
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Share2 size=***REMOVED***18***REMOVED*** />
                      </button>
                      <button
                        onClick=***REMOVED***() => iniciarEliminacion(trabajo)***REMOVED***
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size=***REMOVED***18***REMOVED*** />
                      </button>
                    </div>
                  </div>
                  
                  ***REMOVED***/* Mensaje de compartir */***REMOVED***
                  ***REMOVED***mensajeCompartir && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">***REMOVED***mensajeCompartir***REMOVED***</p>
                    </div>
                  )***REMOVED***
                  
                  ***REMOVED***/* Información de tarifas */***REMOVED***
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tarifa base:</span>
                        <span className="font-medium">$***REMOVED***trabajo.tarifaBase?.toFixed(2) || '0.00'***REMOVED***</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Diurno:</span>
                        <span className="font-medium">$***REMOVED***trabajo.tarifas?.diurno?.toFixed(2) || '0.00'***REMOVED***</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tarde:</span>
                        <span className="font-medium">$***REMOVED***trabajo.tarifas?.tarde?.toFixed(2) || '0.00'***REMOVED***</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Noche:</span>
                        <span className="font-medium">$***REMOVED***trabajo.tarifas?.noche?.toFixed(2) || '0.00'***REMOVED***</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sábado:</span>
                        <span className="font-medium">$***REMOVED***trabajo.tarifas?.sabado?.toFixed(2) || '0.00'***REMOVED***</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Domingo:</span>
                        <span className="font-medium">$***REMOVED***trabajo.tarifas?.domingo?.toFixed(2) || '0.00'***REMOVED***</span>
                      </div>
                    </div>
                  </div>
                  
                  ***REMOVED***/* Descripción si existe */***REMOVED***
                  ***REMOVED***trabajo.descripcion && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">***REMOVED***trabajo.descripcion***REMOVED***</p>
                    </div>
                  )***REMOVED***
                </div>
              </div>
            );
          ***REMOVED***)***REMOVED***
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Briefcase size=***REMOVED***48***REMOVED*** className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay trabajos registrados</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primer trabajo</p>
          <DynamicButton 
            onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
            className="flex items-center gap-2"
          >
            <PlusCircle size=***REMOVED***20***REMOVED*** />
            <span>Agregar primer trabajo</span>
          </DynamicButton>
        </div>
      )***REMOVED***
      
      ***REMOVED***/* Modal para agregar/editar trabajo */***REMOVED***
      <ModalTrabajo 
        visible=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        trabajoSeleccionado=***REMOVED***trabajoSeleccionado***REMOVED*** 
      />
      
      ***REMOVED***/* Modal de confirmación para eliminar */***REMOVED***
      <AlertaEliminacion
        visible=***REMOVED***showDeleteModal***REMOVED***
        onCancel=***REMOVED***cancelarEliminacion***REMOVED***
        onConfirm=***REMOVED***confirmarEliminacion***REMOVED***
        eliminando=***REMOVED***eliminando***REMOVED***
        tipo="trabajo"
        detalles=***REMOVED***generarDetallesTrabajo(trabajoAEliminar)***REMOVED***
        advertencia=***REMOVED***generarAdvertencia(trabajoAEliminar)***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default Trabajos;