// src/components/TarjetaTurno.jsx - COMPONENTE COMPLETO CON SWIPE

import React, ***REMOVED*** useState, useRef ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Trash2, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const TarjetaTurno = (***REMOVED*** turno, trabajo, onEdit, onDelete ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calcularPago, coloresTemáticos ***REMOVED*** = useApp();
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  
  const ***REMOVED*** horas, total, totalConDescuento ***REMOVED*** = calcularPago(turno);
  
  // Manejar inicio del touch
  const handleTouchStart = (e) => ***REMOVED***
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  ***REMOVED***;
  
  // Manejar movimiento del touch
  const handleTouchMove = (e) => ***REMOVED***
    if (!isDragging || startX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;
    
    // Solo permitir swipe hacia la izquierda
    if (diffX > 0) ***REMOVED***
      setCurrentX(Math.min(diffX, 80)); // Ajustado para el nuevo ancho de botones
    ***REMOVED*** else ***REMOVED***
      setCurrentX(0);
    ***REMOVED***
  ***REMOVED***;
  
  // Manejar final del touch
  const handleTouchEnd = () => ***REMOVED***
    setIsDragging(false);
    
    // Si se deslizó más de 50px, abrir completamente
    if (currentX > 50) ***REMOVED***
      setIsSwipeOpen(true);
      setCurrentX(80); // Ajustado para el nuevo ancho de botones
    ***REMOVED*** else ***REMOVED***
      setIsSwipeOpen(false);
      setCurrentX(0);
    ***REMOVED***
    
    setStartX(null);
  ***REMOVED***;
  
  // Manejar click (cerrar si está abierto)
  const handleClick = () => ***REMOVED***
    if (isSwipeOpen) ***REMOVED***
      setIsSwipeOpen(false);
      setCurrentX(0);
    ***REMOVED***
  ***REMOVED***;
  
  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    ***REMOVED***);
  ***REMOVED***;
  
  return (
    <div className="relative overflow-hidden rounded-lg mb-3 bg-white shadow-sm">
      ***REMOVED***/* Botones de acción (por debajo) */***REMOVED***
      <div className="absolute right-0 top-0 bottom-0 flex flex-col w-20">
        <button
          onClick=***REMOVED***(e) => ***REMOVED***
            e.stopPropagation();
            onEdit(turno);
            setIsSwipeOpen(false);
            setCurrentX(0);
          ***REMOVED******REMOVED***
          className="flex-1 flex items-center justify-center bg-gray-400 hover:bg-gray-600 transition-colors"
        >
          <Edit size=***REMOVED***20***REMOVED*** className="text-white" />
        </button>
        <button
          onClick=***REMOVED***(e) => ***REMOVED***
            e.stopPropagation();
            onDelete(turno);
            setIsSwipeOpen(false);
            setCurrentX(0);
          ***REMOVED******REMOVED***
          className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors"
        >
          <Trash2 size=***REMOVED***20***REMOVED*** className="text-white" />
        </button>
      </div>
      
      ***REMOVED***/* Contenido principal (deslizable) */***REMOVED***
      <div 
        ref=***REMOVED***cardRef***REMOVED***
        className="relative bg-white border border-gray-200 rounded-lg transition-transform duration-200 cursor-pointer"
        style=***REMOVED******REMOVED***
          transform: `translateX(-$***REMOVED***currentX***REMOVED***px)`,
          borderLeftColor: trabajo.color,
          borderLeftWidth: '4px'
        ***REMOVED******REMOVED***
        onTouchStart=***REMOVED***handleTouchStart***REMOVED***
        onTouchMove=***REMOVED***handleTouchMove***REMOVED***
        onTouchEnd=***REMOVED***handleTouchEnd***REMOVED***
        onClick=***REMOVED***handleClick***REMOVED***
      >
        <div className="p-4">
          ***REMOVED***/* Header con trabajo y fecha */***REMOVED***
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
                />
                <h4 className="font-semibold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h4>
              </div>
              <p className="text-sm text-gray-500">
                ***REMOVED***formatearFecha(turno.fecha)***REMOVED***
              </p>
            </div>
            <div className="text-right">
              <p 
                className="text-lg font-bold"
                style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              >
                $***REMOVED***totalConDescuento.toFixed(2)***REMOVED***
              </p>
              ***REMOVED***total !== totalConDescuento && (
                <p className="text-xs text-gray-400 line-through">
                  $***REMOVED***total.toFixed(2)***REMOVED***
                </p>
              )***REMOVED***
            </div>
          </div>
          
          ***REMOVED***/* Información del turno */***REMOVED***
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock size=***REMOVED***14***REMOVED*** className="mr-2" />
              <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign size=***REMOVED***14***REMOVED*** className="mr-2" />
              <span>***REMOVED***horas.toFixed(1)***REMOVED*** horas</span>
            </div>
          </div>
          
          ***REMOVED***/* Tipo de turno */***REMOVED***
          <div className="mt-3">
            <span 
              className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
              style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
            >
              ***REMOVED***turno.tipo.charAt(0).toUpperCase() + turno.tipo.slice(1)***REMOVED***
            </span>
          </div>
          
          ***REMOVED***/* Notas si las hay */***REMOVED***
          ***REMOVED***turno.notas && (
            <div className="mt-3 p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">***REMOVED***turno.notas***REMOVED***</p>
            </div>
          )***REMOVED***
          
          ***REMOVED***/* Indicador de swipe */***REMOVED***
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
***REMOVED***;

export default TarjetaTurno;