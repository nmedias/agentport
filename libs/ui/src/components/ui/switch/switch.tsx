'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Public API. The curated subset of the Radix Switch surface is re-declared here as
// FLAT, own props so react-docgen can extract it (the default docgen propFilter drops
// anything declared in node_modules — i.e. the inherited Radix/DOM props — so JSDoc on
// `ComponentProps<typeof Root>` would never surface). Omit those keys from the inherited
// type first, then re-add them with JSDoc → one declaration each, attributed to this file.
// Everything else Radix accepts still passes through via the untouched rest of the base type.
interface SwitchProps
  extends Omit<
    React.ComponentProps<typeof SwitchPrimitive.Root>,
    'checked' | 'defaultChecked' | 'onCheckedChange' | 'disabled' | 'required' | 'name' | 'value'
  > {
  /**
   * DS size variant — sets the track + thumb geometry.
   * @default "default"
   */
  size?: 'sm' | 'default';
  /** Controlled on/off state (pair with `onCheckedChange`). */
  checked?: boolean;
  /**
   * On/off state when uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;
  /** Called when the on/off state changes. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Prevents interaction and dims the control (and its Field label via group styling).
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the control required for native form validation.
   * @default false
   */
  required?: boolean;
  /** Form field name submitted with the form. */
  name?: string;
  /**
   * Value submitted when on.
   * @default "on"
   */
  value?: string;
}

function Switch({ className, size = 'default', ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center corner-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-primary-fill data-unchecked:bg-input-fill-high aria-invalid:data-checked:bg-destructive data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block corner-full bg-surface ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
export type { SwitchProps };
