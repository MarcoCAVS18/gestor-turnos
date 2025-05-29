import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const Turno = (***REMOVED*** turno, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calcularPago, rangosTurnos ***REMOVED*** = useApp();
  const ***REMOVED*** horas, total, totalConDescuento ***REMOVED*** = calcularPago(turno);
  
  const calcularTiposTurno = (turno) => ***REMOVED***
    const fecha = new Date(turno.fecha + 'T00:00:00');
    const diaSemana = fecha.getDay();
    
    if (diaSemana === 0) return [***REMOVED*** tipo: 'Domingo', color: '#EF4444' ***REMOVED***];
    if (diaSemana === 6) return [***REMOVED*** tipo: 'Sábado', color: '#8B5CF6' ***REMOVED***];
    
    const rangos = rangosTurnos || ***REMOVED***
      diurnoInicio: 6, diurnoFin: 14,
      tardeInicio: 14, tardeFin: 20,
      nocheInicio: 20
    ***REMOVED***;
    
    const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
    
    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***
    
    const tipos = [];
    const tiposEncontrados = new Set();
    
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
    
    const coloresTipos = ***REMOVED***
      'Diurno': '#10B981',
      'Tarde': '#F59E0B',
      'Nocturno': '#6366F1',
      'Sábado': '#8B5CF6',
      'Domingo': '#EF4444'
    ***REMOVED***;
    
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
  
  const tarifaPromedioPorHora = horas > 0 ? total / horas : 0;
  const tiposTurno = calcularTiposTurno(turno);
  
  return (
    <Card 
      className="mb-3 relative pl-6"
      style=***REMOVED******REMOVED*** 
        backgroundColor: `$***REMOVED***trabajo.color***REMOVED***15`, 
        borderColor: trabajo.color,
        borderWidth: '1px'
      ***REMOVED******REMOVED***
    >
      <div 
        className="absolute top-0 left-0 bottom-0 w-2 rounded-l-lg"
        style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
      />
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h4>
          <p className="text-gray-600 text-sm">
            ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED*** (***REMOVED***horas.toFixed(1)***REMOVED***h)
          </p>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">
              Tipo: ***REMOVED***tiposTurno.map(t => t.tipo).join(' y ')***REMOVED***
            </p>
            <div className="flex flex-wrap gap-1">
              ***REMOVED***tiposTurno.map((tipoInfo, index) => (
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
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Promedio: $***REMOVED***tarifaPromedioPorHora.toFixed(2)***REMOVED***/h
          </p>
          <p className="text-sm line-through text-gray-500">
            $***REMOVED***total.toFixed(2)***REMOVED***
          </p>
          <p className="font-semibold">
            $***REMOVED***totalConDescuento.toFixed(2)***REMOVED***
          </p>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default Turno;