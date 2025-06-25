import { Calendar, Plus, Briefcase, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import DaySection from '../components/sections/DaySection';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';

const Turnos = () => {
  const { turnosPorFecha, cargando, borrarTurno, trabajos, trabajosDelivery } = useApp();
  const deleteManager = useDeleteManager(borrarTurno);
  const { modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal } = useTurnManager();

  // Combinar todos los trabajos
  const todosLosTrabajos = [...trabajos, ...trabajosDelivery];
  
  // Ordenar fechas y crear componentes de día
  const diasOrdenados = Object.entries(turnosPorFecha)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA));

  const hayTurnos = diasOrdenados.length > 0;

  const generarDetallesTurno = (turno) => {
    if (!turno) return [];
    
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    const fecha = new Date(turno.fecha + 'T00:00:00');
    const detalles = [
      trabajo?.nombre || 'Trabajo no encontrado',
      fecha.toLocaleDateString('es-ES', {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long'
      }),
      `${turno.horaInicio} - ${turno.horaFin}`
    ];
    
    // Agregar detalles específicos según el tipo
    if (turno.tipo === 'delivery') {
      detalles.push('Turno de Delivery');
      if (turno.numeroPedidos) {
        detalles.push(`${turno.numeroPedidos} pedidos completados`);
      }
    }
    
    return detalles;
  };

  const handleIrATrabajos = () => {
    window.location.href = '/trabajos';
  };

  const renderEmptyState = () => {
    if (todosLosTrabajos.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="p-4 bg-orange-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Primero necesitas crear un trabajo</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Para poder registrar turnos, primero debes crear al menos un trabajo con sus tarifas correspondientes.
          </p>
          <button
            onClick={handleIrATrabajos}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Crear Trabajo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay turnos registrados</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Comienza agregando tu primer turno para empezar a gestionar tus ingresos.
        </p>
        <button
          onClick={abrirModalNuevo}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Primer Turno</span>
        </button>
      </div>
    );
  };

  const getHeaderButton = () => {
    if (!hayTurnos) return null;

    if (todosLosTrabajos.length === 0) {
      return (
        <button
          onClick={handleIrATrabajos}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Briefcase className="w-4 h-4" />
          <span>Crear Trabajo Primero</span>
        </button>
      );
    }

    return (
      <button
        onClick={abrirModalNuevo}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo</span>
      </button>
    );
  };

  return (
    <LoadingWrapper cargando={cargando}>
      <div className="space-y-6">
        {/* Header que cambia según si hay turnos */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Turnos</h1>
            </div>
          </div>
          {/* Solo mostrar botón en header si hay turnos */}
          {getHeaderButton()}
        </div>

        {/* Lista de turnos o estado vacío */}
        {!hayTurnos ? (
          renderEmptyState()
        ) : (
          <div className="space-y-6">
            {diasOrdenados.map(([fecha, turnosDia]) => (
              <DaySection
                key={fecha}
                fecha={fecha}
                turnos={turnosDia}
                trabajos={trabajos}
                onEditTurno={abrirModalEditar}
                onDeleteTurno={deleteManager.startDeletion}
              />
            ))}
          </div>
        )}
      </div>
      
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