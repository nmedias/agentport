import * as React from 'react';

import { cn } from '@/lib/utils';

// Public API. Input spreads the full native <input> surface (ComponentProps<'input'>), but
// the default docgen propFilter drops every DOM attr (declared in node_modules) → none would
// surface. Take the curated subset out of the inherited base via Omit, then re-add each as a
// flat own prop with JSDoc → one declaration each, attributed to this file → react-docgen
// extracts them. The rest of the native surface (incl. aria-* a11y passthroughs) still flows
// through via the untouched base type + {...props}; aria-invalid/aria-label stay hand-curated
// in the story (hyphenated keys are docgen-unreliable).
interface InputProps
  extends Omit<
    React.ComponentProps<'input'>,
    'type' | 'placeholder' | 'defaultValue' | 'value' | 'disabled' | 'onChange'
  > {
  /**
   * Native input type — drives the keyboard/affordance. `file` switches to the file picker anatomy.
   * @default "text"
   */
  type?: React.HTMLInputTypeAttribute;
  /** Hint shown while empty — rendered in the dedicated `input-ink-placeholder` token. Not a label substitute. */
  placeholder?: string;
  /** Initial value when uncontrolled (the "filled" state). */
  defaultValue?: string | number | readonly string[];
  /** Controlled value (pair with `onChange`). */
  value?: string | number | readonly string[];
  /**
   * Native disabled — blocks interaction and dims the field (`opacity-50`).
   * @default false
   */
  disabled?: boolean;
  /** Change handler (required when controlling `value`). */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-8 w-full min-w-0 corner-lg border border-input-border bg-input-fill px-md py-xs text-format-label transition-[color,box-shadow] outline-none selection:bg-primary-fill selection:text-primary-ink file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-format-label file:text-ink placeholder:text-input-ink-placeholder disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
