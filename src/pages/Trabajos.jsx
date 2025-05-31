// src/pages/Trabajos.jsx - REFACTORIZADO

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** PlusCircle, Briefcase, Edit, Trash2, Share2 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** compartirTrabajoNativo ***REMOVED*** from '../services/shareService';

import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import Loader from '../components/other/Loader';
import Button from '../components/ui/Button';
import ListSection from '../components/sections/ListSection';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';

const TrabajoCard = (***REMOVED*** trabajo, turnos, onEdit, onShare, onDelete, shareState ***REMOVED***) => ***REMOVED***
  const turnosCount = turnos.filter(turno => turno.trabajoId === trabajo.id).length;
  const ***REMOVED*** sharing, message ***REMOVED*** = shareState;
  
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden border-l-4"
      style=***REMOVED******REMOVED*** borderLeftColor: trabajo.color ***REMOVED******REMOVED***
    >
      <div className="p-4">
        ***REMOVED***/* Header */***REMOVED***
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
              />
              <h3 className="text-lg font-semibold text-gray-800">
                ***REMOVED***trabajo.nombre***REMOVED***
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              ***REMOVED***turnosCount***REMOVED*** ***REMOVED***turnosCount === 1 ? 'turno registrado' : 'turnos registrados'***REMOVED***
            </p>
          </div>
          
          ***REMOVED***/* Actions */***REMOVED***
          <div className="flex gap-2">
            <Button
              onClick=***REMOVED***() => onEdit(trabajo)***REMOVED***
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-blue-600"
              icon=***REMOVED***Edit***REMOVED***
            />
            <Button
              onClick=***REMOVED***() => onShare(trabajo)***REMOVED***
              disabled=***REMOVED***sharing***REMOVED***
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-blue-600"
              icon=***REMOVED***Share2***REMOVED***
            />
            <Button
              onClick=***REMOVED***() => onDelete(trabajo)***REMOVED***
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-red-600"
              icon=***REMOVED***Trash2***REMOVED***
            />
          </div>
        </div>
        
        ***REMOVED***/* Share message */***REMOVED***
        ***REMOVED***message && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">***REMOVED***message***REMOVED***</p>
          </div>
        )***REMOVED***
        
        ***REMOVED***/* Tarifas */***REMOVED***
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tarifa base:</span>
              <span className="font-medium">$***REMOVED***trabajo.tarifaBase?.toFixed(2) || '0.00'***REMOVED***</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Diurno:</span>
              <span className="font-medium">$***REMOVED***trabajo.tarifas?.diurno?.toFixed(2) || '0.00'***REMOVED***</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tarde:</span>
              <span className="font-medium">$***REMOVED***trabajo.tarifas?.tarde?.toFixed(2) || '0.00'***REMOVED***</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Noche:</span>
              <span className="font-medium">$***REMOVED***trabajo.tarifas?.noche?.toFixed(2) || '0.00'***REMOVED***</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sábado:</span>
              <span className="font-medium">$***REMOVED***trabajo.tarifas?.sabado?.toFixed(2) || '0.00'***REMOVED***</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Domingo:</span>
              <span className="font-medium">$***REMOVED***trabajo.tarifas?.domingo?.toFixed(2) || '0.00'***REMOVED***</span>
            </div>
          </div>
        </div>
        
        ***REMOVED***/* Descripción */***REMOVED***
        ***REMOVED***trabajo.descripcion && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">***REMOVED***trabajo.descripcion***REMOVED***</p>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

