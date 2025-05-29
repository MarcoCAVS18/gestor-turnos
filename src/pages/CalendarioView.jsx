// src/pages/CalendarioView.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

// Nuevas importaciones
import Calendario from '../components/calendar/Calendario';
import ResumenDia from '../components/summaries/ResumenDia';
import ModalTurno from '../components/modals/ModalTurno';
import Button from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';

const CalendarioView = () => {
  const { turnosPorFecha } = useApp();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTurnoFecha, setNuevoTurnoFecha] = useState(null);
  
  // Función para convertir fecha local a ISO
  const fechaLocalAISO = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const seleccionarDia = (fecha) => {
    const fechaStr = fechaLocalAISO(fecha);
    setFechaSeleccionada(fechaStr);
  };
  
  const abrirModalNuevoTurno = (fecha) => {
    const fechaISO = fechaLocalAISO(fecha);
    setNuevoTurnoFecha(fechaISO);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setNuevoTurnoFecha(null);
  };
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  // Animaciones para los elementos
  const calendarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  return (
    <div className="px-4 py-6">
      <motion.h2 
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Calendario de Turnos
      </motion.h2>
      
      <motion.div
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
      >
        <Calendario onDiaSeleccionado={seleccionarDia} />
      </motion.div>
      
      {fechaSeleccionada && (
        <motion.div 
          className="mt-6"
          variants={detailsVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              Turnos del día seleccionado
            </h3>
            <motion.div>
              <Button
                onClick={() => abrirModalNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))}
                size="sm"
                className="flex items-center gap-1"
                icon={PlusCircle}
              >
                Nuevo
              </Button>
            </motion.div>
          </div>
          
          {turnosSeleccionados.length > 0 ? (
            <ResumenDia 
              fecha={fechaSeleccionada} 
              turnos={turnosSeleccionados} 
            />
          ) : (
            <motion.div 
              className="text-center py-6 bg-white rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-500 mb-4">No hay turnos para esta fecha</p>
              <Button
                onClick={() => abrirModalNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))}
                className="flex items-center gap-2"
                icon={PlusCircle}
              >
                Agregar turno
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
      
      <ModalTurno 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        fechaInicial={nuevoTurnoFecha}
      />
    </div>
  );
};

export default CalendarioView;