// src/components/settings/PreferencesSection/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Info, Receipt ***REMOVED*** from 'lucide-react'; // Cambié el icono a Wallet o Receipt para que tenga más sentido con "Pagos"
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Popover from '../../ui/Popover'; // Importamos el Popover

const PreferencesSection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    defaultDiscount,
    savePreferences
  ***REMOVED*** = useApp();
  
  const colors = useThemeColors();
  const [impuestoDefault, setImpuestoDefault] = useState(defaultDiscount);
  const [loading, setLoading] = useState(false);

  useEffect(() => ***REMOVED***
    setImpuestoDefault(defaultDiscount);
  ***REMOVED***, [defaultDiscount]);

  const handleSave = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      // Mantenemos la key 'defaultDiscount' o 'descuentoDefault' para compatibilidad con el backend/contexto
      // aunque visualmente le llamemos impuestos.
      await savePreferences(***REMOVED*** descuentoDefault: impuestoDefault ***REMOVED***);
      onSuccess?.('Configuración de impuestos guardada correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al guardar ajustes: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const popoverContent = (
    <div className="p-2 max-w-xs">
      <p className="text-sm text-gray-600 mb-2">
        Este porcentaje representa la <strong>retención</strong> que la empresa deduce de tu pago bruto antes de depositarte.
      </p>
      <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
        <li>Impuestos (Tax)</li>
        <li>Seguridad Social</li>
        <li>Otras deducciones obligatorias</li>
      </ul>
      <p className="text-xs text-gray-400 mt-3 border-t pt-2">
        * El 15% es un valor común para contratos casuales, pero deberías verificar tu caso específico.
      </p>
    </div>
  );

  return (
    <SettingsSection icon=***REMOVED***Receipt***REMOVED*** title="Configuración de Pagos e Impuestos">
      <div className="space-y-5">

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Porcentaje de Impuestos / Deducciones
            </label>
            
            ***REMOVED***/* Implementación del Popover */***REMOVED***
            <Popover 
              content=***REMOVED***popoverContent***REMOVED*** 
              title="¿Qué son estos impuestos?"
              position="top"
              trigger="click"
            >
              <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none">
                <Info size=***REMOVED***14***REMOVED*** />
                <span>¿Qué debo poner aquí?</span>
              </button>
            </Popover>
          </div>

          <div className="relative">
            <div className="flex rounded-md shadow-sm">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value=***REMOVED***impuestoDefault***REMOVED***
                onChange=***REMOVED***(e) => setImpuestoDefault(Number(e.target.value))***REMOVED***
                className="flex-1 px-3 py-2.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-gray-900 font-medium"
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary, borderColor: loading ? 'transparent' : '' ***REMOVED******REMOVED***
                placeholder="Ej: 15"
              />
              <span className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 font-medium">
                %
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Este valor se aplicará automáticamente a los nuevos trabajos, pero podrás ajustarlo individualmente si es necesario.
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <Button
            onClick=***REMOVED***handleSave***REMOVED***
            disabled=***REMOVED***loading***REMOVED***
            loading=***REMOVED***loading***REMOVED***
            className="w-full sm:w-auto"
            themeColor=***REMOVED***colors.primary***REMOVED***
          >
            Guardar Preferencias
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default PreferencesSection;