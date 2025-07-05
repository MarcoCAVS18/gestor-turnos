import React, { useState, useMemo, createRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Calendar, Plus, Briefcase, ArrowRight, Eye } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import DaySection from '../components/sections/DaySection';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import GlassButton from '../components/ui/GlassButton';

const DIAS_POR_PAGINA = 6;

const Turnos = () => {
  const {
    turnosPorFecha, loading, deleteShift, deleteDeliveryShift,
    trabajos, trabajosDelivery, thematicColors
  } = useApp();

  const deleteManager = useDeleteManager(async (turno) => {
    if (turno.tipo === 'delivery') await deleteDeliveryShift(turno.id);
    else await deleteShift(turno.id);
  });

  const { modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal } = useTurnManager();

  const [diasMostrados, setDiasMostrados] = useState(DIAS_POR_PAGINA);
  const [expandiendo, setExpandiendo] = useState(false);

  const todosLosTrabajos = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);

  const diasOrdenados = useMemo(() => {
    return Object.entries(turnosPorFecha).sort(([a], [b]) => new Date(b) - new Date(a));
  }, [turnosPorFecha]);

  const diasParaMostrar = diasOrdenados.slice(0, diasMostrados);
  const hayMasDias = diasOrdenados.length > diasMostrados;
  const diasRestantes = diasOrdenados.length - diasMostrados;
  const hayTurnos = diasOrdenados.length > 0;

  const mostrarMasDias = () => {
    setExpandiendo(true);
    setTimeout(() => {
      setDiasMostrados(prev => Math.min(prev + DIAS_POR_PAGINA, diasOrdenados.length));
      setExpandiendo(false);
    }, 150);
  };

  const mostrarMenos = () => {
    setDiasMostrados(DIAS_POR_PAGINA);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generarDetallesTurno = (turno) => {
    if (!turno) return [];

    const trabajo = todosLosTrabajos.find(t => t.id === turno.trabajoId);

    // Manejar fechas para turnos que cruzan medianoche
    let fechaTexto = '';
    if (turno.fechaInicio && turno.fechaFin && turno.fechaInicio !== turno.fechaFin) {
      // Turno que cruza medianoche
      const fechaInicio = new Date(turno.fechaInicio + 'T00:00:00');
      const fechaFin = new Date(turno.fechaFin + 'T00:00:00');
      const fechaInicioStr = fechaInicio.toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
      const fechaFinStr = fechaFin.toLocaleDateString('es-ES', {
        weekday: 'short', day: 'numeric', month: 'long'
      });
      fechaTexto = `${fechaInicioStr} - ${fechaFinStr}`;
    } else {
      // Turno normal o turno legacy con solo 'fecha'
      const fechaStr = turno.fechaInicio || turno.fecha;
      if (fechaStr) {
        const fecha = new Date(fechaStr + 'T00:00:00');
        fechaTexto = fecha.toLocaleDateString('es-ES', {
          weekday: 'long', day: 'numeric', month: 'long'
        });
      } else {
        fechaTexto = 'Fecha no disponible';
      }
    }

    const detalles = [
      trabajo?.nombre || 'Trabajo no encontrado',
      fechaTexto,
      `${turno.horaInicio} - ${turno.horaFin}`
    ];

    if (turno.tipo === 'delivery') {
      detalles.push(`${turno.numeroPedidos || 0} pedidos`);
    }

    return detalles;
  };

  const handleIrATrabajos = () => { window.location.href = '/trabajos'; };

  const renderEmptyState = () => {
    if (todosLosTrabajos.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(255, 152, 0, 0.1)' }}>
            <Briefcase className="w-10 h-10" style={{ color: thematicColors?.base || '#FF9800' }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Primero necesitas crear un trabajo</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Para poder registrar turnos, primero debes crear al menos un trabajo.</p>
          <button onClick={handleIrATrabajos} className="text-white bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>Crear Trabajo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: thematicColors?.transparent10 }}>
          <Calendar className="w-10 h-10" style={{ color: thematicColors?.base }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay turnos registrados</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">Comienza agregando tu primer turno para empezar a gestionar tus ingresos.</p>
        <button onClick={abrirModalNuevo} className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2" style={{ backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' }} onMouseEnter={(e) => { e.target.style.filter = 'brightness(1.0)'; }} onMouseLeave={(e) => { e.target.style.filter = 'brightness(1.1)'; }}>
          <Plus className="w-4 h-4" />
          <span>Agregar Primer Turno</span>
        </button>
      </div>
    );
  };

  const getHeaderButton = () => {
    if (!hayTurnos || todosLosTrabajos.length === 0) return null;
    return (
      <button onClick={abrirModalNuevo} className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm" style={{ backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' }} onMouseEnter={(e) => { e.target.style.filter = 'brightness(1.0)'; }} onMouseLeave={(e) => { e.target.style.filter = 'brightness(1.1)'; }}>
        <Plus className="w-4 h-4" />
        <span>Nuevo</span>
      </button>
    );
  };

  return (
    <LoadingWrapper loading={loading}>
      <div className="space-y-6">
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: thematicColors?.transparent10 }}>
              <Calendar className="w-6 h-6" style={{ color: thematicColors?.base }} />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Turnos</h1>
              {hayTurnos && diasOrdenados.length > DIAS_POR_PAGINA && (
                <p className="text-sm text-gray-500 -mt-2">Mostrando {Math.min(diasMostrados, diasOrdenados.length)} de {diasOrdenados.length} días</p>
              )}
            </div>
          </div>
          {getHeaderButton()}
        </div>

        {!hayTurnos ? (
          renderEmptyState()
        ) : (
          <div>
            <TransitionGroup component="div" className="space-y-6">
              {diasParaMostrar.map(([fecha, turnosDia]) => {
                const nodeRef = createRef(null);
                return (
                  <CSSTransition key={fecha} timeout={500} classNames="day-section" nodeRef={nodeRef}>
                    <DaySection
                      ref={nodeRef}
                      fecha={fecha}
                      turnos={turnosDia}
                      trabajos={todosLosTrabajos}
                      onEditTurno={abrirModalEditar}
                      onDeleteTurno={deleteManager.startDeletion}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>

            {hayMasDias && (
              <div className="relative flex flex-col items-center pt-4 pb-12">
                <div
                  className="peek-card"
                  style={{ backgroundColor: thematicColors?.transparent5 }}
                />
                <GlassButton
                  onClick={mostrarMasDias}
                  loading={expandiendo}
                  variant="primary"
                  size="lg"
                  icon={Eye}
                  className="relative z-10"
                >
                  Ver {Math.min(DIAS_POR_PAGINA, diasRestantes)} días más
                </GlassButton>
              </div>
            )}

            {!hayMasDias && diasMostrados > DIAS_POR_PAGINA && (
              <div className="flex justify-center py-4">
                <GlassButton onClick={mostrarMenos} variant="secondary" size="md">
                  Mostrar menos
                </GlassButton>
              </div>
            )}
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