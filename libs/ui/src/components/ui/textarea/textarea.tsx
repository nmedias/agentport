import * as React from 'react';

import { cn } from '@/lib/utils';

// Public API. Textarea spreads the native <textarea> surface, but the default docgen
// propFilter drops every DOM/aria attribute (declared in node_modules) — so the curated
// subset that drives the DS state language is surfaced here as FLAT, own props: Omit the
// keys from ComponentProps<'textarea'> first, then re-add them with JSDoc → one declaration
// each, attributed to this file → react-docgen extracts them. Everything else the native
// <textarea> accepts (aria-invalid and the rest of the DOM/aria attrs) still passes through
// via the untouched rest of the base type.
interface TextareaProps
  extends Omit<React.ComponentProps<'textarea'>, 'placeholder' | 'rows' | 'defaultValue' | 'disabled'> {
  /** Placeholder shown while empty (`text-input-ink-placeholder`). */
  placeholder?: string;
  /** Initial visible text rows; the box still auto-grows with content. */
  rows?: number;
  /** Initial value when uncontrolled (the filled state). */
  defaultValue?: string | number | readonly string[];
  /**
   * Prevents interaction and dims the control (opacity-50, no pointer events).
   * @default false
   */
  disabled?: boolean;
}

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content min-h-16 w-full corner-lg border border-input-border bg-input-fill px-md py-md text-format-label-md transition-[color,box-shadow] outline-none selection:bg-primary-fill selection:text-primary-ink placeholder:text-input-ink-placeholder disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps };
