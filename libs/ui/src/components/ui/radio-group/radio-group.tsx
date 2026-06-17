import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn radio-group to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6). Two parts:
//
//  RadioGroup — pure layout container (no state, no DS surface). Only the gap is
//  a DS mapping: grid w-full stays structural; gap-2 (8px) → gap-md (§3, by value).
//  orientation="horizontal" lays the options in a row: Radix mirrors the prop onto
//  the root as data-orientation (via RovingFocusGroup, asChild-merged here), so the
//  container keys a grid-flow-col/auto-cols-max row off data-[orientation=horizontal]
//  (default vertical = the single-column grid). Stock shadcn ignores orientation
//  visually — this is a DS addition.
//
//  RadioGroupItem — the interactive control (state axis: default · checked ·
//  focus · disabled · invalid, + checked-invalid). DS re-clothe:
//   · rounded-full → corner-full — the DS radius vocabulary; all rounded-* are
//     dead under the theme reset (§2/§6). Applies to the ring and the inner dot.
//   · border-input-border + bg-input-fill — the form-control border + (opaque)
//     unchecked fill tokens (focus → ring).
//   · data-checked:{border,bg}-primary-fill + text-primary-ink → primary-fill
//     tokens (dark filled circle for selection); the inner dot is bg-primary-ink
//     (the on-primary-fill token) so it reads on the filled circle.
//   · focus-visible:border-ring + ring-ring/50 ring-3 → ring-[3px] (match the
//     Input focus convention; ring-3 ≈ 3px).
//   · aria-invalid:border-destructive + ring-destructive/20 — ⚠ destructive is a
//     PLACEHOLDER token (stock hex, not designed); bound but not finalized. The
//     destructive ring is FOCUS-GATED (width from focus-visible:ring-[3px] only, no
//     aria-invalid:ring-[3px]): invalid alone = destructive border, the red ring
//     appears on invalid+focus — matches .Input / .Checkbox. Deviates from
//     default-shadcn (ships ring-3); Figma invalid member still has the always-on
//     glow → invalid-focus member is the pending Figma re-sync.
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
      className={cn(
        'grid w-full gap-md data-[orientation=horizontal]:w-fit data-[orientation=horizontal]:grid-flow-col data-[orientation=horizontal]:auto-cols-max',
        className,
      )}
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
