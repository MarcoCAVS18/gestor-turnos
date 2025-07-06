// src/pages/Turnos.jsx

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import { useShiftsData } from '../hooks/useShiftsData';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShiftsHeader from '../components/shifts/ShiftsHeader';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import ShiftsList from '../components/shifts/ShiftsList';
import ShiftsNavigation from '../components/shifts/ShiftsNavigation';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import { generateShiftDetails } from '../utils/shiftDetailsUtils';

const DAYS_PER_PAGE = 6;

const Turnos = () => {
  const { loading, deleteShift, deleteDeliveryShift, thematicColors } = useApp();
  const [daysShown, setDaysShown] = useState(DAYS_PER_PAGE);
  const [expanding, setExpanding] = useState(false);

  // Hooks especializados
  const { shiftsData } = useShiftsData();
  const { modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal } = useTurnManager();
  
  // Función de eliminación con logs detallados
  const handleDeleteTurno = async (turno) => {
    try {
      if (turno.tipo === 'delivery') {
        await deleteDeliveryShift(turno.id);
      } else {
        await deleteShift(turno.id);
      }
    } catch (error) {
    }
  };

  const deleteManager = useDeleteManager(handleDeleteTurno);

  const {
    sortedDays,
    daysToShow,
    hasMoreDays,
    remainingDays,
    hasShifts,
    allJobs
  } = shiftsData(daysShown);

  const handleShowMore = () => {
    setExpanding(true);
    setTimeout(() => {
      setDaysShown(prev => Math.min(prev + DAYS_PER_PAGE, sortedDays.length));
      setExpanding(false);
    }, 150);
  };

  const handleShowLess = () => {
    setDaysShown(DAYS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testDelete = (turno) => {
    deleteManager.startDeletion(turno);
  };

  return (
    <LoadingWrapper loading={loading}>
      <div className="space-y-6">
        {/* Header con título y botón de acción */}
        <ShiftsHeader 
          hasShifts={hasShifts}
          allJobs={allJobs}
          sortedDays={sortedDays}
          daysShown={daysShown}
          onNewShift={abrirModalNuevo}
          thematicColors={thematicColors}
          daysPerPage={DAYS_PER_PAGE}
        />

        {/* Contenido principal */}
        {!hasShifts ? (
          <ShiftsEmptyState 
            allJobs={allJobs}
            onNewShift={abrirModalNuevo}
            thematicColors={thematicColors}
          />
        ) : (
          <>
            {/* Lista de turnos */}
            <ShiftsList 
              daysToShow={daysToShow}
              allJobs={allJobs}
              onEditShift={abrirModalEditar}
              onDeleteShift={testDelete}
            />

            {/* Navegación (mostrar más/menos) */}
            <ShiftsNavigation 
              hasMoreDays={hasMoreDays}
              daysShown={daysShown}
              daysPerPage={DAYS_PER_PAGE}
              remainingDays={remainingDays}
              expanding={expanding}
              onShowMore={handleShowMore}
              onShowLess={handleShowLess}
              thematicColors={thematicColors}
            />
          </>
        )}
      </div>

      {/* Modales */}
      <ModalTurno 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        turno={turnoSeleccionado} 
      />

      <AlertaEliminacion
        visible={deleteManager.showDeleteModal}
        onCancel={() => {
          deleteManager.cancelDeletion();
        }}
        onConfirm={() => {
          deleteManager.confirmDeletion();
        }}
        eliminando={deleteManager.deleting}
        tipo="turno"
        detalles={generateShiftDetails(deleteManager.itemToDelete, allJobs)}
      />
    </LoadingWrapper>
  );
};

export default Turnos;