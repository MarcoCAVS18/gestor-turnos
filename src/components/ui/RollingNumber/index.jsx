// src/components/ui/RollingNumber/index.jsx
// Contador tipo odómetro (patrón predict.fun): cada dígito es una columna 0-9
// recortada con overflow-hidden que se desliza con translateY hasta el dígito
// actual. CSS puro, sin dependencias. Hereda color, fuente y tamaño del padre;
// los caracteres no numéricos ($ , . : h espacios) se renderizan estáticos.
//
// La geometría es autosuficiente: un placeholder invisible define el alto y
// ancho de la celda para cualquier tipografía (nada de alturas hardcodeadas),
// y la columna absoluta usa translateY en % de esa celda.

import React from 'react';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const RollingNumber = ({ value, durationMs = 750, className = '' }) => {
  const str = String(value ?? '');

  return (
    <span className={`relative inline-flex tabular-nums ${className}`}>
      {/* Valor real para lectores de pantalla; lo visual queda aria-hidden */}
      <span className="sr-only">{str}</span>

      {[...str].map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} aria-hidden="true" className="inline-block whitespace-pre">
              {ch}
            </span>
          );
        }
        const d = parseInt(ch, 10);
        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block overflow-hidden"
          >
            {/* Placeholder invisible: fija el ancho y alto de la celda */}
            <span className="opacity-0">{ch}</span>
            {/* Columna 0-9: translateY(-d × 100%) de la altura de la celda */}
            <span
              className="absolute inset-0 block motion-reduce:transition-none"
              style={{
                transform: `translateY(-${d * 100}%)`,
                transitionProperty: 'transform',
                transitionDuration: `${durationMs}ms`,
                transitionTimingFunction: 'ease',
              }}
            >
              {DIGITS.map((n) => (
                <span key={n} className="flex h-full items-center justify-center">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default RollingNumber;
