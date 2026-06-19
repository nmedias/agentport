import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { RiCheckLine, RiSubtractLine } from '@remixicon/react';

import { cn } from '@/lib/utils';

// Public API. The curated subset of the Radix Checkbox surface is re-declared here as
// FLAT, own props so react-docgen can extract it (the default docgen propFilter drops
// anything declared in node_modules — i.e. the inherited Radix/DOM props). Omit those keys
// from the inherited type first, then re-add them with JSDoc → one declaration each,
// attributed to this file. Native types are kept exactly (checked is `boolean | 'indeterminate'`,
// = Radix CheckedState) — narrowing would break callers. Everything else Radix accepts still
// passes through via the untouched rest of the base type.
interface CheckboxProps
  extends Omit<
    React.ComponentProps<typeof CheckboxPrimitive.Root>,
    'checked' | 'defaultChecked' | 'onCheckedChange' | 'disabled' | 'required' | 'name' | 'value'
  > {
  /** Controlled checked state (pair with `onCheckedChange`). Accepts `"indeterminate"`. */
  checked?: boolean | 'indeterminate';
  /**
   * Checked state when uncontrolled.
   * @default false
   */
  defaultChecked?: boolean | 'indeterminate';
  /** Called when the checked state changes. */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
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
   * Value submitted when checked.
   * @default "on"
   */
  value?: string;
}

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer relative flex size-4 shrink-0 items-center justify-center corner-sm border border-input-border bg-input-fill transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-destructive aria-invalid:aria-checked:bg-destructive aria-invalid:aria-checked:text-destructive-ink aria-invalid:data-[state=indeterminate]:border-destructive aria-invalid:data-[state=indeterminate]:bg-destructive aria-invalid:data-[state=indeterminate]:text-destructive-ink data-checked:border-primary-fill data-checked:bg-primary-fill data-checked:text-primary-ink data-[state=indeterminate]:border-primary-fill data-[state=indeterminate]:bg-primary-fill data-[state=indeterminate]:text-primary-ink',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        {/* Both icons mount with the Indicator; its data-state picks which one shows — a check
            for `checked`, a dash for `indeterminate`. Unchecked unmounts the Indicator entirely. */}
        <RiCheckLine className="hidden [[data-state=checked]_&]:block" />
        <RiSubtractLine className="hidden [[data-state=indeterminate]_&]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
export type { CheckboxProps };
