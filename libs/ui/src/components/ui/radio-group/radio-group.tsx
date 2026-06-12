import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn radio-group to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6). Two parts:
//
//  RadioGroup — pure layout container (no state, no DS surface). Only the gap is
//  a DS mapping: grid w-full stays structural; gap-2 (8px) → gap-md (§3, by value).
//
//  RadioGroupItem — the interactive control (state axis: default · checked ·
//  focus · disabled · invalid, + checked-invalid). DS re-clothe:
//   · rounded-full → corner-full — the DS radius vocabulary; all rounded-* are
//     dead under the theme reset (§2/§6). Applies to the ring and the inner dot.
//   · border-input + bg-input-background — the form-control border + (opaque)
//     unchecked fill tokens (focus → ring).
//   · data-checked:{border,bg}-primary + text-primary-foreground → primary tokens
//     (brand accent for selection); the inner dot is bg-primary-foreground (the
//     on-primary token) so it reads on the filled circle.
//   · focus-visible:border-ring + ring-ring/50 ring-3 → ring-[3px] (match the
//     Input focus convention; ring-3 ≈ 3px).
//   · aria-invalid:border-destructive + ring-destructive/20 — ⚠ destructive is a
//     PLACEHOLDER token (stock hex, not designed); bound but not finalized.
//   · aria-invalid:aria-checked:{border,bg}-destructive + the dot's
//     group-aria-invalid/…:bg-destructive-foreground — checked-invalid is fully
//     error-tinted (error wins over selection); overrides the data-checked primary
//     fill/border and the dot's primary-foreground.
//   · size-4 / size-2 (dot) / aspect-square / after:-inset-* stay numeric
//     (geometry ≠ spacing token). All dark: variants dropped (no dark mode yet).
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid w-full gap-md', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 corner-full border border-input bg-input-background outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground aria-invalid:aria-checked:border-destructive aria-invalid:aria-checked:bg-destructive',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 corner-full bg-primary-foreground group-aria-invalid/radio-group-item:bg-destructive-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
