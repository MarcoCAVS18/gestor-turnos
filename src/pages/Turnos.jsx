// src/pages/Turnos.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** PlusCircle, Calendar, AlertTriangle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

// Nuevas importaciones estructuradas
import TarjetaTurno from '../components/cards/TarjetaTurno';
import ModalTurno from '../components/modals/ModalTurno';
import Loader from '../components/other/Loader';
import Button from '../components/ui/Button';

const Turnos = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, cargando, borrarTurno, coloresTemáticos, calcularPago, trabajos ***REMOVED*** = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Estados para modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => ***REMOVED***
    let timer;
    
    if (cargando) ***REMOVED***
      setShowLoading(true);
    ***REMOVED*** else ***REMOVED***
      timer = setTimeout(() => ***REMOVED***
        setShowLoading(false);
      ***REMOVED***, 2000);
    ***REMOVED***
    
    return () => ***REMOVED***
      if (timer) clearTimeout(timer);
    ***REMOVED***;
  ***REMOVED***, [cargando]);
  
  // Funciones para manejar modales
  const abrirModalNuevoTurno = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;
  
  const abrirModalEditarTurno = (turno) => ***REMOVED***
    setTurnoSeleccionado(turno);
    setModalAbierto(true);
  ***REMOVED***;
  
  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  ***REMOVED***;
  
  // Funciones para manejar eliminación
  const iniciarEliminacion = (turno) => ***REMOVED***
    setTurnoAEliminar(turno);
    setShowDeleteModal(true);
  ***REMOVED***;
  
  const cancelarEliminacion = () => ***REMOVED***
    setShowDeleteModal(false);
    setTurnoAEliminar(null);
  ***REMOVED***;
  
  const confirmarEliminacion = async () => ***REMOVED***
    if (!turnoAEliminar) return;
    
    setEliminando(true);
    try ***REMOVED***
      await borrarTurno(turnoAEliminar.id);
      setShowDeleteModal(false);
      setTurnoAEliminar(null);
    ***REMOVED*** catch (error) ***REMOVED***
      // Error ya manejado en el contexto
    ***REMOVED*** finally ***REMOVED***
      setEliminando(false);
    ***REMOVED***
  ***REMOVED***;
  
  // Función para obtener el trabajo de un turno
  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  ***REMOVED***;
  
  // Función para formatear fecha como encabezado
  const formatearFechaEncabezado = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    const fechaLocal = fecha.toDateString();
    const hoyLocal = hoy.toDateString();
    const ayerLocal = ayer.toDateString();
    
    if (fechaLocal === hoyLocal) ***REMOVED***
      return 'Hoy';
    ***REMOVED*** else if (fechaLocal === ayerLocal) ***REMOVED***
      return 'Ayer';
    ***REMOVED*** else ***REMOVED***
      return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: fecha.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  
  // Calcular total por día
  const calcularTotalDia = (turnosDia) => ***REMOVED***
    return turnosDia.reduce((total, turno) => ***REMOVED***
      const trabajo = obtenerTrabajo(turno.trabajoId);
      if (!trabajo) return total;
      
      const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
      return total + totalConDescuento;
    ***REMOVED***, 0);
  ***REMOVED***;
  
  if (showLoading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mis Turnos</h2>
        <Button 
          onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
          className="flex items-center gap-2"
          icon=***REMOVED***PlusCircle***REMOVED***
        >
          Nuevo Turno
        </Button>
      </div>
      
      ***REMOVED***/* Contenido principal */***REMOVED***
      ***REMOVED***Object.entries(turnosPorFecha).length > 0 ? (
        <div className="space-y-6">
          ***REMOVED***Object.entries(turnosPorFecha)
            .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
            .map(([fecha, turnosDia]) => ***REMOVED***
              // eslint-disable-next-line 
              const totalDia = calcularTotalDia(turnosDia);
              
              return (
                <div key=***REMOVED***fecha***REMOVED*** className="bg-white rounded-xl shadow-md overflow-hidden">
                  ***REMOVED***/* Encabezado del día */***REMOVED***
                  <div 
                    className="px-4 py-3 border-b flex justify-between items-center"
                    style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
                  >
                    <div className="flex items-center">
                      <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
                      <h3 className="font-semibold text-gray-800 capitalize">
                        ***REMOVED***formatearFechaEncabezado(fecha)***REMOVED***
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">
                        (***REMOVED***new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED*** 
                          day: '2-digit', 
                          month: '2-digit' 
                        ***REMOVED***)***REMOVED***)
                      </span>
                    </div>
                  </div>
                  
                  ***REMOVED***/* Lista de turnos del día */***REMOVED***
                  <div className="p-4 space-y-3">
                    ***REMOVED***turnosDia.map(turno => ***REMOVED***
                      const trabajo = obtenerTrabajo(turno.trabajoId);
                      if (!trabajo) return null;
                      
                      return (
                        <TarjetaTurno
                          key=***REMOVED***turno.id***REMOVED***
                          turno=***REMOVED***turno***REMOVED***
                          trabajo=***REMOVED***trabajo***REMOVED***
                          onEdit=***REMOVED***abrirModalEditarTurno***REMOVED***
                          onDelete=***REMOVED***iniciarEliminacion***REMOVED***
                        />
                      );
                    ***REMOVED***)***REMOVED***
                  </div>
                </div>
              );
            ***REMOVED***)***REMOVED***
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Calendar size=***REMOVED***48***REMOVED*** className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay turnos registrados</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primer turno</p>
          <Button 
            onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
            className="flex items-center gap-2"
            icon=***REMOVED***PlusCircle***REMOVED***
          >
            Agregar primer turno
          </Button>
        </div>
      )***REMOVED***
      
      ***REMOVED***/* Modal para agregar/editar turno */***REMOVED***
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        turno=***REMOVED***turnoSeleccionado***REMOVED*** 
      />
      
      ***REMOVED***/* Modal de confirmación para eliminar */***REMOVED***
      ***REMOVED***showDeleteModal && turnoAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="p-6">
              ***REMOVED***/* Icono de advertencia */***REMOVED***
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle size=***REMOVED***24***REMOVED*** className="text-red-600" />
              </div>
              
              ***REMOVED***/* Título */***REMOVED***
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                ¿Eliminar turno?
              </h3>
              
              ***REMOVED***/* Información del turno */***REMOVED***
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="text-sm space-y-1">
                  <p className="font-medium text-gray-900">
                    ***REMOVED***obtenerTrabajo(turnoAEliminar.trabajoId)?.nombre***REMOVED***
                  </p>
                  <p className="text-gray-600">
                    ***REMOVED***new Date(turnoAEliminar.fecha + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED***
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    ***REMOVED***)***REMOVED***
                  </p>
                  <p className="text-gray-600">
                    ***REMOVED***turnoAEliminar.horaInicio***REMOVED*** - ***REMOVED***turnoAEliminar.horaFin***REMOVED***
                  </p>
                </div>
              </div>
              
              ***REMOVED***/* Botones */***REMOVED***
              <div className="flex gap-3">
                <Button
                  onClick=***REMOVED***cancelarEliminacion***REMOVED***
                  variant="outline"
                  className="flex-1"
                  disabled=***REMOVED***eliminando***REMOVED***
                >
                  Cancelar
                </Button>
                <Button
                  onClick=***REMOVED***confirmarEliminacion***REMOVED***
                  variant="danger"
                  className="flex-1"
                  loading=***REMOVED***eliminando***REMOVED***
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default Turnos;