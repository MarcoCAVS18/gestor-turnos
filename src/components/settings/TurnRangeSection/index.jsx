// src/components/settings/TurnRangeSection/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Clock, Sun, Sunset, Moon ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const TimeSelect = (***REMOVED*** label, value, onChange, icon: Icon, iconColor, thematicColors ***REMOVED***) => ***REMOVED***
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1 flex items-center">
        ***REMOVED***Icon && <Icon className="h-4 w-4 mr-1" style=***REMOVED******REMOVED*** color: iconColor ***REMOVED******REMOVED*** />***REMOVED***
        ***REMOVED***label***REMOVED***
      </label>
      <select
        value=***REMOVED***value***REMOVED***
        onChange=***REMOVED***(e) => onChange(parseInt(e.target.value))***REMOVED***
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
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

const TurnRange = (***REMOVED*** title, icon: Icon, iconColor, children, thematicColors ***REMOVED***) => ***REMOVED***
  return (
    <div 
      className="border rounded-lg p-4"
      style=***REMOVED******REMOVED*** borderColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)' ***REMOVED******REMOVED***
    >
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
    shiftRanges,
    savePreferences,
    thematicColors
  ***REMOVED*** = useApp();
  
  const [rangosTurnos, setRangosTurnos] = useState(shiftRanges || ***REMOVED***
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  ***REMOVED***);
  const [loading, setLoading] = useState(false);

  useEffect(() => ***REMOVED***
    if (shiftRanges) ***REMOVED***
      setRangosTurnos(shiftRanges);
    ***REMOVED***
  ***REMOVED***, [shiftRanges]);

  const validarRangos = (rangos) => ***REMOVED***
    if (rangos.dayStart >= rangos.dayEnd) ***REMOVED***
      return 'La hora de inicio del turno diurno debe ser menor a la hora de fin';
    ***REMOVED***
    if (rangos.afternoonStart >= rangos.afternoonEnd) ***REMOVED***
      return 'La hora de inicio del turno de tarde debe ser menor a la hora de fin';
    ***REMOVED***
    if (rangos.dayEnd > rangos.afternoonStart) ***REMOVED***
      return 'El turno de tarde debe comenzar después o al mismo tiempo que termina el diurno';
    ***REMOVED***
    if (rangos.afternoonEnd > rangos.nightStart) ***REMOVED***
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
      
      await savePreferences(***REMOVED*** rangosTurnos ***REMOVED***);
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
        <TurnRange title="Turno Diurno" icon=***REMOVED***Sun***REMOVED*** iconColor="#F59E0B" thematicColors=***REMOVED***thematicColors***REMOVED***>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value=***REMOVED***rangosTurnos.dayStart***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                dayStart: value
              ***REMOVED***)***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
            />
            <TimeSelect
              label="Hora de fin"
              value=***REMOVED***rangosTurnos.dayEnd***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                dayEnd: value
              ***REMOVED***)***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
            />
          </div>
        </TurnRange>
        
        ***REMOVED***/* Turno Tarde */***REMOVED***
        <TurnRange title="Turno Tarde" icon=***REMOVED***Sunset***REMOVED*** iconColor="#F97316" thematicColors=***REMOVED***thematicColors***REMOVED***>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value=***REMOVED***rangosTurnos.afternoonStart***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                afternoonStart: value
              ***REMOVED***)***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
            />
            <TimeSelect
              label="Hora de fin"
              value=***REMOVED***rangosTurnos.afternoonEnd***REMOVED***
              onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
                ...rangosTurnos,
                afternoonEnd: value
              ***REMOVED***)***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
            />
          </div>
        </TurnRange>
        
        ***REMOVED***/* Turno Noche */***REMOVED***
        <TurnRange title="Turno Noche" icon=***REMOVED***Moon***REMOVED*** iconColor="#6366F1" thematicColors=***REMOVED***thematicColors***REMOVED***>
          <TimeSelect
            label="Hora de inicio"
            value=***REMOVED***rangosTurnos.nightStart***REMOVED***
            onChange=***REMOVED***(value) => setRangosTurnos(***REMOVED***
              ...rangosTurnos,
              nightStart: value
            ***REMOVED***)***REMOVED***
            thematicColors=***REMOVED***thematicColors***REMOVED***
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
        themeColor=***REMOVED***thematicColors?.base***REMOVED***
      >
        Guardar rangos de turnos
      </Button>
    </SettingsSection>
  );
***REMOVED***;

export default TurnRangeSection;