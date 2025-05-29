// src/pages/Trabajos.jsx

import React, { useState, useEffect } from 'react';
import { PlusCircle, Briefcase, Edit, Trash2, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { compartirTrabajoNativo } from '../services/shareService';

// Nuevas importaciones estructuradas
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import Loader from '../components/other/Loader';
import Button from '../components/ui/Button';

const Trabajos = () => {
  const { currentUser } = useAuth();
  const { trabajos, cargando, borrarTrabajo, turnos } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Estados para modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trabajoAEliminar, setTrabajoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  
  // Estados para funcionalidad de compartir
  const [compartiendoTrabajo, setCompartiendoTrabajo] = useState({});
  const [mensajesCompartir, setMensajesCompartir] = useState({});
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => {
    let timer;
    
    if (cargando) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cargando]);
  
  // Funciones para manejar modales
  const abrirModalNuevoTrabajo = () => {
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  };
  
  const abrirModalEditarTrabajo = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  };
  
  // Funciones para manejar eliminación
  const iniciarEliminacion = (trabajo) => {
    setTrabajoAEliminar(trabajo);
    setShowDeleteModal(true);
  };
  
  const cancelarEliminacion = () => {
    setShowDeleteModal(false);
    setTrabajoAEliminar(null);
  };
  
  const confirmarEliminacion = async () => {
    if (!trabajoAEliminar) return;
    
    setEliminando(true);
    try {
      await borrarTrabajo(trabajoAEliminar.id);
      setShowDeleteModal(false);
      setTrabajoAEliminar(null);
    } catch (error) {
      // Error ya manejado en el contexto
    } finally {
      setEliminando(false);
    }
  };
  
  // Función para manejar el compartir trabajo
  const handleCompartirTrabajo = async (trabajo) => {
    try {
      setCompartiendoTrabajo(prev => ({ ...prev, [trabajo.id]: true }));
      setMensajesCompartir(prev => ({ ...prev, [trabajo.id]: '' }));
      
      // Usar la función de compartir nativo
      await compartirTrabajoNativo(currentUser.uid, trabajo);
      
      setMensajesCompartir(prev => ({ 
        ...prev, 
        [trabajo.id]: 'Trabajo compartido exitosamente' 
      }));
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMensajesCompartir(prev => ({ ...prev, [trabajo.id]: '' }));
      }, 3000);
      
    } catch (error) {
      setMensajesCompartir(prev => ({ 
        ...prev, 
        [trabajo.id]: 'Error al compartir trabajo' 
      }));
      setTimeout(() => {
        setMensajesCompartir(prev => ({ ...prev, [trabajo.id]: '' }));
      }, 3000);
    } finally {
      setCompartiendoTrabajo(prev => ({ ...prev, [trabajo.id]: false }));
    }
  };
  
  // Función para contar turnos de un trabajo
  const contarTurnosTrabajo = (trabajoId) => {
    return turnos.filter(turno => turno.trabajoId === trabajoId).length;
  };
  
  // Generar detalles para el modal de eliminación
  const generarDetallesTrabajo = (trabajo) => {
    if (!trabajo) return [];
    
    const turnosAsociados = contarTurnosTrabajo(trabajo.id);
    
    return [
      trabajo.nombre,
      `Tarifa base: $${trabajo.tarifaBase?.toFixed(2) || '0.00'}`,
      turnosAsociados > 0 ? `${turnosAsociados} ${turnosAsociados === 1 ? 'turno registrado' : 'turnos registrados'}` : 'Sin turnos registrados'
    ];
  };
  
  // Generar advertencia si hay turnos asociados
  const generarAdvertencia = (trabajo) => {
    if (!trabajo) return null;
    
    const turnosAsociados = contarTurnosTrabajo(trabajo.id);
    
    if (turnosAsociados > 0) {
      return `Este trabajo tiene ${turnosAsociados} ${turnosAsociados === 1 ? 'turno asociado' : 'turnos asociados'}. Al eliminarlo, también se ${turnosAsociados === 1 ? 'eliminará este turno' : 'eliminarán estos turnos'}.`;
    }
    
    return null;
  };
  
  if (showLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis Trabajos</h2>
        <Button 
          onClick={abrirModalNuevoTrabajo}
          className="flex items-center gap-2"
          icon={PlusCircle}
        >
          Nuevo Trabajo
        </Button>
      </div>
      
      {/* Contenido principal */}
      {trabajos.length > 0 ? (
        <div className="space-y-4">
          {trabajos.map(trabajo => {
            const turnosCount = contarTurnosTrabajo(trabajo.id);
            const estaCompartiendo = compartiendoTrabajo[trabajo.id] || false;
            const mensajeCompartir = mensajesCompartir[trabajo.id] || '';
            
            return (
              <div 
                key={trabajo.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border-l-4"
                style={{ borderLeftColor: trabajo.color }}
              >
                <div className="p-4">
                  {/* Encabezado con nombre y acciones */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: trabajo.color }}
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {trabajo.nombre}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {turnosCount} {turnosCount === 1 ? 'turno registrado' : 'turnos registrados'}
                      </p>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => abrirModalEditarTrabajo(trabajo)}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        icon={Edit}
                      />
                      <Button
                        onClick={() => handleCompartirTrabajo(trabajo)}
                        disabled={estaCompartiendo}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                        icon={Share2}
                      />
                      <Button
                        onClick={() => iniciarEliminacion(trabajo)}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                        icon={Trash2}
                      />
                    </div>
                  </div>
                  
                  {/* Mensaje de compartir */}
                  {mensajeCompartir && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">{mensajeCompartir}</p>
                    </div>
                  )}
                  
                  {/* Información de tarifas */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tarifa base:</span>
                        <span className="font-medium">${trabajo.tarifaBase?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Diurno:</span>
                        <span className="font-medium">${trabajo.tarifas?.diurno?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tarde:</span>
                        <span className="font-medium">${trabajo.tarifas?.tarde?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Noche:</span>
                        <span className="font-medium">${trabajo.tarifas?.noche?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sábado:</span>
                        <span className="font-medium">${trabajo.tarifas?.sabado?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Domingo:</span>
                        <span className="font-medium">${trabajo.tarifas?.domingo?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Descripción si existe */}
                  {trabajo.descripcion && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{trabajo.descripcion}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay trabajos registrados</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primer trabajo</p>
          <Button 
            onClick={abrirModalNuevoTrabajo}
            className="flex items-center gap-2"
            icon={PlusCircle}
          >
            Agregar primer trabajo
          </Button>
        </div>
      )}
      
      {/* Modal para agregar/editar trabajo */}
      <ModalTrabajo 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        trabajo={trabajoSeleccionado} 
      />
      
      {/* Modal de confirmación para eliminar */}
      <AlertaEliminacion
        visible={showDeleteModal}
        onCancel={cancelarEliminacion}
        onConfirm={confirmarEliminacion}
        eliminando={eliminando}
        tipo="trabajo"
        detalles={generarDetallesTrabajo(trabajoAEliminar)}
        advertencia={generarAdvertencia(trabajoAEliminar)}
      />
    </div>
  );
};

export default Trabajos;