const Trabajos = () => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** trabajos, cargando, borrarTrabajo, turnos ***REMOVED*** = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Estados para compartir
  const [compartiendoTrabajo, setCompartiendoTrabajo] = useState(***REMOVED******REMOVED***);
  const [mensajesCompartir, setMensajesCompartir] = useState(***REMOVED******REMOVED***);
  
  // Hook para manejo de eliminación
  const deleteManager = useDeleteManager(borrarTrabajo);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => ***REMOVED***
    let timer;
    if (cargando) ***REMOVED***
      setShowLoading(true);
    ***REMOVED*** else ***REMOVED***
      timer = setTimeout(() => setShowLoading(false), 2000);
    ***REMOVED***
    return () => timer && clearTimeout(timer);
  ***REMOVED***, [cargando]);
  
  // Funciones para modales
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
  
  // Función para compartir
  const handleCompartirTrabajo = async (trabajo) => ***REMOVED***
    try ***REMOVED***
      setCompartiendoTrabajo(prev => (***REMOVED*** ...prev, [trabajo.id]: true ***REMOVED***));
      setMensajesCompartir(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));
      
      await compartirTrabajoNativo(currentUser.uid, trabajo);
      
      setMensajesCompartir(prev => (***REMOVED*** 
        ...prev, 
        [trabajo.id]: 'Trabajo compartido exitosamente' 
      ***REMOVED***));
      
      setTimeout(() => ***REMOVED***
        setMensajesCompartir(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));
      ***REMOVED***, 3000);
      
    ***REMOVED*** catch (error) ***REMOVED***
      setMensajesCompartir(prev => (***REMOVED*** 
        ...prev, 
        [trabajo.id]: 'Error al compartir trabajo' 
      ***REMOVED***));
      setTimeout(() => ***REMOVED***
        setMensajesCompartir(prev => (***REMOVED*** ...prev, [trabajo.id]: '' ***REMOVED***));
      ***REMOVED***, 3000);
    ***REMOVED*** finally ***REMOVED***
      setCompartiendoTrabajo(prev => (***REMOVED*** ...prev, [trabajo.id]: false ***REMOVED***));
    ***REMOVED***
  ***REMOVED***;
  
  // Generar detalles para eliminación
  const generarDetallesTrabajo = (trabajo) => ***REMOVED***
    if (!trabajo) return [];
    
    const turnosAsociados = turnos.filter(turno => turno.trabajoId === trabajo.id).length;
    
    return [
      trabajo.nombre,
      `Tarifa base: $$***REMOVED***trabajo.tarifaBase?.toFixed(2) || '0.00'***REMOVED***`,
      turnosAsociados > 0 ? `$***REMOVED***turnosAsociados***REMOVED*** $***REMOVED***turnosAsociados === 1 ? 'turno registrado' : 'turnos registrados'***REMOVED***` : 'Sin turnos registrados'
    ];
  ***REMOVED***;
  
  const generarAdvertencia = (trabajo) => ***REMOVED***
    if (!trabajo) return null;
    
    const turnosAsociados = turnos.filter(turno => turno.trabajoId === trabajo.id).length;
    
    if (turnosAsociados > 0) ***REMOVED***
      return `Este trabajo tiene $***REMOVED***turnosAsociados***REMOVED*** $***REMOVED***turnosAsociados === 1 ? 'turno asociado' : 'turnos asociados'***REMOVED***. Al eliminarlo, también se $***REMOVED***turnosAsociados === 1 ? 'eliminará este turno' : 'eliminarán estos turnos'***REMOVED***.`;
    ***REMOVED***
    
    return null;
  ***REMOVED***;

  if (showLoading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  return (
    <>
      <ListSection
        title="Mis Trabajos"
        action=***REMOVED******REMOVED***
          label: 'Nuevo Trabajo',
          icon: PlusCircle,
          onClick: abrirModalNuevoTrabajo
        ***REMOVED******REMOVED***
        items=***REMOVED***trabajos***REMOVED***
        emptyState=***REMOVED******REMOVED***
          icon: Briefcase,
          title: 'No hay trabajos registrados',
          description: 'Comienza agregando tu primer trabajo',
          action: ***REMOVED***
            label: 'Agregar primer trabajo',
            icon: PlusCircle,
            onClick: abrirModalNuevoTrabajo
          ***REMOVED***
        ***REMOVED******REMOVED***
        renderItem=***REMOVED***(trabajo) => (
          <TrabajoCard
            key=***REMOVED***trabajo.id***REMOVED***
            trabajo=***REMOVED***trabajo***REMOVED***
            turnos=***REMOVED***turnos***REMOVED***
            onEdit=***REMOVED***abrirModalEditarTrabajo***REMOVED***
            onShare=***REMOVED***handleCompartirTrabajo***REMOVED***
            onDelete=***REMOVED***deleteManager.startDeletion***REMOVED***
            shareState=***REMOVED******REMOVED***
              sharing: compartiendoTrabajo[trabajo.id] || false,
              message: mensajesCompartir[trabajo.id] || ''
            ***REMOVED******REMOVED***
          />
        )***REMOVED***
      />
      
      ***REMOVED***/* Modales */***REMOVED***
      <ModalTrabajo 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        trabajo=***REMOVED***trabajoSeleccionado***REMOVED*** 
      />
      
      <AlertaEliminacion
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***deleteManager.cancelDeletion***REMOVED***
        onConfirm=***REMOVED***deleteManager.confirmDeletion***REMOVED***
        eliminando=***REMOVED***deleteManager.deleting***REMOVED***
        tipo="trabajo"
        detalles=***REMOVED***generarDetallesTrabajo(deleteManager.itemToDelete)***REMOVED***
        advertencia=***REMOVED***generarAdvertencia(deleteManager.itemToDelete)***REMOVED***
      />
    </>
  );
***REMOVED***;

export default Trabajos;