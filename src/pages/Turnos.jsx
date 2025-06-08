// src/pages/Turnos.jsx

import React from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import DaySection from '../components/sections/DaySection';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ListSection from '../components/sections/ListSection';

const Turnos = () => {
  const { turnosPorFecha, cargando, borrarTurno, trabajos } = useApp();
  const deleteManager = useDeleteManager(borrarTurno);
  const { modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal } = useTurnManager();

  // Ordenar fechas y crear componentes de día
  const diasOrdenados = Object.entries(turnosPorFecha)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA));

  const generarDetallesTurno = (turno) => {
    if (!turno) return [];
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    return [
      trabajo?.nombre || 'Trabajo no encontrado',
      new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long'
      }),
      `${turno.horaInicio} - ${turno.horaFin}`
    ];
  };

  return (
    <LoadingWrapper loading={cargando}>
      <ListSection
        title="Mis Turnos"
        action={{ label: 'Nuevo Turno', icon: PlusCircle, onClick: abrirModalNuevo }}
        items={diasOrdenados}
        emptyState={{
          icon: Calendar,
          title: 'No hay turnos registrados',
          description: 'Comienza agregando tu primer turno',
          action: { label: 'Agregar primer turno', icon: PlusCircle, onClick: abrirModalNuevo }
        }}
        renderItem={([fecha, turnosDia]) => (
          <DaySection
            key={fecha}
            fecha={fecha}
            turnos={turnosDia}
            trabajos={trabajos}
            onEditTurno={abrirModalEditar}
            onDeleteTurno={deleteManager.startDeletion}
          />
        )}
        className="space-y-6"
      />
      
      <ModalTurno isOpen={modalAbierto} onClose={cerrarModal} turno={turnoSeleccionado} />
      
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