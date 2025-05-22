// src/components/TarjetaTurno.jsx - COMPONENTE COMPLETO CON SWIPE

import React, { useState, useRef } from 'react';
import { Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const TarjetaTurno = ({ turno, trabajo, onEdit, onDelete }) => {
  const { calcularPago, coloresTemáticos } = useApp();
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  
  const { horas, total, totalConDescuento } = calcularPago(turno);
  
  // Manejar inicio del touch
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };
  
  // Manejar movimiento del touch
  const handleTouchMove = (e) => {
    if (!isDragging || startX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;
    
    // Solo permitir swipe hacia la izquierda
    if (diffX > 0) {
      setCurrentX(Math.min(diffX, 80)); // Ajustado para el nuevo ancho de botones
    } else {
      setCurrentX(0);
    }
  };
  
  // Manejar final del touch
  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Si se deslizó más de 50px, abrir completamente
    if (currentX > 50) {
      setIsSwipeOpen(true);
      setCurrentX(80); // Ajustado para el nuevo ancho de botones
    } else {
      setIsSwipeOpen(false);
      setCurrentX(0);
    }
    
    setStartX(null);
  };
  
  // Manejar click (cerrar si está abierto)
  const handleClick = () => {
    if (isSwipeOpen) {
      setIsSwipeOpen(false);
      setCurrentX(0);
    }
  };
  
  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  return (
    <div className="relative overflow-hidden rounded-lg mb-3 bg-white shadow-sm">
      {/* Botones de acción (por debajo) */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col w-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(turno);
            setIsSwipeOpen(false);
            setCurrentX(0);
          }}
          className="flex-1 flex items-center justify-center bg-gray-400 hover:bg-gray-600 transition-colors"
        >
          <Edit size={20} className="text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(turno);
            setIsSwipeOpen(false);
            setCurrentX(0);
          }}
          className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors"
        >
          <Trash2 size={20} className="text-white" />
        </button>
      </div>
      
      {/* Contenido principal (deslizable) */}
      <div 
        ref={cardRef}
        className="relative bg-white border border-gray-200 rounded-lg transition-transform duration-200 cursor-pointer"
        style={{
          transform: `translateX(-${currentX}px)`,
          borderLeftColor: trabajo.color,
          borderLeftWidth: '4px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="p-4">
          {/* Header con trabajo y fecha */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: trabajo.color }}
                />
                <h4 className="font-semibold text-gray-800">{trabajo.nombre}</h4>
              </div>
              <p className="text-sm text-gray-500">
                {formatearFecha(turno.fecha)}
              </p>
            </div>
            <div className="text-right">
              <p 
                className="text-lg font-bold"
                style={{ color: coloresTemáticos?.base || '#EC4899' }}
              >
                ${totalConDescuento.toFixed(2)}
              </p>
              {total !== totalConDescuento && (
                <p className="text-xs text-gray-400 line-through">
                  ${total.toFixed(2)}
                </p>
              )}
            </div>
          </div>
          
          {/* Información del turno */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-2" />
              <span>{turno.horaInicio} - {turno.horaFin}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign size={14} className="mr-2" />
              <span>{horas.toFixed(1)} horas</span>
            </div>
          </div>
          
          {/* Tipo de turno */}
          <div className="mt-3">
            <span 
              className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: trabajo.color }}
            >
              {turno.tipo.charAt(0).toUpperCase() + turno.tipo.slice(1)}
            </span>
          </div>
          
          {/* Notas si las hay */}
          {turno.notas && (
            <div className="mt-3 p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">{turno.notas}</p>
            </div>
          )}
          
          {/* Indicador de swipe */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetaTurno;