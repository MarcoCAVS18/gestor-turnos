// src/pages/Trabajos.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import TarjetaTrabajo from '../components/TarjetaTrabajo';
import ModalTrabajo from '../components/ModalTrabajo';
import Loader from '../components/Loader';
import DynamicButton from '../components/DynamicButton';
import ***REMOVED*** PlusCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Trabajos = () => ***REMOVED***
  const ***REMOVED*** trabajos, borrarTrabajo, cargando ***REMOVED*** = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
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
  
  const abrirModalNuevoTrabajo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;
  
  const abrirModalEditarTrabajo = (trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  ***REMOVED***;
  
  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
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
        <h2 className="text-xl font-semibold">Mis Trabajos</h2>
        <DynamicButton 
          onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
          className="flex items-center gap-2"
        >
          <PlusCircle size=***REMOVED***20***REMOVED*** />
          <span>Nuevo</span>
        </DynamicButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        ***REMOVED***trabajos.length > 0 ? (
          trabajos.map(trabajo => (
            <TarjetaTrabajo 
              key=***REMOVED***trabajo.id***REMOVED*** 
              trabajo=***REMOVED***trabajo***REMOVED*** 
              abrirModalEditarTrabajo=***REMOVED***abrirModalEditarTrabajo***REMOVED***
              eliminarTrabajo=***REMOVED***borrarTrabajo***REMOVED***
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 mb-4">No hay trabajos registrados</p>
            <DynamicButton 
              onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
              className="flex items-center gap-2"
            >
              <PlusCircle size=***REMOVED***20***REMOVED*** />
              <span>Agregar trabajo</span>
            </DynamicButton>
          </div>
        )***REMOVED***
      </div>
      
      <ModalTrabajo 
        visible=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        trabajoSeleccionado=***REMOVED***trabajoSeleccionado***REMOVED*** 
      />
    </div>
  );
***REMOVED***;

export default Trabajos;