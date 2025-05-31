// src/pages/Trabajos.jsx - REFACTORIZADO

import React, { useState, useEffect } from 'react';
import { PlusCircle, Briefcase, Edit, Trash2, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { compartirTrabajoNativo } from '../services/shareService';

import ModalTrabajo from '../components/modals/ModalTrabajo';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import Loader from '../components/other/Loader';
import Button from '../components/ui/Button';
import ListSection from '../components/sections/ListSection';
import { useDeleteManager } from '../hooks/useDeleteManager';

const TrabajoCard = ({ trabajo, turnos, onEdit, onShare, onDelete, shareState }) => {
  const turnosCount = turnos.filter(turno => turno.trabajoId === trabajo.id).length;
  const { sharing, message } = shareState;
  
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden border-l-4"
      style={{ borderLeftColor: trabajo.color }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: trabajo.color }}
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {trabajo.nombre}
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              {turnosCount} {turnosCount === 1 ? 'turno registrado' : 'turnos registrados'}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(trabajo)}
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-blue-600"
              icon={Edit}
            />
            <Button
              onClick={() => onShare(trabajo)}
              disabled={sharing}
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-blue-600"
              icon={Share2}
            />
            <Button
              onClick={() => onDelete(trabajo)}
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-red-600"
              icon={Trash2}
            />
          </div>
        </div>
        
        {/* Share message */}
        {message && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}
        
        {/* Tarifas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tarifa base:</span>
              <span className="font-medium">${trabajo.tarifaBase?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Diurno:</span>
              <span className="font-medium">${trabajo.tarifas?.diurno?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tarde:</span>
              <span className="font-medium">${trabajo.tarifas?.tarde?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Noche:</span>
              <span className="font-medium">${trabajo.tarifas?.noche?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sábado:</span>
              <span className="font-medium">${trabajo.tarifas?.sabado?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Domingo:</span>
              <span className="font-medium">${trabajo.tarifas?.domingo?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        {trabajo.descripcion && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{trabajo.descripcion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Trabajos = () => {
  const { currentUser } = useAuth();
  const { trabajos, cargando, borrarTrabajo, turnos } = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  
  // Estados para compartir
  const [compartiendoTrabajo, setCompartiendoTrabajo] = useState({});
  const [mensajesCompartir, setMensajesCompartir] = useState({});
  
  // Hook para manejo de eliminación
  const deleteManager = useDeleteManager(borrarTrabajo);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => {
    let timer;
    if (cargando) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => setShowLoading(false), 2000);
    }
    return () => timer && clearTimeout(timer);
  }, [cargando]);
  
  // Funciones para modales
  const abrirModalNuevoTrabajo = () => {
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  };
  
  const abrirModalEditarTrabajo = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  };
  
  // Función para compartir
  const handleCompartirTrabajo = async (trabajo) => {
    try {
      setCompartiendoTrabajo(prev => ({ ...prev, [trabajo.id]: true }));
      setMensajesCompartir(prev => ({ ...prev, [trabajo.id]: '' }));
      
      await compartirTrabajoNativo(currentUser.uid, trabajo);
      
      setMensajesCompartir(prev => ({ 
        ...prev, 
        [trabajo.id]: 'Trabajo compartido exitosamente' 
      }));
      
      setTimeout(() => {
        setMensajesCompartir(prev => ({ ...prev, [trabajo.id]: '' }));
      }, 3000);
      
    } catch (error) {
      setMensajesCompartir(prev => ({ 
        ...prev, 
        [trabajo.id]: 'Error al compartir trabajo' 
      }));
      setTimeout(() => {
        setMensajesCompartir(prev => ({ ...prev, [trabajo.id]: '' }));
      }, 3000);
    } finally {
      setCompartiendoTrabajo(prev => ({ ...prev, [trabajo.id]: false }));
    }
  };
  
  // Generar detalles para eliminación
  const generarDetallesTrabajo = (trabajo) => {
    if (!trabajo) return [];
    
    const turnosAsociados = turnos.filter(turno => turno.trabajoId === trabajo.id).length;
    
    return [
      trabajo.nombre,
      `Tarifa base: $${trabajo.tarifaBase?.toFixed(2) || '0.00'}`,
      turnosAsociados > 0 ? `${turnosAsociados} ${turnosAsociados === 1 ? 'turno registrado' : 'turnos registrados'}` : 'Sin turnos registrados'
    ];
  };
  
  const generarAdvertencia = (trabajo) => {
    if (!trabajo) return null;
    
    const turnosAsociados = turnos.filter(turno => turno.trabajoId === trabajo.id).length;
    
    if (turnosAsociados > 0) {
      return `Este trabajo tiene ${turnosAsociados} ${turnosAsociados === 1 ? 'turno asociado' : 'turnos asociados'}. Al eliminarlo, también se ${turnosAsociados === 1 ? 'eliminará este turno' : 'eliminarán estos turnos'}.`;
    }
    
    return null;
  };

  if (showLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <>
      <ListSection
        title="Mis Trabajos"
        action={{
          label: 'Nuevo Trabajo',
          icon: PlusCircle,
          onClick: abrirModalNuevoTrabajo
        }}
        items={trabajos}
        emptyState={{
          icon: Briefcase,
          title: 'No hay trabajos registrados',
          description: 'Comienza agregando tu primer trabajo',
          action: {
            label: 'Agregar primer trabajo',
            icon: PlusCircle,
            onClick: abrirModalNuevoTrabajo
          }
        }}
        renderItem={(trabajo) => (
          <TrabajoCard
            key={trabajo.id}
            trabajo={trabajo}
            turnos={turnos}
            onEdit={abrirModalEditarTrabajo}
            onShare={handleCompartirTrabajo}
            onDelete={deleteManager.startDeletion}
            shareState={{
              sharing: compartiendoTrabajo[trabajo.id] || false,
              message: mensajesCompartir[trabajo.id] || ''
            }}
          />
        )}
      />
      
      {/* Modales */}
      <ModalTrabajo 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        trabajo={trabajoSeleccionado} 
      />
      
      <AlertaEliminacion
        visible={deleteManager.showDeleteModal}
        onCancel={deleteManager.cancelDeletion}
        onConfirm={deleteManager.confirmDeletion}
        eliminando={deleteManager.deleting}
        tipo="trabajo"
        detalles={generarDetallesTrabajo(deleteManager.itemToDelete)}
        advertencia={generarAdvertencia(deleteManager.itemToDelete)}
      />
    </>
  );
};

export default Trabajos;