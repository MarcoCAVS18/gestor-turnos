// src/components/TarjetaTurno.jsx

import React, ***REMOVED*** useState, useRef ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Trash2, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const TarjetaTurno = (***REMOVED*** turno, trabajo, onEdit, onDelete ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calcularPago, coloresTemáticos, rangosTurnos ***REMOVED*** = useApp();
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  
  const ***REMOVED*** horas, total, totalConDescuento ***REMOVED*** = calcularPago(turno);
  
  // Función para calcular TODOS los tipos de turno que abarca
  const calcularTiposTurno = (turno) => ***REMOVED***
    const fecha = new Date(turno.fecha + 'T00:00:00');
    const diaSemana = fecha.getDay();
    
    // Si es fin de semana, solo devolver ese tipo
    if (diaSemana === 0) return [***REMOVED*** tipo: 'Domingo', color: '#EF4444' ***REMOVED***];
    if (diaSemana === 6) return [***REMOVED*** tipo: 'Sábado', color: '#8B5CF6' ***REMOVED***];
    
    // Para días de semana, analizar rangos horarios
    const rangos = rangosTurnos || ***REMOVED***
      diurnoInicio: 6, diurnoFin: 14,
      tardeInicio: 14, tardeFin: 20,
      nocheInicio: 20
    ***REMOVED***;
    
    const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
    
    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    // Si cruza medianoche
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***
    
    const tipos = [];
    const tiposEncontrados = new Set();
    
    // Analizar cada minuto del turno
    for (let minuto = inicioMinutos; minuto < finMinutos; minuto++) ***REMOVED***
      const horaActual = minuto % (24 * 60);
      
      let tipoActual = '';
      if (horaActual >= rangos.diurnoInicio * 60 && horaActual < rangos.diurnoFin * 60) ***REMOVED***
        tipoActual = 'Diurno';
      ***REMOVED*** else if (horaActual >= rangos.tardeInicio * 60 && horaActual < rangos.tardeFin * 60) ***REMOVED***
        tipoActual = 'Tarde';
      ***REMOVED*** else ***REMOVED***
        tipoActual = 'Nocturno';
      ***REMOVED***
      
      tiposEncontrados.add(tipoActual);
    ***REMOVED***
    
    // Convertir a array con colores
    const coloresTipos = ***REMOVED***
      'Diurno': '#10B981',
      'Tarde': '#F59E0B',
      'Nocturno': '#6366F1',
      'Sábado': '#8B5CF6',
      'Domingo': '#EF4444'
    ***REMOVED***;
    
    // Ordenar los tipos según el orden lógico
    const ordenTipos = ['Diurno', 'Tarde', 'Nocturno'];
    
    ordenTipos.forEach(tipo => ***REMOVED***
      if (tiposEncontrados.has(tipo)) ***REMOVED***
        tipos.push(***REMOVED***
          tipo,
          color: coloresTipos[tipo]
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***);
    
    return tipos;
  ***REMOVED***;
  
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
      setCurrentX(Math.min(diffX, 80));
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
      setCurrentX(80); 
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
          
          ***REMOVED***/* Tipos de turno - MÚLTIPLES ETIQUETAS */***REMOVED***
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              ***REMOVED***calcularTiposTurno(turno).map((tipoInfo, index) => (
                <span 
                  key=***REMOVED***index***REMOVED***
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                  style=***REMOVED******REMOVED*** backgroundColor: tipoInfo.color ***REMOVED******REMOVED***
                >
                  ***REMOVED***tipoInfo.tipo***REMOVED***
                </span>
              ))***REMOVED***
            </div>
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