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
    cargando,
    borrarTrabajo,
    borrarTrabajoDelivery
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
      if (tipo === 'delivery') ***REMOVED***
        await borrarTrabajoDelivery(id);
      ***REMOVED*** else ***REMOVED***
        await borrarTrabajo(id);
      ***REMOVED***
      return true;
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error en deleteHandler:', error);
      return false;
    ***REMOVED***
  ***REMOVED***;

  const handleCardDelete = (trabajo) => ***REMOVED***
    if (!trabajo || !trabajo.id) ***REMOVED***
      return;
    ***REMOVED***
    
    setItemToDelete(trabajo);
    setShowDeleteModal(true);
  ***REMOVED***;

  const generarDetallesTrabajo = (trabajo) => ***REMOVED***
    if (!trabajo) ***REMOVED***
      return ***REMOVED******REMOVED***;
    ***REMOVED***
    
    if (trabajo.tipo === 'delivery') ***REMOVED***
      return ***REMOVED***
        Título: trabajo.nombre,
        Plataforma: trabajo.plataforma,
        Vehículo: trabajo.vehiculo,
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      return ***REMOVED***
        Título: trabajo.nombre,
        Tarifa: `$$***REMOVED***trabajo.tarifaBase || 0***REMOVED***`,
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***;

  const handleConfirmDeletion = async () => ***REMOVED***
    if (!itemToDelete) ***REMOVED***
      return;
    ***REMOVED***
    
    try ***REMOVED***
      setIsDeleting(true);
      
      const resultado = await deleteHandler(itemToDelete.id, itemToDelete.tipo);
      
      if (resultado) ***REMOVED***
        setShowDeleteModal(false);
        setItemToDelete(null);
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
    
    console.log('🔑 Usuario autenticado:', currentUser.uid);
    console.log('📊 Cargando trabajos...');
  ***REMOVED***, [currentUser]);

  return (
    <LoadingWrapper cargando=***REMOVED***cargando***REMOVED***>
      <div className="space-y-6">
        ***REMOVED***/* Header que cambia según si hay trabajos */***REMOVED***
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Trabajos</h1>
            </div>
          </div>
          ***REMOVED***/* Solo mostrar botón en header si hay trabajos */***REMOVED***
          ***REMOVED***todosLosTrabajos.length > 0 && (
            <button
              onClick=***REMOVED***abrirModalNuevo***REMOVED***
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </button>
          )***REMOVED***
        </div>

        ***REMOVED***/* Lista de trabajos o estado vacío */***REMOVED***
        ***REMOVED***todosLosTrabajos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay trabajos aún</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Crea tu primer trabajo para empezar a registrar turnos y gestionar tus ingresos.
            </p>
            <button
              onClick=***REMOVED***abrirModalNuevo***REMOVED***
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
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