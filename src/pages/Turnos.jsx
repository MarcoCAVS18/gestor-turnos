// src/pages/Turnos.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import ***REMOVED*** useShiftsData ***REMOVED*** from '../hooks/useShiftsData';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShiftsHeader from '../components/shifts/ShiftsHeader';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import ShiftsList from '../components/shifts/ShiftsList';
import ShiftsNavigation from '../components/shifts/ShiftsNavigation';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import ***REMOVED*** generateShiftDetails ***REMOVED*** from '../utils/shiftDetailsUtils';

const DAYS_PER_PAGE = 6;

const Turnos = () => ***REMOVED***
  const ***REMOVED*** loading, deleteShift, deleteDeliveryShift, thematicColors ***REMOVED*** = useApp();
  const [daysShown, setDaysShown] = useState(DAYS_PER_PAGE);
  const [expanding, setExpanding] = useState(false);

  // Hooks especializados
  const ***REMOVED*** shiftsData ***REMOVED*** = useShiftsData();
  const ***REMOVED*** modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal ***REMOVED*** = useTurnManager();
  
  // Función de eliminación con logs detallados
  const handleDeleteTurno = async (turno) => ***REMOVED***
    try ***REMOVED***
      if (turno.tipo === 'delivery') ***REMOVED***
        await deleteDeliveryShift(turno.id);
      ***REMOVED*** else ***REMOVED***
        await deleteShift(turno.id);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

  const deleteManager = useDeleteManager(handleDeleteTurno);

  const ***REMOVED***
    sortedDays,
    daysToShow,
    hasMoreDays,
    remainingDays,
    hasShifts,
    allJobs
  ***REMOVED*** = shiftsData(daysShown);

  const handleShowMore = () => ***REMOVED***
    setExpanding(true);
    setTimeout(() => ***REMOVED***
      setDaysShown(prev => Math.min(prev + DAYS_PER_PAGE, sortedDays.length));
      setExpanding(false);
    ***REMOVED***, 150);
  ***REMOVED***;

  const handleShowLess = () => ***REMOVED***
    setDaysShown(DAYS_PER_PAGE);
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
  ***REMOVED***;

  const testDelete = (turno) => ***REMOVED***
    deleteManager.startDeletion(turno);
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="space-y-6">
        ***REMOVED***/* Header con título y botón de acción */***REMOVED***
        <ShiftsHeader 
          hasShifts=***REMOVED***hasShifts***REMOVED***
          allJobs=***REMOVED***allJobs***REMOVED***
          sortedDays=***REMOVED***sortedDays***REMOVED***
          daysShown=***REMOVED***daysShown***REMOVED***
          onNewShift=***REMOVED***abrirModalNuevo***REMOVED***
          thematicColors=***REMOVED***thematicColors***REMOVED***
          daysPerPage=***REMOVED***DAYS_PER_PAGE***REMOVED***
        />

        ***REMOVED***/* Contenido principal */***REMOVED***
        ***REMOVED***!hasShifts ? (
          <ShiftsEmptyState 
            allJobs=***REMOVED***allJobs***REMOVED***
            onNewShift=***REMOVED***abrirModalNuevo***REMOVED***
            thematicColors=***REMOVED***thematicColors***REMOVED***
          />
        ) : (
          <>
            ***REMOVED***/* Lista de turnos */***REMOVED***
            <ShiftsList 
              daysToShow=***REMOVED***daysToShow***REMOVED***
              allJobs=***REMOVED***allJobs***REMOVED***
              onEditShift=***REMOVED***abrirModalEditar***REMOVED***
              onDeleteShift=***REMOVED***testDelete***REMOVED***
            />

            ***REMOVED***/* Navegación (mostrar más/menos) */***REMOVED***
            <ShiftsNavigation 
              hasMoreDays=***REMOVED***hasMoreDays***REMOVED***
              daysShown=***REMOVED***daysShown***REMOVED***
              daysPerPage=***REMOVED***DAYS_PER_PAGE***REMOVED***
              remainingDays=***REMOVED***remainingDays***REMOVED***
              expanding=***REMOVED***expanding***REMOVED***
              onShowMore=***REMOVED***handleShowMore***REMOVED***
              onShowLess=***REMOVED***handleShowLess***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
            />
          </>
        )***REMOVED***
      </div>

      ***REMOVED***/* Modales */***REMOVED***
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        turno=***REMOVED***turnoSeleccionado***REMOVED*** 
      />

      <AlertaEliminacion
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***() => ***REMOVED***
          deleteManager.cancelDeletion();
        ***REMOVED******REMOVED***
        onConfirm=***REMOVED***() => ***REMOVED***
          deleteManager.confirmDeletion();
        ***REMOVED******REMOVED***
        eliminando=***REMOVED***deleteManager.deleting***REMOVED***
        tipo="turno"
        detalles=***REMOVED***generateShiftDetails(deleteManager.itemToDelete, allJobs)***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Turnos;