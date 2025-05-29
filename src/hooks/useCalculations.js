// src/hooks/useCalculations.js

import { useMemo, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

export const useCalculations = () => {
  const { trabajos, rangosTurnos, descuentoDefault } = useApp();

  const calcularHoras = useCallback((inicio, fin) => {
    const [horaIni, minIni] = inicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = fin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;

    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }

    return (finMinutos - inicioMinutos) / 60;
  }, []);

  const calcularPago = useCallback((turno) => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return { total: 0, totalConDescuento: 0, horas: 0 };

    const { horaInicio, horaFin } = turno;
    const [horaIni, minIni] = horaInicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = horaFin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;

    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }

    const totalMinutos = finMinutos - inicioMinutos;
    const horas = totalMinutos / 60;

    const [year, month, day] = turno.fecha.split('-');
    const fecha = new Date(year, month - 1, day);
    const diaSemana = fecha.getDay();

    let total = 0;

    if (diaSemana === 0) {
      total = horas * trabajo.tarifas.domingo;
    } else if (diaSemana === 6) {
      total = horas * trabajo.tarifas.sabado;
    } else {
      const rangos = rangosTurnos || {
        diurnoInicio: 6, diurnoFin: 14,
        tardeInicio: 14, tardeFin: 20,
        nocheInicio: 20
      };

      const diurnoInicioMin = rangos.diurnoInicio * 60;
      const diurnoFinMin = rangos.diurnoFin * 60;
      const tardeInicioMin = rangos.tardeInicio * 60;
      const tardeFinMin = rangos.tardeFin * 60;

      for (let minuto = inicioMinutos; minuto < finMinutos; minuto++) {
        const horaActual = minuto % (24 * 60);
        let tarifa = trabajo.tarifaBase;

        if (horaActual >= diurnoInicioMin && horaActual < diurnoFinMin) {
          tarifa = trabajo.tarifas.diurno;
        } else if (horaActual >= tardeInicioMin && horaActual < tardeFinMin) {
          tarifa = trabajo.tarifas.tarde;
        } else {
          tarifa = trabajo.tarifas.noche;
        }

        total += tarifa / 60;
      }
    }

    const totalConDescuento = total * (1 - descuentoDefault / 100);

    return {
      total,
      totalConDescuento,
      horas
    };
  }, [trabajos, rangosTurnos, descuentoDefault]);

  const calcularTotalDia = useCallback((turnosDia) => {
    return turnosDia.reduce((total, turno) => {
      const { totalConDescuento } = calcularPago(turno);
      return total + totalConDescuento;
    }, 0);
  }, [calcularPago]);

  return {
    calcularHoras,
    calcularPago,
    calcularTotalDia
  };
};
