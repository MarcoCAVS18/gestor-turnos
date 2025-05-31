// src/pages/Turnos.jsx - REFACTORIZADO

import React, { useState } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

import TarjetaTurno from '../components/cards/TarjetaTurno';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ListSection from '../components/sections/ListSection';
import Card from '../components/ui/Card';
import { useDeleteManager } from '../hooks/useDeleteManager';
import { useUtils } from '../hooks/useUtils';

const DaySection = ({ fecha, turnos, trabajos, onEditTurno, onDeleteTurno }) => {
  const { formatDate, isToday, isYesterday } = useUtils();
  const { coloresTemáticos } = useApp();
  
  const formatearFechaEncabezado = (fechaStr) => {
    if (isToday(fechaStr)) return 'Hoy';
    if (isYesterday(fechaStr)) return 'Ayer';
    return formatDate(fechaStr, 'full');
  };
  
  const obtenerTrabajo = (trabajoId) => {
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  };

  return (
    <Card className="overflow-hidden" padding="none">
      {/* Header del día */}
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
      
      {/* Lista de turnos */}
      <div className="p-4 space-y-3">
        {turnos.map(turno => {
          const trabajo = obtenerTrabajo(turno.trabajoId);
          if (!trabajo) return null;
          
          return (
            <TarjetaTurno
              key={turno.id}
              turno={turno}
              trabajo={trabajo}
              onEdit={onEditTurno}
              onDelete={onDeleteTurno}
            />
          );
        })}
      </div>
    </Card>
  );
};

const Turnos = () => {
  const { turnosPorFecha, cargando, borrarTurno, trabajos } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  
  const { sortByDateDesc } = useUtils();
  const deleteManager = useDeleteManager(borrarTurno);
  
  // Funciones para modales
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
  
  // Obtener trabajo de un turno
  const obtenerTrabajo = (trabajoId) => {
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  };
  
  // Generar detalles para eliminación
  const generarDetallesTurno = (turno) => {
    if (!turno) return [];
    
    const trabajo = obtenerTrabajo(turno.trabajoId);
    
    return [
      trabajo?.nombre || 'Trabajo no encontrado',
      new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }),
      `${turno.horaInicio} - ${turno.horaFin}`
    ];
  };

  // Ordenar fechas y crear componentes de día
  const diasOrdenados = Object.entries(turnosPorFecha)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA));

  return (
    <LoadingWrapper loading={cargando}>
      <ListSection
        title="Mis Turnos"
        action={{
          label: 'Nuevo Turno',
          icon: PlusCircle,
          onClick: abrirModalNuevoTurno
        }}
        items={diasOrdenados}
        emptyState={{
          icon: Calendar,
          title: 'No hay turnos registrados',
          description: 'Comienza agregando tu primer turno',
          action: {
            label: 'Agregar primer turno',
            icon: PlusCircle,
            onClick: abrirModalNuevoTurno
          }
        }}
        renderItem={([fecha, turnosDia]) => (
          <DaySection
            key={fecha}
            fecha={fecha}
            turnos={turnosDia}
            trabajos={trabajos}
            onEditTurno={abrirModalEditarTurno}
            onDeleteTurno={deleteManager.startDeletion}
          />
        )}
        className="space-y-6"
      />
      
      {/* Modales */}
      <ModalTurno 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        turno={turnoSeleccionado} 
      />
      
      <AlertaEliminacion
        visible={deleteManager.showDeleteModal}
        onCancel={deleteManager.cancelDeletion}
        onConfirm={deleteManager.confirmDeletion}
        eliminando={deleteManager.deleting}
        tipo="turno"
        detalles={generarDetallesTurno(deleteManager.itemToDelete)}
      />
    </LoadingWrapper>
  );
};

export default Turnos;