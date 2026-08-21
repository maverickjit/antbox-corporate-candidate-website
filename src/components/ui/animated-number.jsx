'use client';

import NumberFlow from '@number-flow/react';

/**
 * AnimatedNumber
 * Wraps @number-flow/react with optional prefix/suffix.
 * Pass `animated={true}` and `value` to trigger the count-up.
 * When `animated` is false the value stays at 0 (start state).
 */
export default function AnimatedNumber({ value, prefix = '', suffix = '', animated = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0px' }}>
      {prefix && <span>{prefix}</span>}
      <NumberFlow
        value={animated ? value : 0}
        trend={1}
        format={{ notation: 'standard' }}
        transformTiming={{ duration: 900, easing: 'ease-out' }}
        spinTiming={{ duration: 900, easing: 'ease-out' }}
        opacityTiming={{ duration: 400, easing: 'ease-out' }}
      />
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
