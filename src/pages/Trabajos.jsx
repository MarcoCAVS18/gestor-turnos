// src/pages/Trabajos.jsx

import React from 'react';
import { PlusCircle, Briefcase } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useDeleteManager } from '../hooks/useDeleteManager';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ListSection from '../components/sections/ListSection';

const Trabajos = () => {
  const { trabajos, cargando, borrarTrabajo } = useApp();
  const deleteManager = useDeleteManager(borrarTrabajo);
  
  // Estado para modales
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);

  // Funciones para manejar modales
  const abrirModalNuevo = () => {
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  };

  return (
    <LoadingWrapper loading={cargando}>
      <ListSection
        title="Mis Trabajos"
        action={{
          label: 'Nuevo Trabajo',
          icon: PlusCircle,
          onClick: abrirModalNuevo
        }}
        items={trabajos}
        emptyState={{
          icon: Briefcase,
          title: 'No hay trabajos registrados',
          description: 'Comienza agregando tu primer trabajo',
          action: {
            label: 'Agregar primer trabajo',
            icon: PlusCircle,
            onClick: abrirModalNuevo
          }
        }}
        renderItem={(trabajo) => (
          <TarjetaTrabajo
            key={trabajo.id}
            trabajo={trabajo}
            onEdit={abrirModalEditar}
            onDelete={deleteManager.startDeletion}
            showActions={true}
          />
        )}
        className="space-y-4"
      />

      <ModalTrabajo 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        trabajo={trabajoSeleccionado} 
      />
      
      <AlertaEliminacion
        visible={deleteManager.showDeleteModal}
        onCancel={deleteManager.cancelDeletion}
        onConfirm={deleteManager.confirmDeletion}
        eliminando={deleteManager.deleting}
        tipo="trabajo"
        detalles={deleteManager.itemToDelete ? [deleteManager.itemToDelete.nombre] : []}
      />
    </LoadingWrapper>
  );
};

export default Trabajos;