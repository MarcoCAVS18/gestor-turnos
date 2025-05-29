// src/hooks/useCalculations.js

import ***REMOVED*** useMemo, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export const useCalculations = () => ***REMOVED***
  const ***REMOVED*** trabajos, rangosTurnos, descuentoDefault ***REMOVED*** = useApp();

  const calcularHoras = useCallback((inicio, fin) => ***REMOVED***
    const [horaIni, minIni] = inicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = fin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;

    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***

    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***, []);

  const calcularPago = useCallback((turno) => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return ***REMOVED*** total: 0, totalConDescuento: 0, horas: 0 ***REMOVED***;

    const ***REMOVED*** horaInicio, horaFin ***REMOVED*** = turno;
    const [horaIni, minIni] = horaInicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = horaFin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;

    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***

    const totalMinutos = finMinutos - inicioMinutos;
    const horas = totalMinutos / 60;

    const [year, month, day] = turno.fecha.split('-');
    const fecha = new Date(year, month - 1, day);
    const diaSemana = fecha.getDay();

    let total = 0;

    if (diaSemana === 0) ***REMOVED***
      total = horas * trabajo.tarifas.domingo;
    ***REMOVED*** else if (diaSemana === 6) ***REMOVED***
      total = horas * trabajo.tarifas.sabado;
    ***REMOVED*** else ***REMOVED***
      const rangos = rangosTurnos || ***REMOVED***
        diurnoInicio: 6, diurnoFin: 14,
        tardeInicio: 14, tardeFin: 20,
        nocheInicio: 20
      ***REMOVED***;

      const diurnoInicioMin = rangos.diurnoInicio * 60;
      const diurnoFinMin = rangos.diurnoFin * 60;
      const tardeInicioMin = rangos.tardeInicio * 60;
      const tardeFinMin = rangos.tardeFin * 60;

      for (let minuto = inicioMinutos; minuto < finMinutos; minuto++) ***REMOVED***
        const horaActual = minuto % (24 * 60);
        let tarifa = trabajo.tarifaBase;

        if (horaActual >= diurnoInicioMin && horaActual < diurnoFinMin) ***REMOVED***
          tarifa = trabajo.tarifas.diurno;
        ***REMOVED*** else if (horaActual >= tardeInicioMin && horaActual < tardeFinMin) ***REMOVED***
          tarifa = trabajo.tarifas.tarde;
        ***REMOVED*** else ***REMOVED***
          tarifa = trabajo.tarifas.noche;
        ***REMOVED***

        total += tarifa / 60;
      ***REMOVED***
    ***REMOVED***

    const totalConDescuento = total * (1 - descuentoDefault / 100);

    return ***REMOVED***
      total,
      totalConDescuento,
      horas
    ***REMOVED***;
  ***REMOVED***, [trabajos, rangosTurnos, descuentoDefault]);

  const calcularTotalDia = useCallback((turnosDia) => ***REMOVED***
    return turnosDia.reduce((total, turno) => ***REMOVED***
      const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
      return total + totalConDescuento;
    ***REMOVED***, 0);
  ***REMOVED***, [calcularPago]);

  return ***REMOVED***
    calcularHoras,
    calcularPago,
    calcularTotalDia
  ***REMOVED***;
***REMOVED***;
