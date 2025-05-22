// src/utils/calculadoraTurnos.js

/**
 * Calcula las horas trabajadas entre dos horarios
 * @param ***REMOVED***string***REMOVED*** horaInicio
 * @param ***REMOVED***string***REMOVED*** horaFin
 * @returns ***REMOVED***number***REMOVED***
 */
export const calcularHoras = (horaInicio, horaFin) => ***REMOVED***
    const [horaIni, minIni] = horaInicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = horaFin.split(':').map(n => parseInt(n));
    
    const inicioMinutos = horaIni * 60 + minIni;
    const finMinutos = horaFn * 60 + minFn;
    
    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***;
  
  /**
   * Calcula el pago de un turno según sus características
   * @param ***REMOVED***Object***REMOVED*** turno 
   * @param ***REMOVED***Object***REMOVED*** trabajo 
   * @returns ***REMOVED***Object***REMOVED***
   */
  export const calcularPago = (turno, trabajo) => ***REMOVED***
    const horas = calcularHoras(turno.horaInicio, turno.horaFin);
    let tarifa = trabajo.tarifaBase;
    
    switch (turno.tipo) ***REMOVED***
      case 'diurno':
        tarifa = trabajo.tarifas.diurno;
        break;
      case 'tarde':
        tarifa = trabajo.tarifas.tarde;
        break;
      case 'noche':
        tarifa = trabajo.tarifas.noche;
        break;
      case 'sabado':
        tarifa = trabajo.tarifas.sabado;
        break;
      case 'domingo':
        tarifa = trabajo.tarifas.domingo;
        break;
      default:
        tarifa = trabajo.tarifaBase;
    ***REMOVED***
    
    const total = horas * tarifa;
    const totalConDescuento = aplicarDescuento(total);
    
    return ***REMOVED***
      total,
      totalConDescuento,
      horas,
      tarifa
    ***REMOVED***;
  ***REMOVED***;
  
  /**
   * Aplica el descuento para trabajos casuales (15%)
   * @param ***REMOVED***number***REMOVED*** monto
   * @param ***REMOVED***number***REMOVED*** porcentajeDescuento
   * @returns ***REMOVED***number***REMOVED***
   */
  export const aplicarDescuento = (monto, porcentajeDescuento = 15) => ***REMOVED***
    return monto * (1 - porcentajeDescuento / 100);
  ***REMOVED***;
  
  /**
   * Calcula el total ganado en un día específico
   * @param ***REMOVED***Array***REMOVED*** turnos
   * @param ***REMOVED***Array***REMOVED*** trabajos 
   * @returns ***REMOVED***number***REMOVED***
   */
  export const calcularTotalDia = (turnos, trabajos) => ***REMOVED***
    let total = 0;
    
    turnos.forEach(turno => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (trabajo) ***REMOVED***
        const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno, trabajo);
        total += totalConDescuento;
      ***REMOVED***
    ***REMOVED***);
    
    return total;
  ***REMOVED***;
  
  /**
   * Determina automáticamente el tipo de turno según fecha y hora
   * @param ***REMOVED***string***REMOVED*** fecha
   * @param ***REMOVED***string***REMOVED*** horaInicio
   * @returns ***REMOVED***string***REMOVED*** 
   */
  export const determinarTipoTurno = (fecha, horaInicio) => ***REMOVED***
    const diaSemana = new Date(fecha).getDay(); 
    const hora = parseInt(horaInicio.split(':')[0]);
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    
    if (hora >= 5 && hora < 14) return 'diurno';
    if (hora >= 14 && hora < 22) return 'tarde';
    return 'noche';
  ***REMOVED***;
  
  /**
   * Calcula resumen estadístico de turnos
   * @param ***REMOVED***Array***REMOVED*** turnos 
   * @param ***REMOVED***Array***REMOVED*** trabajos 
   * @returns ***REMOVED***Object***REMOVED*** 
   */
  export const calcularEstadisticas = (turnos, trabajos) => ***REMOVED***
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = ***REMOVED******REMOVED***;
    const horasPorTrabajo = ***REMOVED******REMOVED***;
    const turnosPorDia = ***REMOVED***
      "Lunes": 0,
      "Martes": 0,
      "Miércoles": 0,
      "Jueves": 0,
      "Viernes": 0,
      "Sábado": 0,
      "Domingo": 0
    ***REMOVED***;
    
    // Nombres de días para mapeo
    const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    
    turnos.forEach(turno => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      const ***REMOVED*** totalConDescuento, horas ***REMOVED*** = calcularPago(turno, trabajo);
      
      // Acumular totales
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      
      // Acumular por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
        gananciaPorTrabajo[trabajo.id] = ***REMOVED***
          id: trabajo.id,
          nombre: trabajo.nombre,
          color: trabajo.color,
          ganancia: 0,
          horas: 0
        ***REMOVED***;
      ***REMOVED***
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      
      // Contar turnos por día
      const diaSemana = new Date(turno.fecha).getDay();
      turnosPorDia[nombresDias[diaSemana]]++;
    ***REMOVED***);
    
    // Convertir el objeto en array y ordenar por ganancia
    const trabajosMasRentables = Object.values(gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia);
    
    return ***REMOVED***
      totalGanado,
      horasTrabajadas,
      trabajosMasRentables,
      turnosPorDia,
      promedioHora: totalGanado / horasTrabajadas
    ***REMOVED***;
  ***REMOVED***;