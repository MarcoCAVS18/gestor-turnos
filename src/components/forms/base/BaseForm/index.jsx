// src/components/forms/base/BaseForm/index.jsx

import React from 'react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';

/**
 * BaseForm - Componente base unificado para todos los formularios
 *
 * Características:
 * - Estructura de formulario consistente
 * - Botones responsivos de Cancelar/Guardar
 * - Estilos móviles optimizados (previene zoom en iOS)
 * - Soporte para estados de loading
 * - Grid responsivo integrado
 *
 * @param ***REMOVED***Object***REMOVED*** props
 * @param ***REMOVED***Function***REMOVED*** props.onSubmit - Función a ejecutar al enviar el formulario
 * @param ***REMOVED***Function***REMOVED*** props.onCancel - Función a ejecutar al cancelar
 * @param ***REMOVED***boolean***REMOVED*** props.loading - Estado de carga
 * @param ***REMOVED***boolean***REMOVED*** props.isMobile - Si está en vista móvil
 * @param ***REMOVED***string***REMOVED*** props.submitText - Texto del botón de enviar (default: "Guardar")
 * @param ***REMOVED***string***REMOVED*** props.cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param ***REMOVED***boolean***REMOVED*** props.isEditing - Si está editando (cambia texto a "Actualizar")
 * @param ***REMOVED***ReactNode***REMOVED*** props.children - Contenido del formulario
 * @param ***REMOVED***string***REMOVED*** props.className - Clases adicionales para el contenedor
 */
const BaseForm = (***REMOVED***
  onSubmit,
  onCancel,
  loading = false,
  isMobile = false,
  submitText,
  cancelText = 'Cancelar',
  isEditing = false,
  children,
  className = ''
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Determinar texto del botón de enviar
  const defaultSubmitText = isEditing ? 'Actualizar' : 'Guardar';
  const finalSubmitText = submitText || defaultSubmitText;

  return (
    <div
      className=***REMOVED***`w-full $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED***
        maxWidth: '100%',
        overflowX: 'hidden'
      ***REMOVED******REMOVED***
    >
      <form onSubmit=***REMOVED***onSubmit***REMOVED*** className="space-y-4 w-full">
        ***REMOVED***/* Contenido del formulario */***REMOVED***
        ***REMOVED***children***REMOVED***

        ***REMOVED***/* Botones de acción */***REMOVED***
        <div className=***REMOVED***`
          w-full pt-6
          $***REMOVED***isMobile ? 'flex flex-col space-y-4 px-0' : 'flex space-x-3'***REMOVED***
        `***REMOVED***>
          <button
            type="button"
            onClick=***REMOVED***onCancel***REMOVED***
            disabled=***REMOVED***loading***REMOVED***
            className=***REMOVED***`
              border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
              text-sm font-medium rounded-lg transition-colors disabled:opacity-50
              $***REMOVED***isMobile ? 'py-4 px-4 w-full order-2' : 'flex-1 py-2 px-4'***REMOVED***
            `***REMOVED***
          >
            ***REMOVED***cancelText***REMOVED***
          </button>

          <button
            type="submit"
            disabled=***REMOVED***loading***REMOVED***
            className=***REMOVED***`
              text-white rounded-lg hover:opacity-90 text-sm font-medium
              disabled:opacity-50 transition-colors
              $***REMOVED***isMobile ? 'py-4 px-4 w-full order-1' : 'flex-1 py-2 px-4'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            onMouseEnter=***REMOVED***(e) => ***REMOVED***
              if (!loading) ***REMOVED***
                e.target.style.backgroundColor = colors.primaryDark;
              ***REMOVED***
            ***REMOVED******REMOVED***
            onMouseLeave=***REMOVED***(e) => ***REMOVED***
              if (!loading) ***REMOVED***
                e.target.style.backgroundColor = colors.primary;
              ***REMOVED***
            ***REMOVED******REMOVED***
          >
            ***REMOVED***loading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="h-4 w-4" color="border-white" />
                <span>Guardando...</span>
              </div>
            ) : (
              finalSubmitText
            )***REMOVED***
          </button>
        </div>
      </form>

      ***REMOVED***/* Estilos adicionales para móvil - previene zoom en iOS */***REMOVED***
      ***REMOVED***isMobile && (
        <style jsx>***REMOVED***`
          .mobile-form input[type="date"],
          .mobile-form input[type="time"],
          .mobile-form input[type="number"],
          .mobile-form input[type="text"],
          .mobile-form select,
          .mobile-form textarea ***REMOVED***
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            font-size: 16px !important;
          ***REMOVED***

          .mobile-form input[type="time"]::-webkit-calendar-picker-indicator,
          .mobile-form input[type="date"]::-webkit-calendar-picker-indicator ***REMOVED***
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
          ***REMOVED***
        `***REMOVED***</style>
      )***REMOVED***
    </div>
  );
