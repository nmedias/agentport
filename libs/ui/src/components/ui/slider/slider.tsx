'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Public API. The curated subset of the Radix Slider.Root surface is re-declared here as
// FLAT, own props so react-docgen can extract it (the default docgen propFilter drops
// anything declared in node_modules — i.e. the inherited Radix/DOM props — so JSDoc on
// `ComponentProps<typeof Root>` would never surface). Omit those keys from the inherited
// type first, then re-add them with JSDoc → one declaration each, attributed to this file.
// Everything else Radix accepts still passes through via the untouched rest of the base type.
interface SliderProps
  extends Omit<
    React.ComponentProps<typeof SliderPrimitive.Root>,
    | 'value'
    | 'defaultValue'
    | 'onValueChange'
    | 'onValueCommit'
    | 'min'
    | 'max'
    | 'step'
    | 'minStepsBetweenThumbs'
    | 'orientation'
    | 'inverted'
    | 'disabled'
    | 'name'
  > {
  /** Controlled value — one number per thumb (two values render a range). Pair with `onValueChange`. */
  value?: number[];
  /**
   * Uncontrolled value — one number per thumb (two values render a range).
   * @default [min, max]
   */
  defaultValue?: number[];
  /** Called as the value changes during a drag. */
  onValueChange?: (value: number[]) => void;
  /** Called once when the drag ends (commit). */
  onValueCommit?: (value: number[]) => void;
  /**
   * Lowest selectable value.
   * @default 0
   */
  min?: number;
  /**
   * Highest selectable value.
   * @default 100
   */
  max?: number;
  /**
   * Stepping interval.
   * @default 1
   */
  step?: number;
  /** Minimum number of steps to keep between two thumbs of a range. */
  minStepsBetweenThumbs?: number;
  /**
   * Track direction.
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  /** Fills the track from the max end instead of the min end. */
  inverted?: boolean;
  /**
   * Prevents interaction and dims the control.
   * @default false
   */
  disabled?: boolean;
  /** Form field name submitted with the form. */
  name?: string;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}: SliderProps) {
  // Thumb count is data-driven: one Slider.Thumb per value. Two values render a range
  // (the Range fill spans between the thumbs); fall back to [min, max] when uncontrolled
  // and no defaultValue (Radix then renders a single thumb at min).
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden corner-full bg-input-fill-high data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary-fill select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        // role="slider" lives on the thumb, not the Root — so the accessible name must ride
        // here, or axe's aria-input-field-name fails. Forward the consumer's aria-label /
        // aria-labelledby to every thumb (a range reuses the one name for both).
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className="relative block size-3 shrink-0 corner-full border border-input-border bg-surface ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-[3px] focus-visible:ring-[3px] focus-visible:outline-hidden active:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
export type { SliderProps };
