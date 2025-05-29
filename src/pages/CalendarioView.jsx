// src/pages/CalendarioView.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** PlusCircle ***REMOVED*** from 'lucide-react';

// Nuevas importaciones
import Calendario from '../components/calendar/Calendario';
import ResumenDia from '../components/summaries/ResumenDia';
import ModalTurno from '../components/modals/ModalTurno';
import Button from '../components/ui/Button';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const CalendarioView = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha ***REMOVED*** = useApp();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTurnoFecha, setNuevoTurnoFecha] = useState(null);
  
  // Función para convertir fecha local a ISO
  const fechaLocalAISO = (fecha) => ***REMOVED***
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
  ***REMOVED***;
  
  const seleccionarDia = (fecha) => ***REMOVED***
    const fechaStr = fechaLocalAISO(fecha);
    setFechaSeleccionada(fechaStr);
  ***REMOVED***;
  
  const abrirModalNuevoTurno = (fecha) => ***REMOVED***
    const fechaISO = fechaLocalAISO(fecha);
    setNuevoTurnoFecha(fechaISO);
    setModalAbierto(true);
  ***REMOVED***;
  
  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setNuevoTurnoFecha(null);
  ***REMOVED***;
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  // Animaciones para los elementos
  const calendarVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  const detailsVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: 20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5, delay: 0.2 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  return (
    <div className="px-4 py-6">
      <motion.h2 
        className="text-xl font-semibold mb-4"
        initial=***REMOVED******REMOVED*** opacity: 0, x: -20 ***REMOVED******REMOVED***
        animate=***REMOVED******REMOVED*** opacity: 1, x: 0 ***REMOVED******REMOVED***
        transition=***REMOVED******REMOVED*** duration: 0.3 ***REMOVED******REMOVED***
      >
        Calendario de Turnos
      </motion.h2>
      
      <motion.div
        variants=***REMOVED***calendarVariants***REMOVED***
        initial="hidden"
        animate="visible"
      >
        <Calendario onDiaSeleccionado=***REMOVED***seleccionarDia***REMOVED*** />
      </motion.div>
      
      ***REMOVED***fechaSeleccionada && (
        <motion.div 
          className="mt-6"
          variants=***REMOVED***detailsVariants***REMOVED***
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              Turnos del día seleccionado
            </h3>
            <motion.div>
              <Button
                onClick=***REMOVED***() => abrirModalNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
                size="sm"
                className="flex items-center gap-1"
                icon=***REMOVED***PlusCircle***REMOVED***
              >
                Nuevo
              </Button>
            </motion.div>
          </div>
          
          ***REMOVED***turnosSeleccionados.length > 0 ? (
            <ResumenDia 
              fecha=***REMOVED***fechaSeleccionada***REMOVED*** 
              turnos=***REMOVED***turnosSeleccionados***REMOVED*** 
            />
          ) : (
            <motion.div 
              className="text-center py-6 bg-white rounded-xl shadow-md"
              initial=***REMOVED******REMOVED*** opacity: 0 ***REMOVED******REMOVED***
              animate=***REMOVED******REMOVED*** opacity: 1 ***REMOVED******REMOVED***
              transition=***REMOVED******REMOVED*** delay: 0.3 ***REMOVED******REMOVED***
            >
              <p className="text-gray-500 mb-4">No hay turnos para esta fecha</p>
              <Button
                onClick=***REMOVED***() => abrirModalNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
                className="flex items-center gap-2"
                icon=***REMOVED***PlusCircle***REMOVED***
              >
                Agregar turno
              </Button>
            </motion.div>
          )***REMOVED***
        </motion.div>
      )***REMOVED***
      
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        fechaInicial=***REMOVED***nuevoTurnoFecha***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default CalendarioView;