import * as React from 'react';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn textarea to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6). Sibling of Input
// — same field tokens, same state language, taller box. Colour utilities track the
// live Figma .Textarea set after the -fill/-ink/-border token rework (synced
// 2026-06-17): surface bg-input-fill (Input/input-fill) · border-input-border
// (Input/input-border; focus → border-ring, invalid → border-destructive) ·
// placeholder:text-input-ink-placeholder (Input/input-ink-placeholder, Label style) ·
// typed value text-ink (shadcn Default/ink). text-base/md:text-sm → text-format-label
// (Label format, Medium 14 — the DS form-control text). selection re-clothed to the
// valid new names (bg-primary-fill / text-primary-ink — bg-primary no longer exists;
// no Figma signal, code idiom). disabled:bg-input/50 dropped (DS disabled = opacity
// dim only) · dark: dropped. Density on the radix-nova baseline mapped by NAME:
// corner-lg (DS 8px) · px-md / py-md (Space/space-md, 8px). min-h-16 stays numeric
// (geometry). field-sizing-content (auto-grow) kept. Focus = border-ring + ring/50
// ring-[3px] (drop-shadow ring @ 50%, spread 3); invalid = destructive border + ring/20.
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content min-h-16 w-full corner-lg border border-input-border bg-input-fill px-md py-md text-format-label transition-[color,box-shadow] outline-none selection:bg-primary-fill selection:text-primary-ink placeholder:text-input-ink-placeholder disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
