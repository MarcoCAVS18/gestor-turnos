// src/components/settings/PreferencesSection/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Info, Receipt, Check } from 'lucide-react'; // Agregamos Check
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useTrabajos } from '../../../hooks/useTrabajos';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Popover from '../../ui/Popover';
import WorkAvatar from '../../work/WorkAvatar';

const PreferencesSection = ({ onError, onSuccess, className }) => {
  const { 
    defaultDiscount,
    impuestosPorTrabajo, // viene del context
    savePreferences
  } = useApp();
  const { trabajos } = useTrabajos();
  
  const colors = useThemeColors();
  
  // Estados de datos
  const [impuestoDefault, setImpuestoDefault] = useState(defaultDiscount || 0);
  const [impuestosLocales, setImpuestosLocales] = useState({});
  const [showMultiRate, setShowMultiRate] = useState(false);

  // Estados de UI/Feedback
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const traditionalJobs = useMemo(() => 
    (trabajos || []).filter(t => t.tipo === 'tradicional'),
    [trabajos]
  );

  // Inicializar estado local cuando cambia el contexto (carga inicial)
  useEffect(() => {
    setImpuestoDefault(defaultDiscount || 0);
  }, [defaultDiscount]);
  
  useEffect(() => {
    const initialImpuestos = {};
    traditionalJobs.forEach(job => {
      // La lógica de inicialización debe ser consistente
      initialImpuestos[job.id] = impuestosPorTrabajo[job.id] ?? defaultDiscount ?? 0;
    });
    setImpuestosLocales(initialImpuestos);
  }, [traditionalJobs, impuestosPorTrabajo, defaultDiscount]);

  // Efecto para detectar cambios (Dirty Checking)
  useEffect(() => {
    // 1. Verificar si el default cambió
    const defaultChanged = impuestoDefault !== (defaultDiscount || 0);

    // 2. Verificar si algún impuesto específico cambió
    const localesChanged = traditionalJobs.some(job => {
      const valorOriginal = impuestosPorTrabajo[job.id] ?? defaultDiscount ?? 0;
      const valorActual = impuestosLocales[job.id];
      // Comparamos valores (usamos == para ser tolerantes con strings/numbers si pasara, 
      // aunque aquí forzamos number en el input)
      return valorOriginal !== valorActual;
    });

    const isDirty = defaultChanged || localesChanged;
    setHasChanges(isDirty);

    // Si el usuario vuelve a editar, ocultamos el mensaje de éxito
    if (isDirty && showSuccess) {
      setShowSuccess(false);
    }

  }, [impuestoDefault, impuestosLocales, defaultDiscount, impuestosPorTrabajo, traditionalJobs, showSuccess]);

  const handleImpuestoLocalChange = (jobId, value) => {
    setImpuestosLocales(prev => ({
      ...prev,
      [jobId]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await savePreferences({ 
        descuentoDefault: impuestoDefault,
        impuestosPorTrabajo: impuestosLocales
      });
      
      // Mostrar éxito
      setShowSuccess(true);
      setHasChanges(false); // Asumimos guardado exitoso
      onSuccess?.('Configuración de impuestos guardada correctamente');

      // Ocultar mensaje de éxito después de 3s
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      onError?.('Error al guardar ajustes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
    <SettingsSection icon={Receipt} title="Configuración de Pagos e Impuestos" className={className}>
      <div className="space-y-5">

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Porcentaje de Impuestos / Deducciones (Default)
            </label>
            
            <Popover 
              content={popoverContent} 
              title="¿Qué son estos impuestos?"
              position="top"
              trigger="click"
            >
              <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none">
                <Info size={14} />
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
                value={impuestoDefault}
                onChange={(e) => setImpuestoDefault(Number(e.target.value))}
                className="flex-1 px-3 py-2.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-gray-900 font-medium"
                style={{ '--tw-ring-color': colors.primary, borderColor: loading ? 'transparent' : '' }}
                placeholder="Ej: 15"
              />
              <span className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 font-medium">
                %
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Este valor se aplicará por defecto si no especificas uno para un trabajo concreto.
            </p>
          </div>
        </div>

        {showMultiRate && traditionalJobs.length > 1 && (
          <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
            <h3 className="text-md font-semibold text-gray-800">Impuestos por Trabajo</h3>
            {traditionalJobs.map(job => (
              <div key={job.id} className="flex items-center gap-4">
                <WorkAvatar nombre={job.nombre} color={job.color} size="md" />
                <div className="flex-1">
                  <span className="font-medium text-gray-700">{job.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={impuestosLocales[job.id] || 0}
                    onChange={(e) => handleImpuestoLocalChange(job.id, Number(e.target.value))}
                    className="w-24 px-2 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-center"
                    style={{'--tw-ring-color': colors.primary}}
                    placeholder="Ej: 15"
                  />
                  <span className="text-gray-500 font-medium">%</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={loading || !hasChanges}
            loading={loading}
            className="w-full sm:w-auto min-w-[180px]"
            themeColor={colors.primary}
            icon={showSuccess ? Check : undefined}
          >
            {loading ? 'Guardando...' : 
             showSuccess ? 'Guardado correctamente' :
             hasChanges ? 'Guardar Preferencias' : 'Sin cambios'}
          </Button>

          {traditionalJobs.length > 1 && (
            <Button
              onClick={() => setShowMultiRate(prev => !prev)}
              variant="outline"
              themeColor={colors.primary}
              className="w-full sm:w-auto"
            >
              {showMultiRate ? 'Ocultar ajustes por trabajo' : 'Ajustar por trabajo'}
            </Button>
          )}
        </div>
      </div>
    </SettingsSection>
  );
};

export default PreferencesSection;