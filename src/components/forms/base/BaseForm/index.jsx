// src/components/forms/base/BaseForm/index.jsx

import React from 'react';

/**
 * BaseForm - Componente base unificado para todos los formularios
 *
 * Características:
 * - Estructura de formulario consistente
 * - Estilos móviles optimizados (previene zoom en iOS)
 * - Grid responsivo integrado
 *
 * @param ***REMOVED***Object***REMOVED*** props
 * @param ***REMOVED***string***REMOVED*** props.id - ID del formulario para enlazar con botones externos
 * @param ***REMOVED***Function***REMOVED*** props.onSubmit - Función a ejecutar al enviar el formulario
 * @param ***REMOVED***boolean***REMOVED*** props.isMobile - Si está en vista móvil
 * @param ***REMOVED***ReactNode***REMOVED*** props.children - Contenido del formulario
 * @param ***REMOVED***string***REMOVED*** props.className - Clases adicionales para el contenedor
 */
const BaseForm = (***REMOVED***
  id,
  onSubmit,
  isMobile = false,
  children,
  className = ''
***REMOVED***) => ***REMOVED***
  return (
    <div
      className=***REMOVED***`w-full $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED***
        maxWidth: '100%',
        overflowX: 'hidden'
      ***REMOVED******REMOVED***
    >
      <form id=***REMOVED***id***REMOVED*** onSubmit=***REMOVED***onSubmit***REMOVED*** className="space-y-4 w-full">
        ***REMOVED***/* Contenido del formulario */***REMOVED***
        ***REMOVED***children***REMOVED***
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
export const FormGrid = (***REMOVED*** children, columns = 2, className = '' ***REMOVED***) => (
  <div className="w-full">
    <div className=***REMOVED***`grid grid-cols-$***REMOVED***columns***REMOVED*** gap-4 $***REMOVED***className***REMOVED***`***REMOVED***>
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
