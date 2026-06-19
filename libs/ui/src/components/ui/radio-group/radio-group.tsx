import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Public API. The curated subset of each Radix part's surface is re-declared here as
// FLAT, own props so react-docgen can extract it (the default docgen propFilter drops
// anything declared in node_modules — the inherited Radix/DOM props — so JSDoc on
// `ComponentProps<typeof Root|Item>` would never surface). Omit those keys from the
// inherited type first, then re-add them with JSDoc → one declaration each, attributed
// to this file. Everything else Radix accepts still passes through via `...props`.
interface RadioGroupProps
  extends Omit<
    React.ComponentProps<typeof RadioGroupPrimitive.Root>,
    'value' | 'defaultValue' | 'onValueChange' | 'disabled' | 'required' | 'name' | 'orientation'
  > {
  /** Controlled selected value (pair with `onValueChange`). */
  value?: string;
  /** Selected value when uncontrolled. */
  defaultValue?: string;
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void;
  /**
   * Disables every item in the group.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the group required for native form validation.
   * @default false
   */
  required?: boolean;
  /** Form field name submitted with the form. */
  name?: string;
  /**
   * Arrow-key navigation direction.
   * @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical';
}

interface RadioGroupItemProps
  extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'value' | 'disabled' | 'id'> {
  /** Value selected (and form-submitted) when this item is chosen. */
  value: string;
  /**
   * Disables just this item. (The whole group can be disabled via `RadioGroup`.)
   * @default false
   */
  disabled?: boolean;
  /** Pairs the item with a `<label htmlFor>` for an accessible name. */
  id?: string;
}

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(
        'grid w-full gap-md data-[orientation=horizontal]:w-fit data-[orientation=horizontal]:grid-flow-col data-[orientation=horizontal]:auto-cols-max',
        className,
      )}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 corner-full border border-input-border bg-input-fill outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-checked:border-primary-fill data-checked:bg-primary-fill data-checked:text-primary-ink aria-invalid:aria-checked:border-destructive aria-invalid:aria-checked:bg-destructive',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 corner-full bg-primary-ink group-aria-invalid/radio-group-item:bg-destructive-ink" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
export type { RadioGroupProps, RadioGroupItemProps };
