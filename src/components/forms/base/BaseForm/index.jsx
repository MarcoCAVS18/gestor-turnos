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
 * @param {Object} props
 * @param {string} props.id - ID del formulario para enlazar con botones externos
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {boolean} props.isMobile - Si está en vista móvil
 * @param {ReactNode} props.children - Contenido del formulario
 * @param {string} props.className - Clases adicionales para el contenedor
 */
const BaseForm = ({
  id,
  onSubmit,
  isMobile = false,
  children,
  className = ''
}) => {
  return (
    <div
      className={`w-full ${isMobile ? 'mobile-form' : ''} ${className}`}
      style={{
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      <form id={id} onSubmit={onSubmit} className="space-y-4 w-full">
        {/* Contenido del formulario */}
        {children}
      </form>

      {/* Estilos adicionales para móvil - previene zoom en iOS */}
      {isMobile && (
        <style jsx>{`
          .mobile-form input[type="date"],
          .mobile-form input[type="time"],
          .mobile-form input[type="number"],
          .mobile-form input[type="text"],
          .mobile-form select,
          .mobile-form textarea {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            font-size: 16px !important;
          }

          .mobile-form input[type="time"]::-webkit-calendar-picker-indicator,
          .mobile-form input[type="date"]::-webkit-calendar-picker-indicator {
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
          }
        `}</style>
      )}
    </div>
  );
};

/**
 * FormSection - Componente auxiliar para secciones de formulario
 * Proporciona un contenedor con estilos consistentes
 */
export const FormSection = ({ children, className = '' }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
);

/**
 * FormGrid - Componente auxiliar para grids responsivos
 * Maneja automáticamente el layout móvil/desktop
 */
export const FormGrid = ({ children, columns = 2, isMobile = false, className = '' }) => (
  <div className="w-full">
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : `grid-cols-${columns}`} ${className}`}>
      {children}
    </div>
  </div>
);

/**
 * FormField - Componente auxiliar para campos individuales
 * Proporciona estructura consistente con label, input y error
 */
export const FormField = ({
  children,
  className = ''
}) => (
  <div className={`w-full min-w-0 ${className}`}>
    {children}
  </div>
);

/**
 * FormLabel - Componente auxiliar para labels consistentes
 */
export const FormLabel = ({
  children,
  icon: Icon,
  className = ''
}) => (
  <label className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
    {Icon && <Icon size={16} className="inline mr-2" />}
    {children}
  </label>
);

/**
 * FormError - Componente auxiliar para mostrar errores
 */
export const FormError = ({ error, size = 'xs' }) => {
  if (!error) return null;
  return (
    <p className={`text-red-500 text-${size} mt-1`}>{error}</p>
  );
};

/**
 * getInputClasses - Función auxiliar para clases de inputs
 * Proporciona clases consistentes para todos los inputs
 */
export const getInputClasses = (isMobile = false, hasError = false) => {
  const baseClasses = `
    w-full px-3 py-3 border rounded-lg text-base transition-colors
    focus:outline-none focus:ring-2 focus:border-transparent
    ${isMobile ? 'text-base min-h-[44px]' : 'text-sm py-2'}
    ${hasError ? 'border-red-500' : 'border-gray-300'}
  `;
  return baseClasses.trim();
};

export default BaseForm;
