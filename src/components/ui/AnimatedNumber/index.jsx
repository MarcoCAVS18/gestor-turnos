// src/components/ui/AnimatedNumber/index.jsx
// Rolling-digit numbers (NumberFlow by Max Barvian, MIT) with Orary defaults.
//
// - Only the digits that change roll, on spring-like timing; digits that
//   appear or disappear (9.99 -> 10.00) grow/shrink in width, so nothing jumps.
// - Formats match the rest of the app (utils/currency.js uses en-AU / AUD).
// - `highlight`: a short colour flash when the value goes up (and optionally
//   down), for changes the user caused: a shift logged, a week navigated.
// - `continuous`: odometer mode for values that tick constantly (Live Mode).
// - Respects the OS "reduce motion" setting; screen readers get the value.
//
// Use for headline numbers only, not for long lists.

import React, { useEffect, useRef, useState } from 'react';
import NumberFlow, { NumberFlowGroup, continuous as continuousPlugin } from '@number-flow/react';

// Same locale as formatCurrency / formatCurrencyExact
const LOCALE = 'en-AU';

export const NUMBER_FORMATS = {
  currency: { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 },
  currencyExact: { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  decimal2: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  hours: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  days: { minimumFractionDigits: 0, maximumFractionDigits: 1 },
  integer: { maximumFractionDigits: 0 },
};

const FLASH_MS = 900;
const FLASH_COLORS = { up: '#10B981', down: '#F43F5E' };

/**
 * @param {number} value
 * @param {keyof NUMBER_FORMATS | Intl.NumberFormatOptions} [format='integer']
 * @param {boolean|'both'} [highlight=false] - true: flash on increase; 'both': also on decrease
 * @param {boolean} [continuous=false] - odometer mode for constantly ticking values
 */
const AnimatedNumber = ({
  value,
  format = 'integer',
  prefix,
  suffix,
  highlight = false,
  continuous = false,
  className = '',
  style,
  ...rest
}) => {
  const previous = useRef(value);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    const prev = previous.current;
    previous.current = value;
    if (!highlight || typeof prev !== 'number' || typeof value !== 'number' || prev === value) return undefined;
    const direction = value > prev ? 'up' : 'down';
    if (direction === 'down' && highlight !== 'both') return undefined;
    setFlash(direction);
    const timer = setTimeout(() => setFlash(null), FLASH_MS);
    return () => clearTimeout(timer);
  }, [value, highlight]);

  // Non-numeric placeholders ("—") render as plain text
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return <span className={className} style={style}>{value ?? ''}</span>;
  }

  return (
    <NumberFlow
      value={value}
      locales={LOCALE}
      format={typeof format === 'string' ? NUMBER_FORMATS[format] : format}
      prefix={prefix}
      suffix={suffix}
      plugins={continuous ? [continuousPlugin] : undefined}
      className={className}
      style={{
        ...style,
        ...(flash ? { color: FLASH_COLORS[flash] } : {}),
        transition: 'color 600ms ease',
      }}
      {...rest}
    />
  );
};

const TWO_DIGITS = { minimumIntegerDigits: 2 };
// Minute and second tens only go 0-5, so 59 -> 00 rolls forward, not back
const SEXAGESIMAL = { 1: { max: 5 } };

/**
 * Elapsed time as HH:MM:SS with the three parts rolling in sync.
 * @param {{ hours: number, minutes: number, seconds: number }} time
 */
export const AnimatedClock = ({ time, className = '', showSeconds = true }) => {
  const { hours = 0, minutes = 0, seconds = 0 } = time || {};
  return (
    <span className={`inline-flex items-baseline tabular-nums ${className}`}>
      <NumberFlowGroup>
        <NumberFlow value={hours} format={TWO_DIGITS} trend={1} />
        <NumberFlow value={minutes} format={TWO_DIGITS} digits={SEXAGESIMAL} trend={1} prefix=":" />
        {showSeconds && <NumberFlow value={seconds} format={TWO_DIGITS} digits={SEXAGESIMAL} trend={1} prefix=":" />}
      </NumberFlowGroup>
    </span>
  );
};

export default AnimatedNumber;
