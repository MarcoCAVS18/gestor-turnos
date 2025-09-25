// src/utils/shiftDetailsUtils.js

// Función para detectar si un turno cruza medianoche
export function checkIfShiftCrossesMidnight(turno) {
  if (!turno.horaInicio || !turno.horaFin) return false;
  
  // Si ya tiene la propiedad cruzaMedianoche, usarla
  if (turno.cruzaMedianoche !== undefined) {
    return turno.cruzaMedianoche;
  }
  
  // Si tiene fechaInicio y fechaFin diferentes, cruza medianoche
  if (turno.fechaInicio && turno.fechaFin && turno.fechaInicio !== turno.fechaFin) {
    return true;
  }
  
  // Calcular basándose en las horas
  const [horaInicio] = turno.horaInicio.split(':').map(Number);
  const [horaFin] = turno.horaFin.split(':').map(Number);
  
  return horaFin < horaInicio;
}

// Función para determinar tipo de turno por hora específica
export function getTipoTurnoByHour(hora, shiftRanges) {
  const ranges = shiftRanges || {
    dayStart: 6, dayEnd: 14,
    afternoonStart: 14, afternoonEnd: 20,
    nightStart: 20
  };

  if (hora >= ranges.dayStart && hora < ranges.dayEnd) {
    return 'diurno';
  } else if (hora >= ranges.afternoonStart && hora < ranges.afternoonEnd) {
    return 'tarde';
  } else {
    return 'noche';
  }
}

// Función principal para determinar el tipo de turno - ESTA ES LA ÚNICA QUE DEBES USAR
export function determinarTipoTurno(turno, shiftRanges) {
  if (!turno) return 'noche';
  
  // Si es delivery, retornar delivery
  if (turno.tipo === 'delivery' || turno.type === 'delivery') {
    return 'delivery';
  }
  
  // Determinar por fecha (fin de semana)
  const fechaClave = turno.fechaInicio || turno.fecha;
  if (fechaClave) {
    const [year, month, day] = fechaClave.split('-');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0) return 'domingo';
    if (dayOfWeek === 6) return 'sabado';
  }
  
  // Determinar por hora de inicio y fin para detectar turnos mixtos
  if (turno.horaInicio && turno.horaFin) {
    const [horaInicio, minutoInicio] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minutoFin] = turno.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minutoInicio;
    let finMinutos = horaFin * 60 + minutoFin;
    
    // Si cruza medianoche
    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }
    
    const tiposEncontrados = new Set();
    
    // Revisar cada hora del turno para ver si cambia de tipo
    for (let minutos = inicioMinutos; minutos < finMinutos; minutos += 60) {
      const horaActual = Math.floor((minutos % (24 * 60)) / 60);
      const tipo = getTipoTurnoByHour(horaActual, shiftRanges);
      tiposEncontrados.add(tipo);
    }
    
    // Si hay más de un tipo, es mixto
    if (tiposEncontrados.size > 1) {
      return 'mixto';
    }
    
    // Si solo hay un tipo, retornar ese tipo
    return Array.from(tiposEncontrados)[0] || 'noche';
  }
  
  return 'noche';
}

// Función que devuelve la etiqueta legible
export function getTipoTurnoLabel(tipo) {
  const labels = {
    diurno: 'Diurno',
    tarde: 'Tarde', 
    noche: 'Noche',
    sabado: 'Sábado',
    domingo: 'Domingo',
    delivery: 'Delivery',
    mixto: 'Mixto'
  };
  
  return labels[tipo] || 'Noche';
}

// ✅ Nueva función para pluralizar "turnos"
export function formatTurnos(cantidad) {
  return `${cantidad} ${cantidad === 1 ? 'TURNO' : 'TURNOS'}`;
}

// Función para generar los detalles del turno para el modal de eliminación
export function generateShiftDetails(turno, allJobs) {
  if (!turno) return [];

  const trabajo = allJobs.find(t => t.id === turno.trabajoId);

  // Verificar si el turno cruza medianoche
  const cruzaMedianoche = checkIfShiftCrossesMidnight(turno);
  
  let fechaTexto = '';
  
  if (cruzaMedianoche) {
    // Turno que cruza medianoche - mostrar ambas fechas
    let fechaInicio, fechaFin;
    
    if (turno.fechaInicio && turno.fechaFin && turno.fechaInicio !== turno.fechaFin) {
      // Usar las fechas existentes si son diferentes
      fechaInicio = new Date(turno.fechaInicio + 'T00:00:00');
      fechaFin = new Date(turno.fechaFin + 'T00:00:00');
    } else {
      // Calcular la fecha de fin basándose en la fecha de inicio
      const fechaBase = turno.fechaInicio || turno.fecha;
      fechaInicio = new Date(fechaBase + 'T00:00:00');
      fechaFin = new Date(fechaBase + 'T00:00:00'); // Crear desde la fecha base
      fechaFin.setDate(fechaFin.getDate() + 1); // Sumar 1 día
    }
    
    const fechaInicioStr = fechaInicio.toLocaleDateString('es-ES', {
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    });
    
    const fechaFinStr = fechaFin.toLocaleDateString('es-ES', {
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    });
    
    fechaTexto = `${fechaInicioStr} - ${fechaFinStr}`;
  } else {
    // Turno normal en un solo día
    const fechaStr = turno.fechaInicio || turno.fecha;
    if (fechaStr) {
      const fecha = new Date(fechaStr + 'T00:00:00');
      fechaTexto = fecha.toLocaleDateString('es-ES', {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long'
      });
    } else {
      fechaTexto = 'Fecha no disponible';
    }
  }

  const detalles = [
    trabajo?.nombre || 'Trabajo no encontrado',
    fechaTexto,
    `${turno.horaInicio} - ${turno.horaFin}`
  ];

  if (turno.tipo === 'delivery') {
    detalles.push(`${turno.numeroPedidos || 0} pedidos`);
  }

  return detalles;
}
