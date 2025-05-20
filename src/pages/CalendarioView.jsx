// src/pages/CalendarioView.jsx - Mejorado
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import Calendario from '../components/Calendario';
import ResumenDia from '../components/ResumenDia';
import ModalTurno from '../components/ModalTurno';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** PlusCircle ***REMOVED*** from 'lucide-react';

const CalendarioView = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha ***REMOVED*** = useApp();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTurnoFecha, setNuevoTurnoFecha] = useState(null);
  
  const seleccionarDia = (fecha) => ***REMOVED***
    const fechaStr = fecha.toISOString().split('T')[0];
    setFechaSeleccionada(fechaStr);
  ***REMOVED***;
  
  const abrirModalNuevoTurno = (fecha) => ***REMOVED***
    setNuevoTurnoFecha(fecha.toISOString().split('T')[0]);
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
            <motion.button 
              onClick=***REMOVED***() => abrirModalNuevoTurno(new Date(fechaSeleccionada))***REMOVED***
              className="bg-pink-500 text-white px-3 py-1 rounded-lg shadow-md flex items-center gap-1"
              whileHover=***REMOVED******REMOVED*** scale: 1.05 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.95 ***REMOVED******REMOVED***
            >
              <PlusCircle size=***REMOVED***16***REMOVED*** />
              <span>Nuevo</span>
            </motion.button>
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
              <p className="text-gray-500">No hay turnos para esta fecha</p>
              <motion.button 
                onClick=***REMOVED***() => abrirModalNuevoTurno(new Date(fechaSeleccionada))***REMOVED***
                className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 mx-auto"
                whileHover=***REMOVED******REMOVED*** scale: 1.05 ***REMOVED******REMOVED***
                whileTap=***REMOVED******REMOVED*** scale: 0.95 ***REMOVED******REMOVED***
              >
                <PlusCircle size=***REMOVED***20***REMOVED*** />
                <span>Agregar turno</span>
              </motion.button>
            </motion.div>
          )***REMOVED***
        </motion.div>
      )***REMOVED***
      
      <ModalTurno 
        visible=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        fechaInicial=***REMOVED***nuevoTurnoFecha***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default CalendarioView;