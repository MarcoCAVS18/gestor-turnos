// src/pages/Trabajos.jsx
import React from 'react';
import { PlusCircle, Briefcase } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useDeleteManager } from '../hooks/useDeleteManager';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import TarjetaDelivery from '../components/cards/TarjetaTrabajoDelivery';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ListSection from '../components/sections/ListSection';

const Trabajos = () => {
  const { trabajos, cargando, borrarTrabajo } = useApp();
  const deleteManager = useDeleteManager(borrarTrabajo);
  
  // Log para depuración
  React.useEffect(() => {
    console.log('Trabajos actuales:', trabajos.map(t => ({ id: t.id, nombre: t.nombre, tipo: t.tipo })));
  }, [trabajos]);
  
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

  // Función para generar detalles del trabajo para eliminación
  const generarDetallesTrabajo = (trabajo) => {
    if (!trabajo) return [];
    const detalles = [trabajo.nombre];
    
    if (trabajo.tipo === 'delivery') {
      detalles.push('Trabajo de Delivery');
      if (trabajo.plataforma) detalles.push(`Plataforma: ${trabajo.plataforma}`);
    } else {
      detalles.push('Trabajo por Horas');
    }
    
    return detalles;
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
        renderItem={(trabajo) => {
          console.log('Renderizando trabajo:', trabajo.id, trabajo.nombre, trabajo.tipo);
          
          // Renderizar tarjeta según tipo de trabajo
          if (trabajo.tipo === 'delivery') {
            return (
              <TarjetaDelivery
                key={trabajo.id}
                trabajo={trabajo}
                onEdit={abrirModalEditar}
                onDelete={deleteManager.startDeletion}
                showActions={true}
              />
            );
          }
          
          // Trabajo tradicional
          return (
            <TarjetaTrabajo
              key={trabajo.id}
              trabajo={trabajo}
              onEdit={abrirModalEditar}
              onDelete={deleteManager.startDeletion}
              showActions={true}
            />
          );
        }}
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
        detalles={generarDetallesTrabajo(deleteManager.itemToDelete)}
      />
    </LoadingWrapper>
  );
};

export default Trabajos;