// src/components/settings/PreferencesSection/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const PreferencesSection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    descuentoDefault: appDescuento, 
    guardarPreferencias,
    coloresTemáticos 
  ***REMOVED*** = useApp();
  
  const [descuentoDefault, setDescuentoDefault] = useState(appDescuento);
  const [loading, setLoading] = useState(false);

  useEffect(() => ***REMOVED***
    setDescuentoDefault(appDescuento);
  ***REMOVED***, [appDescuento]);

  const handleSave = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      await guardarPreferencias(***REMOVED*** descuentoDefault ***REMOVED***);
      onSuccess?.('Configuración guardada correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al guardar ajustes: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***Clock***REMOVED*** title="Configuración de trabajo">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Porcentaje de descuento
        </label>
        <div className="flex rounded-md shadow-sm">
          <input
            type="number"
            min="0"
            max="100"
            value=***REMOVED***descuentoDefault***REMOVED***
            onChange=***REMOVED***(e) => setDescuentoDefault(Number(e.target.value))***REMOVED***
            className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2"
            style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
            placeholder="15"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            %
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Este descuento se aplicará por defecto a todos tus turnos y trabajos. Podrás modificarlo más adelante.
        </p>
        
        <Button
          onClick=***REMOVED***handleSave***REMOVED***
          disabled=***REMOVED***loading***REMOVED***
          loading=***REMOVED***loading***REMOVED***
          className="w-full mt-4"
        >
          Guardar cambios
        </Button>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default PreferencesSection;