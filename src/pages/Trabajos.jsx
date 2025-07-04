// src/pages/Trabajos.jsx

import React, ***REMOVED*** useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import TarjetaTrabajo from '../components/cards/TarjetaTrabajo';
import TarjetaDelivery from '../components/cards/TarjetaTrabajoDelivery';
import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';

const Trabajos = () => ***REMOVED***
  const ***REMOVED***
    trabajos = [], 
    trabajosDelivery = [], 
    loading, // Cambiado de 'cargando' a 'loading'
    deleteJob, // Nombre correcto de la función
    deleteDeliveryJob, // Nombre correcto de la función
    coloresTemáticos
  ***REMOVED*** = useApp();

  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();

  const todosLosTrabajos = useMemo(() => ***REMOVED***
    return [...trabajos, ...trabajosDelivery];
  ***REMOVED***, [trabajos, trabajosDelivery]);

  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [modalAbierto, setModalAbierto] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const abrirModalNuevo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;

  const abrirModalEditar = (trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  ***REMOVED***;

  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***;

  const deleteHandler = async (id, tipo) => ***REMOVED***
    try ***REMOVED***
      console.log('Intentando eliminar trabajo:', ***REMOVED*** id, tipo ***REMOVED***);
      
      if (tipo === 'delivery') ***REMOVED***
        console.log('Eliminando trabajo delivery...');
        await deleteDeliveryJob(id);
      ***REMOVED*** else ***REMOVED***
        console.log('Eliminando trabajo tradicional...');
        await deleteJob(id);
      ***REMOVED***
      
      console.log('Trabajo eliminado exitosamente');
      return true;
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error en deleteHandler:', error);
      return false;
    ***REMOVED***
  ***REMOVED***;

  const handleCardDelete = (trabajo) => ***REMOVED***
    if (!trabajo || !trabajo.id) ***REMOVED***
      console.error('Trabajo inválido para eliminar:', trabajo);
      return;
    ***REMOVED***
    
    console.log('Preparando eliminación de trabajo:', trabajo);
    setItemToDelete(trabajo);
    setShowDeleteModal(true);
  ***REMOVED***;

  const generarDetallesTrabajo = (trabajo) => ***REMOVED***
    if (!trabajo) ***REMOVED***
      return [];
    ***REMOVED***
    
    const detalles = [trabajo.nombre];
    
    if (trabajo.tipo === 'delivery') ***REMOVED***
      if (trabajo.plataforma) detalles.push(`Plataforma: $***REMOVED***trabajo.plataforma***REMOVED***`);
      if (trabajo.vehiculo) detalles.push(`Vehículo: $***REMOVED***trabajo.vehiculo***REMOVED***`);
    ***REMOVED*** else ***REMOVED***
      if (trabajo.tarifaBase) detalles.push(`Tarifa: $$***REMOVED***trabajo.tarifaBase***REMOVED***`);
    ***REMOVED***
    
    return detalles;
  ***REMOVED***;

  const handleConfirmDeletion = async () => ***REMOVED***
    if (!itemToDelete) ***REMOVED***
      console.error('No hay trabajo para eliminar');
      return;
    ***REMOVED***
    
    try ***REMOVED***
      setIsDeleting(true);
      console.log('Confirmando eliminación de:', itemToDelete);
      
      const resultado = await deleteHandler(itemToDelete.id, itemToDelete.tipo);
      
      if (resultado) ***REMOVED***
        console.log('Eliminación exitosa');
        setShowDeleteModal(false);
        setItemToDelete(null);
      ***REMOVED*** else ***REMOVED***
        console.error('La eliminación falló');
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error en confirmación:', error);
    ***REMOVED*** finally ***REMOVED***
      setIsDeleting(false);
    ***REMOVED***
  ***REMOVED***;

  const handleCancelDeletion = () => ***REMOVED***
    setShowDeleteModal(false);
    setItemToDelete(null);
  ***REMOVED***;

  useEffect(() => ***REMOVED***
    if (!currentUser) return;
    console.log('Usuario logueado:', currentUser.uid);
    console.log('Trabajos tradicionales:', trabajos.length);
    console.log('Trabajos delivery:', trabajosDelivery.length);
  ***REMOVED***, [currentUser, trabajos, trabajosDelivery]);

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="space-y-6">
        ***REMOVED***/* Header que cambia según si hay trabajos */***REMOVED***
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
            >
              <Briefcase 
                className="w-6 h-6" 
                style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Trabajos</h1>
            </div>
          </div>
          ***REMOVED***/* Solo mostrar botón en header si hay trabajos */***REMOVED***
          ***REMOVED***todosLosTrabajos.length > 0 && (
            <button
              onClick=***REMOVED***abrirModalNuevo***REMOVED***
              className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
              style=***REMOVED******REMOVED*** 
                backgroundColor: coloresTemáticos?.base || '#EC4899'
              ***REMOVED******REMOVED***
              onMouseEnter=***REMOVED***(e) => ***REMOVED***
                if (coloresTemáticos?.dark) ***REMOVED***
                  e.target.style.backgroundColor = coloresTemáticos.dark;
                ***REMOVED***
              ***REMOVED******REMOVED***
              onMouseLeave=***REMOVED***(e) => ***REMOVED***
                e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
              ***REMOVED******REMOVED***
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </button>
          )***REMOVED***
        </div>

        ***REMOVED***/* Lista de trabajos o estado vacío */***REMOVED***
        ***REMOVED***todosLosTrabajos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
              style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
            >
              <Briefcase 
                className="w-10 h-10" 
                style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay trabajos aún</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Crea tu primer trabajo para empezar a registrar turnos y gestionar tus ingresos.
            </p>
            <button
              onClick=***REMOVED***abrirModalNuevo***REMOVED***
              className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 hover:shadow-md"
              style=***REMOVED******REMOVED*** 
                backgroundColor: coloresTemáticos?.base || '#EC4899'
              ***REMOVED******REMOVED***
              onMouseEnter=***REMOVED***(e) => ***REMOVED***
                if (coloresTemáticos?.dark) ***REMOVED***
                  e.target.style.backgroundColor = coloresTemáticos.dark;
                ***REMOVED***
              ***REMOVED******REMOVED***
              onMouseLeave=***REMOVED***(e) => ***REMOVED***
                e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
              ***REMOVED******REMOVED***
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Trabajo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            ***REMOVED***todosLosTrabajos.map((trabajo) => ***REMOVED***
              const deleteFunction = (trabajoParam) => ***REMOVED***
                handleCardDelete(trabajoParam);
              ***REMOVED***;

              if (trabajo.tipo === 'delivery') ***REMOVED***
                return (
                  <TarjetaDelivery
                    key=***REMOVED***trabajo.id***REMOVED***
                    trabajo=***REMOVED***trabajo***REMOVED***
                    onEdit=***REMOVED***abrirModalEditar***REMOVED***
                    onDelete=***REMOVED***deleteFunction***REMOVED***
                    showActions=***REMOVED***true***REMOVED***
                  />
                );
              ***REMOVED***

              return (
                <TarjetaTrabajo
                  key=***REMOVED***trabajo.id***REMOVED***
                  trabajo=***REMOVED***trabajo***REMOVED***
                  onEdit=***REMOVED***abrirModalEditar***REMOVED***
                  onDelete=***REMOVED***deleteFunction***REMOVED***
                  showActions=***REMOVED***true***REMOVED***
                />
              );
            ***REMOVED***)***REMOVED***
          </div>
        )***REMOVED***
      </div>

      <ModalTrabajo
        isOpen=***REMOVED***modalAbierto***REMOVED***
        onClose=***REMOVED***cerrarModal***REMOVED***
        trabajo=***REMOVED***trabajoSeleccionado***REMOVED***
      />

      <AlertaEliminacion
        visible=***REMOVED***showDeleteModal***REMOVED***
        onCancel=***REMOVED***handleCancelDeletion***REMOVED***
        onConfirm=***REMOVED***handleConfirmDeletion***REMOVED***
        eliminando=***REMOVED***isDeleting***REMOVED***
        tipo="trabajo"
        detalles=***REMOVED***generarDetallesTrabajo(itemToDelete)***REMOVED***
        advertencia=***REMOVED***
          itemToDelete?.tipo === 'delivery'
            ? "Se eliminarán también todos los turnos de delivery asociados a este trabajo."
            : "Se eliminarán también todos los turnos asociados a este trabajo."
        ***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Trabajos;