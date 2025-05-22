// src/utils/calculadoraTurnos.js

/**
 * Calcula las horas trabajadas entre dos horarios
 * @param {string} horaInicio
 * @param {string} horaFin
 * @returns {number}
 */
export const calcularHoras = (horaInicio, horaFin) => {
    const [horaIni, minIni] = horaInicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = horaFin.split(':').map(n => parseInt(n));
    
    const inicioMinutos = horaIni * 60 + minIni;
    const finMinutos = horaFn * 60 + minFn;
    
    return (finMinutos - inicioMinutos) / 60;
  };
  
  /**
   * Calcula el pago de un turno según sus características
   * @param {Object} turno 
   * @param {Object} trabajo 
   * @returns {Object}
   */
  export const calcularPago = (turno, trabajo) => {
    const horas = calcularHoras(turno.horaInicio, turno.horaFin);
    let tarifa = trabajo.tarifaBase;
    
    switch (turno.tipo) {
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
    }
    
    const total = horas * tarifa;
    const totalConDescuento = aplicarDescuento(total);
    
    return {
      total,
      totalConDescuento,
      horas,
      tarifa
    };
  };
  
  /**
   * Aplica el descuento para trabajos casuales (15%)
   * @param {number} monto
   * @param {number} porcentajeDescuento
   * @returns {number}
   */
  export const aplicarDescuento = (monto, porcentajeDescuento = 15) => {
    return monto * (1 - porcentajeDescuento / 100);
  };
  
  /**
   * Calcula el total ganado en un día específico
   * @param {Array} turnos
   * @param {Array} trabajos 
   * @returns {number}
   */
  export const calcularTotalDia = (turnos, trabajos) => {
    let total = 0;
    
    turnos.forEach(turno => {
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (trabajo) {
        const { totalConDescuento } = calcularPago(turno, trabajo);
        total += totalConDescuento;
      }
    });
    
    return total;
  };
  
  /**
   * Determina automáticamente el tipo de turno según fecha y hora
   * @param {string} fecha
   * @param {string} horaInicio
   * @returns {string} 
   */
  export const determinarTipoTurno = (fecha, horaInicio) => {
    const diaSemana = new Date(fecha).getDay(); 
    const hora = parseInt(horaInicio.split(':')[0]);
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    
    if (hora >= 5 && hora < 14) return 'diurno';
    if (hora >= 14 && hora < 22) return 'tarde';
    return 'noche';
  };
  
  /**
   * Calcula resumen estadístico de turnos
   * @param {Array} turnos 
   * @param {Array} trabajos 
   * @returns {Object} 
   */
  export const calcularEstadisticas = (turnos, trabajos) => {
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = {};
    const horasPorTrabajo = {};
    const turnosPorDia = {
      "Lunes": 0,
      "Martes": 0,
      "Miércoles": 0,
      "Jueves": 0,
      "Viernes": 0,
      "Sábado": 0,
      "Domingo": 0
    };
    
    // Nombres de días para mapeo
    const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    
    turnos.forEach(turno => {
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      const { totalConDescuento, horas } = calcularPago(turno, trabajo);
      
      // Acumular totales
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      
      // Acumular por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) {
        gananciaPorTrabajo[trabajo.id] = {
          id: trabajo.id,
          nombre: trabajo.nombre,
          color: trabajo.color,
          ganancia: 0,
          horas: 0
        };
      }
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      
      // Contar turnos por día
      const diaSemana = new Date(turno.fecha).getDay();
      turnosPorDia[nombresDias[diaSemana]]++;
    });
    
    // Convertir el objeto en array y ordenar por ganancia
    const trabajosMasRentables = Object.values(gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia);
    
    return {
      totalGanado,
      horasTrabajadas,
      trabajosMasRentables,
      turnosPorDia,
      promedioHora: totalGanado / horasTrabajadas
    };
  };