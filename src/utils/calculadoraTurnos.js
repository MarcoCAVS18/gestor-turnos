// src/utils/calculadoraTurnos.js

/**
 * Calcula las horas trabajadas entre dos horarios
 * @param ***REMOVED***string***REMOVED*** horaInicio - Hora de inicio en formato "HH:MM"
 * @param ***REMOVED***string***REMOVED*** horaFin - Hora de fin en formato "HH:MM"
 * @returns ***REMOVED***number***REMOVED*** Horas trabajadas (decimal)
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
   * @param ***REMOVED***Object***REMOVED*** turno - Turno a calcular
   * @param ***REMOVED***Object***REMOVED*** trabajo - Trabajo asociado al turno
   * @returns ***REMOVED***Object***REMOVED*** Resultado del cálculo con total, totalConDescuento y horas
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
   * @param ***REMOVED***number***REMOVED*** monto - Monto original sin descuento
   * @param ***REMOVED***number***REMOVED*** porcentajeDescuento - Porcentaje de descuento (por defecto 15%)
   * @returns ***REMOVED***number***REMOVED*** Monto con descuento aplicado
   */
  export const aplicarDescuento = (monto, porcentajeDescuento = 15) => ***REMOVED***
    return monto * (1 - porcentajeDescuento / 100);
  ***REMOVED***;
  
  /**
   * Calcula el total ganado en un día específico
   * @param ***REMOVED***Array***REMOVED*** turnos - Lista de turnos del día
   * @param ***REMOVED***Array***REMOVED*** trabajos - Lista de trabajos
   * @returns ***REMOVED***number***REMOVED*** Total ganado en el día con descuento aplicado
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
   * @param ***REMOVED***string***REMOVED*** fecha - Fecha en formato ISO "YYYY-MM-DD"
   * @param ***REMOVED***string***REMOVED*** horaInicio - Hora de inicio en formato "HH:MM"
   * @returns ***REMOVED***string***REMOVED*** Tipo de turno (diurno, tarde, noche, sabado, domingo)
   */
  export const determinarTipoTurno = (fecha, horaInicio) => ***REMOVED***
    const diaSemana = new Date(fecha).getDay(); // 0 = domingo, 6 = sábado
    const hora = parseInt(horaInicio.split(':')[0]);
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    
    if (hora >= 5 && hora < 14) return 'diurno';
    if (hora >= 14 && hora < 22) return 'tarde';
    return 'noche';
  ***REMOVED***;
  
  /**
   * Calcula resumen estadístico de turnos
   * @param ***REMOVED***Array***REMOVED*** turnos - Lista de todos los turnos
   * @param ***REMOVED***Array***REMOVED*** trabajos - Lista de todos los trabajos
   * @returns ***REMOVED***Object***REMOVED*** Objeto con estadísticas
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