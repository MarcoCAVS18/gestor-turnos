// src/components/settings/TurnRangeSection/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Clock, Sun, Sunset, Moon ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const TimeSelect = (***REMOVED*** label, value, onChange, icon: Icon, iconColor ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1 flex items-center">
        ***REMOVED***Icon && <Icon className="h-4 w-4 mr-1" style=***REMOVED******REMOVED*** color: iconColor ***REMOVED******REMOVED*** />***REMOVED***
        ***REMOVED***label***REMOVED***
      </label>
      <select
        value=***REMOVED***value***REMOVED***
        onChange=***REMOVED***(e) => onChange(parseInt(e.target.value))***REMOVED***
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        style=***REMOVED******REMOVED*** 
          '--tw-ring-color': thematicColors?.base || '#EC4899'
        ***REMOVED******REMOVED***
      >
        ***REMOVED***Array.from(***REMOVED***length: 24***REMOVED***, (_, i) => (
          <option key=***REMOVED***i***REMOVED*** value=***REMOVED***i***REMOVED***>***REMOVED***i.toString().padStart(2, '0')***REMOVED***:00</option>
        ))***REMOVED***
      </select>
    </div>
  );
***REMOVED***;

const TurnRange = (***REMOVED*** title, icon: Icon, iconColor, children ***REMOVED***) => ***REMOVED***
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 mr-2" style=***REMOVED******REMOVED*** color: iconColor ***REMOVED******REMOVED*** />
        <h3 className="font-medium">***REMOVED***title***REMOVED***</h3>
      </div>
      ***REMOVED***children***REMOVED***
    </div>
  );
***REMOVED***;

const TurnRangeSection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    rangosTurnos: appRangos, 
    guardarPreferencias 
  ***REMOVED*** = useApp();
  
  const [rangosTurnos, setRangosTurnos] = useState(appRangos || ***REMOVED***
    diurnoInicio: 6,
    diurnoFin: 14,
    tardeInicio: 14,
    tardeFin: 20,
    nocheInicio: 20
  ***REMOVED***);
  const [loading, setLoading] = useState(false);

  useEffect(() => ***REMOVED***
    if (appRangos) ***REMOVED***
      setRangosTurnos(appRangos);
    ***REMOVED***
  ***REMOVED***, [appRangos]);

  const validarRangos = (rangos) => ***REMOVED***
    if (rangos.diurnoInicio >= rangos.diurnoFin) ***REMOVED***
      return 'La hora de inicio del turno diurno debe ser menor a la hora de fin';
    ***REMOVED***
    if (rangos.tardeInicio >= rangos.tardeFin) ***REMOVED***
      return 'La hora de inicio del turno de tarde debe ser menor a la hora de fin';
    ***REMOVED***
    if (rangos.diurnoFin > rangos.tardeInicio) ***REMOVED***
      return 'El turno de tarde debe comenzar después o al mismo tiempo que termina el diurno';
    ***REMOVED***
    if (rangos.tardeFin > rangos.nocheInicio) ***REMOVED***
      return 'El turno de noche debe comenzar después o al mismo tiempo que termina la tarde';
    ***REMOVED***
    return null;
  ***REMOVED***;

  const handleSave = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      
      const errorValidacion = validarRangos(rangosTurnos);
      if (errorValidacion) ***REMOVED***
        onError?.(errorValidacion);
        return;
      ***REMOVED***
      
      await guardarPreferencias(***REMOVED*** rangosTurnos ***REMOVED***);
      onSuccess?.('Rangos de turnos guardados correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al guardar rangos: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***Clock***REMOVED*** title="Rangos de Turnos">
      <p className="text-sm text-gray-600 mb-4">
        Configura los rangos de horarios para la detección automática de tipos de turno.
      </p>
      
      <div className="space-y-4 mb-6">
        ***REMOVED***/* Turno Diurno */***REMOVED***
        <TurnRange title="Turno Diurno" icon=***REMOVED***Sun***REMOVED*** iconColor="#F59E0B">
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value=***REMOVED***rangosTurnos.diurnoInicio***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                diurnoInicio: value
              ***REMOVED***)***REMOVED***
            />
            <TimeSelect
              label="Hora de fin"
              value=***REMOVED***rangosTurnos.diurnoFin***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                diurnoFin: value
              ***REMOVED***)***REMOVED***
            />
          </div>
        </TurnRange>
        
        ***REMOVED***/* Turno Tarde */***REMOVED***
        <TurnRange title="Turno Tarde" icon=***REMOVED***Sunset***REMOVED*** iconColor="#F97316">
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value=***REMOVED***rangosTurnos.tardeInicio***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                tardeInicio: value
              ***REMOVED***)***REMOVED***
            />
            <TimeSelect
              label="Hora de fin"
              value=***REMOVED***rangosTurnos.tardeFin***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                tardeFin: value
              ***REMOVED***)***REMOVED***
            />
          </div>
        </TurnRange>
        
        ***REMOVED***/* Turno Noche */***REMOVED***
        <TurnRange title="Turno Noche" icon=***REMOVED***Moon***REMOVED*** iconColor="#6366F1">
          <TimeSelect
            label="Hora de inicio"
            value=***REMOVED***rangosTurnos.nocheInicio***REMOVED***
            onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
              ...rangosTurnos,
              nocheInicio: value
            ***REMOVED***)***REMOVED***
          />
          <p className="text-xs text-gray-500 mt-1">
            El turno de noche se extiende hasta el final del día
          </p>
        </TurnRange>
      </div>

      <Button
        onClick=***REMOVED***handleSave***REMOVED***
        disabled=***REMOVED***loading***REMOVED***
        loading=***REMOVED***loading***REMOVED***
        className="w-full"
      >
        Guardar rangos de turnos
      </Button>
    </SettingsSection>
  );
***REMOVED***;

export default TurnRangeSection;