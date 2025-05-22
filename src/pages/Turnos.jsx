// src/pages/Turnos.jsx - PÁGINA COMPLETA CON EDICIÓN Y ELIMINACIÓN

import React, { useState, useEffect } from 'react';
import TarjetaTurno from '../components/TarjetaTurno';
import ModalTurno from '../components/ModalTurno';
import Loader from '../components/Loader';
import DynamicButton from '../components/DynamicButton';
import { PlusCircle, Calendar, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Turnos = () => {
  const { turnosPorFecha, cargando, borrarTurno, coloresTemáticos, calcularPago, trabajos } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Estados para modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  
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
  const abrirModalNuevoTurno = () => {
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  };
  
  const abrirModalEditarTurno = (turno) => {
    setTurnoSeleccionado(turno);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  };
  
  // Funciones para manejar eliminación
  const iniciarEliminacion = (turno) => {
    setTurnoAEliminar(turno);
    setShowDeleteModal(true);
  };
  
  const cancelarEliminacion = () => {
    setShowDeleteModal(false);
    setTurnoAEliminar(null);
  };
  
  const confirmarEliminacion = async () => {
    if (!turnoAEliminar) return;
    
    setEliminando(true);
    try {
      await borrarTurno(turnoAEliminar.id);
      setShowDeleteModal(false);
      setTurnoAEliminar(null);
    } catch (error) {
      // Error ya manejado en el contexto
    } finally {
      setEliminando(false);
    }
  };
  
  // Función para obtener el trabajo de un turno
  const obtenerTrabajo = (trabajoId) => {
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  };
  
  // Función para formatear fecha como encabezado
  const formatearFechaEncabezado = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    const fechaLocal = fecha.toDateString();
    const hoyLocal = hoy.toDateString();
    const ayerLocal = ayer.toDateString();
    
    if (fechaLocal === hoyLocal) {
      return 'Hoy';
    } else if (fechaLocal === ayerLocal) {
      return 'Ayer';
    } else {
      return fecha.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: fecha.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  
  // Calcular total por día
  const calcularTotalDia = (turnosDia) => {
    return turnosDia.reduce((total, turno) => {
      const trabajo = obtenerTrabajo(turno.trabajoId);
      if (!trabajo) return total;
      
      const { totalConDescuento } = calcularPago(turno);
      return total + totalConDescuento;
    }, 0);
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
        <h2 className="text-xl font-semibold">Mis Turnos</h2>
        <DynamicButton 
          onClick={abrirModalNuevoTurno}
          className="flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Nuevo Turno</span>
        </DynamicButton>
      </div>
      
      {/* Contenido principal */}
      {Object.entries(turnosPorFecha).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(turnosPorFecha)
            .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
            .map(([fecha, turnosDia]) => {
              // eslint-disable-next-line 
              const totalDia = calcularTotalDia(turnosDia);
              
              return (
                <div key={fecha} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Encabezado del día */}
                  <div 
                    className="px-4 py-3 border-b flex justify-between items-center"
                    style={{ backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
                  >
                    <div className="flex items-center">
                      <Calendar size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
                      <h3 className="font-semibold text-gray-800 capitalize">
                        {formatearFechaEncabezado(fecha)}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">
                        ({new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })})
                      </span>
                    </div>
                  </div>
                  
                  {/* Lista de turnos del día */}
                  <div className="p-4 space-y-3">
                    {turnosDia.map(turno => {
                      const trabajo = obtenerTrabajo(turno.trabajoId);
                      if (!trabajo) return null;
                      
                      return (
                        <TarjetaTurno
                          key={turno.id}
                          turno={turno}
                          trabajo={trabajo}
                          onEdit={abrirModalEditarTurno}
                          onDelete={iniciarEliminacion}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay turnos registrados</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primer turno</p>
          <DynamicButton 
            onClick={abrirModalNuevoTurno}
            className="flex items-center gap-2"
          >
            <PlusCircle size={20} />
            <span>Agregar primer turno</span>
          </DynamicButton>
        </div>
      )}
      
      {/* Modal para agregar/editar turno */}
      <ModalTurno 
        visible={modalAbierto} 
        onClose={cerrarModal} 
        turnoSeleccionado={turnoSeleccionado} 
      />
      
      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && turnoAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="p-6">
              {/* Icono de advertencia */}
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              
              {/* Título */}
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                ¿Eliminar turno?
              </h3>
              
              {/* Información del turno */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="text-sm space-y-1">
                  <p className="font-medium text-gray-900">
                    {obtenerTrabajo(turnoAEliminar.trabajoId)?.nombre}
                  </p>
                  <p className="text-gray-600">
                    {new Date(turnoAEliminar.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                  <p className="text-gray-600">
                    {turnoAEliminar.horaInicio} - {turnoAEliminar.horaFin}
                  </p>
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex gap-3">
                <DynamicButton
                  onClick={cancelarEliminacion}
                  variant="outline"
                  className="flex-1"
                  disabled={eliminando}
                >
                  Cancelar
                </DynamicButton>
                <button
                  onClick={confirmarEliminacion}
                  disabled={eliminando}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {eliminando ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;