***REMOVED***;

/**
 * FormSection - Componente auxiliar para secciones de formulario
 * Proporciona un contenedor con estilos consistentes
 */
export const FormSection = (***REMOVED*** children, className = '' ***REMOVED***) => (
  <div className=***REMOVED***`w-full $***REMOVED***className***REMOVED***`***REMOVED***>
    ***REMOVED***children***REMOVED***
  </div>
);

/**
 * FormGrid - Componente auxiliar para grids responsivos
 * Maneja automáticamente el layout móvil/desktop
 */
export const FormGrid = (***REMOVED*** children, columns = 2, isMobile = false, className = '' ***REMOVED***) => (
  <div className="w-full">
    <div className=***REMOVED***`grid gap-4 $***REMOVED***isMobile ? 'grid-cols-1' : `grid-cols-$***REMOVED***columns***REMOVED***`***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***>
      ***REMOVED***children***REMOVED***
    </div>
  </div>
);

/**
 * FormField - Componente auxiliar para campos individuales
 * Proporciona estructura consistente con label, input y error
 */
export const FormField = (***REMOVED***
  children,
  className = ''
***REMOVED***) => (
  <div className=***REMOVED***`w-full min-w-0 $***REMOVED***className***REMOVED***`***REMOVED***>
    ***REMOVED***children***REMOVED***
  </div>
);

/**
 * FormLabel - Componente auxiliar para labels consistentes
 */
export const FormLabel = (***REMOVED***
  children,
  icon: Icon,
  className = ''
***REMOVED***) => (
  <label className=***REMOVED***`block text-sm font-medium text-gray-700 mb-2 $***REMOVED***className***REMOVED***`***REMOVED***>
    ***REMOVED***Icon && <Icon size=***REMOVED***16***REMOVED*** className="inline mr-2" />***REMOVED***
    ***REMOVED***children***REMOVED***
  </label>
);

/**
 * FormError - Componente auxiliar para mostrar errores
 */
export const FormError = (***REMOVED*** error, size = 'xs' ***REMOVED***) => ***REMOVED***
  if (!error) return null;
  return (
    <p className=***REMOVED***`text-red-500 text-$***REMOVED***size***REMOVED*** mt-1`***REMOVED***>***REMOVED***error***REMOVED***</p>
  );
***REMOVED***;

/**
 * getInputClasses - Función auxiliar para clases de inputs
 * Proporciona clases consistentes para todos los inputs
 */
export const getInputClasses = (isMobile = false, hasError = false) => ***REMOVED***
  const baseClasses = `
    w-full px-3 py-3 border rounded-lg text-base transition-colors
    focus:outline-none focus:ring-2 focus:border-transparent
    $***REMOVED***isMobile ? 'text-base min-h-[44px]' : 'text-sm py-2'***REMOVED***
    $***REMOVED***hasError ? 'border-red-500' : 'border-gray-300'***REMOVED***
  `;
  return baseClasses.trim();
***REMOVED***;

export default BaseForm;
