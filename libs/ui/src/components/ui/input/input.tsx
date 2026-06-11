import * as React from 'react';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn input to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6):
//  bg-transparent → bg-input-background (DS fields are opaque, carried by the
//  input border) · text-base/md:text-sm → text-label (Figma DS uses the Label
//  format for form-control text, Medium 14 — same as Button) · shadow-xs dropped
//  (DS is flat) · placeholder:text-muted-foreground → placeholder:text-input-placeholder
//  (dedicated token) · file:text-sm/font-medium → file:text-label.
//  Density follows the radix-nova baseline (mapped by NAME, not Nova's --radius
//  scale): h-8 (32) · corner-lg (DS 8px) · px-2.5(10)→px-md(8) · py-1→py-xs(4) ·
//  file:h-6. Control height stays numeric. Focus = border-ring + ring/50 ring-[3px];
//  invalid = destructive (⚠ placeholder token) border + ring/20. dark: dropped.
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-8 w-full min-w-0 corner-lg border border-input bg-input-background px-md py-xs text-label transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-label file:text-foreground placeholder:text-input-placeholder disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
