// src/pages/Trabajos.jsx

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
    coloresTemáticos
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
      console.log('Intentando eliminar trabajo:', { id, tipo });
      
      if (tipo === 'delivery') {
        console.log('Eliminando trabajo delivery...');
        await deleteDeliveryJob(id);
      } else {
        console.log('Eliminando trabajo tradicional...');
        await deleteJob(id);
      }
      
      console.log('Trabajo eliminado exitosamente');
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
    
    console.log('Preparando eliminación de trabajo:', trabajo);
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
      console.log('Confirmando eliminación de:', itemToDelete);
      
      const resultado = await deleteHandler(itemToDelete.id, itemToDelete.tipo);
      
      if (resultado) {
        console.log('Eliminación exitosa');
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
    console.log('Usuario logueado:', currentUser.uid);
    console.log('Trabajos tradicionales:', trabajos.length);
    console.log('Trabajos delivery:', trabajosDelivery.length);
  }, [currentUser, trabajos, trabajosDelivery]);

  return (
    <LoadingWrapper loading={loading}>
      <div className="space-y-6">
        {/* Header que cambia según si hay trabajos */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
            >
              <Briefcase 
                className="w-6 h-6" 
                style={{ color: coloresTemáticos?.base || '#EC4899' }}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Trabajos</h1>
            </div>
          </div>
          {/* Solo mostrar botón en header si hay trabajos */}
          {todosLosTrabajos.length > 0 && (
            <button
              onClick={abrirModalNuevo}
              className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
              style={{ 
                backgroundColor: coloresTemáticos?.base || '#EC4899'
              }}
              onMouseEnter={(e) => {
                if (coloresTemáticos?.dark) {
                  e.target.style.backgroundColor = coloresTemáticos.dark;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
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
              style={{ backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
            >
              <Briefcase 
                className="w-10 h-10" 
                style={{ color: coloresTemáticos?.base || '#EC4899' }}
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
                backgroundColor: coloresTemáticos?.base || '#EC4899'
              }}
              onMouseEnter={(e) => {
                if (coloresTemáticos?.dark) {
                  e.target.style.backgroundColor = coloresTemáticos.dark;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
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