import React, ***REMOVED*** useState, useMemo, createRef ***REMOVED*** from 'react';
import ***REMOVED*** TransitionGroup, CSSTransition ***REMOVED*** from 'react-transition-group';
import ***REMOVED*** Calendar, Plus, Briefcase, ArrowRight, Eye ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import DaySection from '../components/sections/DaySection';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import GlassButton from '../components/ui/GlassButton';

const DIAS_POR_PAGINA = 6;

const Turnos = () => ***REMOVED***
  const ***REMOVED*** 
    turnosPorFecha, loading, deleteShift, deleteDeliveryShift,
    trabajos, trabajosDelivery, thematicColors
  ***REMOVED*** = useApp();
  
  const deleteManager = useDeleteManager(async (turno) => ***REMOVED***
    if (turno.tipo === 'delivery') await deleteDeliveryShift(turno.id);
    else await deleteShift(turno.id);
  ***REMOVED***);
  
  const ***REMOVED*** modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal ***REMOVED*** = useTurnManager();
  
  const [diasMostrados, setDiasMostrados] = useState(DIAS_POR_PAGINA);
  const [expandiendo, setExpandiendo] = useState(false);

  const todosLosTrabajos = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);
  
  const diasOrdenados = useMemo(() => ***REMOVED***
    return Object.entries(turnosPorFecha).sort(([a], [b]) => new Date(b) - new Date(a));
  ***REMOVED***, [turnosPorFecha]);

  const diasParaMostrar = diasOrdenados.slice(0, diasMostrados);
  const hayMasDias = diasOrdenados.length > diasMostrados;
  const diasRestantes = diasOrdenados.length - diasMostrados;
  const hayTurnos = diasOrdenados.length > 0;

  const mostrarMasDias = () => ***REMOVED***
    setExpandiendo(true);
    setTimeout(() => ***REMOVED***
      setDiasMostrados(prev => Math.min(prev + DIAS_POR_PAGINA, diasOrdenados.length));
      setExpandiendo(false);
    ***REMOVED***, 150);
  ***REMOVED***;

  const mostrarMenos = () => ***REMOVED***
    setDiasMostrados(DIAS_POR_PAGINA);
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
  ***REMOVED***;

  const generarDetallesTurno = (turno) => ***REMOVED***
    if (!turno) return [];
    const trabajo = todosLosTrabajos.find(t => t.id === turno.trabajoId);
    const fecha = new Date(turno.fecha + 'T00:00:00');
    const detalles = [
      trabajo?.nombre || 'Trabajo no encontrado',
      fecha.toLocaleDateString('es-ES', ***REMOVED*** weekday: 'long', day: 'numeric', month: 'long' ***REMOVED***),
      `$***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***`
    ];
    if (turno.tipo === 'delivery') detalles.push(`$***REMOVED***turno.numeroPedidos || 0***REMOVED*** pedidos`);
    return detalles;
  ***REMOVED***;

  const handleIrATrabajos = () => ***REMOVED*** window.location.href = '/trabajos'; ***REMOVED***;

  const renderEmptyState = () => ***REMOVED***
    if (todosLosTrabajos.length === 0) ***REMOVED***
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(255, 152, 0, 0.1)' ***REMOVED******REMOVED***>
            <Briefcase className="w-10 h-10" style=***REMOVED******REMOVED*** color: thematicColors?.base || '#FF9800' ***REMOVED******REMOVED*** />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Primero necesitas crear un trabajo</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Para poder registrar turnos, primero debes crear al menos un trabajo.</p>
          <button onClick=***REMOVED***handleIrATrabajos***REMOVED*** className="text-white bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>Crear Trabajo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    ***REMOVED***
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 ***REMOVED******REMOVED***>
          <Calendar className="w-10 h-10" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***/>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay turnos registrados</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">Comienza agregando tu primer turno para empezar a gestionar tus ingresos.</p>
        <button onClick=***REMOVED***abrirModalNuevo***REMOVED*** className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' ***REMOVED******REMOVED*** onMouseEnter=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.0)'; ***REMOVED******REMOVED*** onMouseLeave=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.1)'; ***REMOVED******REMOVED***>
          <Plus className="w-4 h-4" />
          <span>Agregar Primer Turno</span>
        </button>
      </div>
    );
  ***REMOVED***;

  const getHeaderButton = () => ***REMOVED***
    if (!hayTurnos || todosLosTrabajos.length === 0) return null;
    return (
      <button onClick=***REMOVED***abrirModalNuevo***REMOVED*** className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' ***REMOVED******REMOVED*** onMouseEnter=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.0)'; ***REMOVED******REMOVED*** onMouseLeave=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.1)'; ***REMOVED******REMOVED***>
        <Plus className="w-4 h-4" />
        <span>Nuevo</span>
      </button>
    );
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="space-y-6">
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 ***REMOVED******REMOVED***>
              <Calendar className="w-6 h-6" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Turnos</h1>
              ***REMOVED***hayTurnos && diasOrdenados.length > DIAS_POR_PAGINA && (
                <p className="text-sm text-gray-500 -mt-2">Mostrando ***REMOVED***Math.min(diasMostrados, diasOrdenados.length)***REMOVED*** de ***REMOVED***diasOrdenados.length***REMOVED*** días</p>
              )***REMOVED***
            </div>
          </div>
          ***REMOVED***getHeaderButton()***REMOVED***
        </div>

        ***REMOVED***!hayTurnos ? (
          renderEmptyState()
        ) : (
          <div>
            <TransitionGroup component="div" className="space-y-6">
              ***REMOVED***diasParaMostrar.map(([fecha, turnosDia]) => ***REMOVED***
                const nodeRef = createRef(null);
                return (
                  <CSSTransition key=***REMOVED***fecha***REMOVED*** timeout=***REMOVED***500***REMOVED*** classNames="day-section" nodeRef=***REMOVED***nodeRef***REMOVED***>
                    <DaySection
                      ref=***REMOVED***nodeRef***REMOVED***
                      fecha=***REMOVED***fecha***REMOVED***
                      turnos=***REMOVED***turnosDia***REMOVED***
                      trabajos=***REMOVED***todosLosTrabajos***REMOVED***
                      onEditTurno=***REMOVED***abrirModalEditar***REMOVED***
                      onDeleteTurno=***REMOVED***deleteManager.startDeletion***REMOVED***
                    />
                  </CSSTransition>
                );
              ***REMOVED***)***REMOVED***
            </TransitionGroup>
            
            ***REMOVED***hayMasDias && (
              <div className="relative flex flex-col items-center pt-4 pb-12">
                <div 
                  className="peek-card"
                  style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 ***REMOVED******REMOVED***
                />
                <GlassButton 
                  onClick=***REMOVED***mostrarMasDias***REMOVED*** 
                  loading=***REMOVED***expandiendo***REMOVED*** 
                  variant="primary" 
                  size="lg" 
                  icon=***REMOVED***Eye***REMOVED***
                  className="relative z-10" 
                >
                  Ver ***REMOVED***Math.min(DIAS_POR_PAGINA, diasRestantes)***REMOVED*** días más
                </GlassButton>
              </div>
            )***REMOVED***
            
            ***REMOVED***!hayMasDias && diasMostrados > DIAS_POR_PAGINA && (
              <div className="flex justify-center py-4">
                <GlassButton onClick=***REMOVED***mostrarMenos***REMOVED*** variant="secondary" size="md">
                  Mostrar menos
                </GlassButton>
              </div>
            )***REMOVED***
          </div>
        )***REMOVED***
      </div>
      
      <ModalTurno isOpen=***REMOVED***modalAbierto***REMOVED*** onClose=***REMOVED***cerrarModal***REMOVED*** turno=***REMOVED***turnoSeleccionado***REMOVED*** />
      
      <AlertaEliminacion
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***deleteManager.cancelDeletion***REMOVED***
        onConfirm=***REMOVED***deleteManager.confirmDeletion***REMOVED***
        eliminando=***REMOVED***deleteManager.deleting***REMOVED***
        tipo="turno"
        detalles=***REMOVED***generarDetallesTurno(deleteManager.itemToDelete)***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Turnos;