import React from 'react';
import { useTrabajos } from '../hooks/useTrabajos';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShareMessages from '../components/work/ShareMessages';
import WorkHeader from '../components/work/WorkHeader';
import WorkEmptyState from '../components/work/WorkEmptyState';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import TarjetaDelivery from '../components/cards/TarjetaTrabajoDelivery';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import { generateWorkDetails } from '../utils/workUtils';

const Trabajos = () => {
  const {
    loading,
    todosLosTrabajos,
    modalAbierto,
    trabajoSeleccionado,
    thematicColors,
    sharing,
    messages,
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal,
    handleShareWork,
    deleteManager
  } = useTrabajos();

  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <LoadingWrapper loading={loading}>
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Mensajes de compartir */}
        <ShareMessages messages={messages} />

        {/* Header */}
        <WorkHeader 
          todosLosTrabajos={todosLosTrabajos}
          thematicColors={thematicColors}
          onNuevoTrabajo={abrirModalNuevo}
        />

        {/* Contenido principal */}
        {!tieneTrabajos ? (
          <WorkEmptyState 
            thematicColors={thematicColors}
            onNuevoTrabajo={abrirModalNuevo}
          />
        ) : (
          <div className="space-y-4">
            {todosLosTrabajos.map((trabajo) => {
              const isSharing = sharing[trabajo.id] || false;

              if (trabajo.tipo === 'delivery') {
                return (
                  <TarjetaDelivery
                    key={trabajo.id}
                    trabajo={trabajo}
                    onEdit={abrirModalEditar}
                    onDelete={deleteManager.startDeletion}
                    onShare={handleShareWork}
                    showActions={true}
                    isSharing={isSharing}
                  />
                );
              }

              return (
                <TarjetaTrabajo
                  key={trabajo.id}
                  trabajo={trabajo}
                  onEdit={abrirModalEditar}
                  onDelete={deleteManager.startDeletion}
                  onShare={handleShareWork}
                  showActions={true}
                  isSharing={isSharing}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modales */}
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
        detalles={generateWorkDetails(deleteManager.itemToDelete)}
        advertencia={
          deleteManager.itemToDelete?.tipo === 'delivery'
            ? "Se eliminarán también todos los turnos de delivery asociados a este trabajo."
            : "Se eliminarán también todos los turnos asociados a este trabajo."
        }
      />
    </LoadingWrapper>
  );
};

export default Trabajos;