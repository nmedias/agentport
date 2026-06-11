import * as React from 'react';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn textarea to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6). Sibling of Input
// — same field tokens, same state language, taller box:
//  bg-transparent → bg-input-background (DS fields are opaque, carried by the
//  input border) · text-base/md:text-sm → text-format-label (Label format, Medium 14 —
//  the DS form-control text, same as Input/Button) · placeholder:text-muted-
//  foreground → placeholder:text-input-placeholder (dedicated field token) ·
//  disabled:bg-input/50 dropped (DS disabled = opacity dim only) · dark: dropped.
//  Density on the radix-nova baseline mapped by NAME: corner-lg (DS 8px) ·
//  px-2.5(10)→px-md(8) · py-2(8)→py-md(8). min-h-16 stays numeric (geometry).
//  field-sizing-content (auto-grow) kept. Focus = border-ring + ring/50 ring-[3px];
//  invalid = destructive (⚠ placeholder token) border + ring/20.
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content min-h-16 w-full corner-lg border border-input bg-input-background px-md py-md text-format-label transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-input-placeholder disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
