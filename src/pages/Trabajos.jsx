// src/pages/Trabajos.jsx - Con espaciado consistente

import React, { useEffect, useMemo } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import TarjetaDelivery from '../components/cards/TarjetaTrabajoDelivery';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';

const Trabajos = () => {
  const {
    trabajos = [], 
    trabajosDelivery = [], 
    loading, // Cambiado de 'cargando' a 'loading'
    deleteJob, // Nombre correcto de la función
    deleteDeliveryJob, // Nombre correcto de la función
    thematicColors
  } = useApp();

  const { currentUser } = useAuth();

  const todosLosTrabajos = useMemo(() => {
    return [...trabajos, ...trabajosDelivery];
  }, [trabajos, trabajosDelivery]);

  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  const deleteHandler = async (id, tipo) => {
    try {
      
      if (tipo === 'delivery') {
        await deleteDeliveryJob(id);
      } else {
        await deleteJob(id);
      }
      
      return true;
    } catch (error) {
      console.error('Error en deleteHandler:', error);
      return false;
    }
  };

  const handleCardDelete = (trabajo) => {
    if (!trabajo || !trabajo.id) {
      console.error('Trabajo inválido para eliminar:', trabajo);
      return;
    }
    
    setItemToDelete(trabajo);
    setShowDeleteModal(true);
  };

  const generarDetallesTrabajo = (trabajo) => {
    if (!trabajo) {
      return [];
    }
    
    const detalles = [trabajo.nombre];
    
    if (trabajo.tipo === 'delivery') {
      if (trabajo.plataforma) detalles.push(`Plataforma: ${trabajo.plataforma}`);
      if (trabajo.vehiculo) detalles.push(`Vehículo: ${trabajo.vehiculo}`);
    } else {
      if (trabajo.tarifaBase) detalles.push(`Tarifa: $${trabajo.tarifaBase}`);
    }
    
    return detalles;
  };

  const handleConfirmDeletion = async () => {
    if (!itemToDelete) {
      console.error('No hay trabajo para eliminar');
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const resultado = await deleteHandler(itemToDelete.id, itemToDelete.tipo);
      
      if (resultado) {
        setShowDeleteModal(false);
        setItemToDelete(null);
      } else {
        console.error('La eliminación falló');
      }
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeletion = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    if (!currentUser) return;
  }, [currentUser, trabajos, trabajosDelivery]);

  return (
    <LoadingWrapper loading={loading}>
      {/* Contenedor principal con espaciado consistente */}
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Header que cambia según si hay trabajos */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
            >
              <Briefcase 
                className="w-6 h-6" 
                style={{ color: thematicColors?.base || '#EC4899' }}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Mis Trabajos</h1>
            </div>
          </div>
          {/* Solo mostrar botón en header si hay trabajos */}
          {todosLosTrabajos.length > 0 && (
            <button
              onClick={abrirModalNuevo}
              className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
              style={{ 
                backgroundColor: thematicColors?.base || '#EC4899'
              }}
              onMouseEnter={(e) => {
                if (thematicColors?.dark) {
                  e.target.style.backgroundColor = thematicColors.dark;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = thematicColors?.base || '#EC4899';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </button>
          )}
        </div>

        {/* Lista de trabajos o estado vacío */}
        {todosLosTrabajos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
            >
              <Briefcase 
                className="w-10 h-10" 
                style={{ color: thematicColors?.base || '#EC4899' }}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay trabajos aún</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Crea tu primer trabajo para empezar a registrar turnos y gestionar tus ingresos.
            </p>
            <button
              onClick={abrirModalNuevo}
              className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 hover:shadow-md"
              style={{ 
                backgroundColor: thematicColors?.base || '#EC4899'
              }}
              onMouseEnter={(e) => {
                if (thematicColors?.dark) {
                  e.target.style.backgroundColor = thematicColors.dark;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = thematicColors?.base || '#EC4899';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Trabajo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {todosLosTrabajos.map((trabajo) => {
              const deleteFunction = (trabajoParam) => {
                handleCardDelete(trabajoParam);
              };

              if (trabajo.tipo === 'delivery') {
                return (
                  <TarjetaDelivery
                    key={trabajo.id}
                    trabajo={trabajo}
                    onEdit={abrirModalEditar}
                    onDelete={deleteFunction}
                    showActions={true}
                  />
                );
              }

              return (
                <TarjetaTrabajo
                  key={trabajo.id}
                  trabajo={trabajo}
                  onEdit={abrirModalEditar}
                  onDelete={deleteFunction}
                  showActions={true}
                />
              );
            })}
          </div>
        )}
      </div>

      <ModalTrabajo
        isOpen={modalAbierto}
        onClose={cerrarModal}
        trabajo={trabajoSeleccionado}
      />

      <AlertaEliminacion
        visible={showDeleteModal}
        onCancel={handleCancelDeletion}
        onConfirm={handleConfirmDeletion}
        eliminando={isDeleting}
        tipo="trabajo"
        detalles={generarDetallesTrabajo(itemToDelete)}
        advertencia={
          itemToDelete?.tipo === 'delivery'
            ? "Se eliminarán también todos los turnos de delivery asociados a este trabajo."
            : "Se eliminarán también todos los turnos asociados a este trabajo."
        }
      />
    </LoadingWrapper>
  );
};

export default Trabajos;