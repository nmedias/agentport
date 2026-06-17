import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { RiCheckLine } from '@remixicon/react';

import { cn } from '@/lib/utils';





// Token-faithful port of the shadcn checkbox to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6). No CVA → the axis
// is checked × state, matching the Figma .Checkbox set (3795:1184): default ·
// focus · disabled · invalid · focus-invalid, per checked=off/on.
//
// DS re-clothe (colour bindings verified live in Figma 2026-06-17, -fill/-ink rework):
//  · rounded-[4px] → corner-sm — the DS 4px radius for small controls/markers;
//    all rounded-* are dead under the theme reset (§2/§6), corner-* is the only
//    radius vocabulary.
//  · default/focus/disabled/invalid box fill → bg-input-fill (Figma Input/input-fill;
//    was bg-input-background, renamed in the -fill/-ink rework — the unchecked box
//    is opaque, not transparent).
//  · border-input-border — DS Form-Control-Border token (Figma Input/input-border;
//    was border-input). Control edge; focus hands off to the ring.
//  · data-checked:{bg,border}-primary-fill + text-primary-ink — the checked box is
//    the dark Primary surface (Figma shadcn Default/primary-fill on both fill and
//    stroke) with the glyph riding it in primary-ink (Figma shadcn Default/primary-ink).
//    NB bg-primary does NOT exist — primary is the accent text/border/ring tone; the
//    filled surface binds primary-fill.
//  · focus border-ring + ring-ring/50 ring-[3px] — mirrors the Input focus ring
//    (ring-[3px], not ring-3, to match the sibling field convention). Figma focus
//    members stroke shadcn Default/ring + a #4a5562@50% spread-3 glow.
//  · aria-invalid → destructive border (⚠ PLACEHOLDER token — stock hex, not
//    designed; bound but not finalized, same as Input/Badge). The destructive ring
//    (ring-destructive/20) is FOCUS-GATED: its width comes from focus-visible:ring-[3px]
//    only, so invalid-resting shows the border alone and the red ring appears on
//    invalid+focus — matching .Input and the Figma invalid/focus-invalid split (the
//    resting invalid members carry no glow; only focus-invalid adds the destructive@20%).
//  · aria-invalid:aria-checked → destructive fill + border + text-destructive-ink (the
//    checked-and-invalid box is solid destructive in Figma; the glyph rides the red fill
//    in destructive-ink). Overrides data-checked:bg/border-primary-fill + text-primary-ink.
//  · lucide CheckIcon → @remixicon/react RiCheckLine (matches the Command port's
//    check glyph). [&>svg]:size-3.5 stays numeric (icon geometry ≠ token).
//  · all dark: variants dropped (DS is light-only).
//  · group-has-disabled/field:opacity-50 kept (Field integration); size-4 +
//    after:-inset-* (invisible hit-target) stay numeric (geometry ≠ token).
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer relative flex size-4 shrink-0 items-center justify-center corner-sm border border-input-border bg-input-fill transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-destructive aria-invalid:aria-checked:bg-destructive aria-invalid:aria-checked:text-destructive-ink data-checked:border-primary-fill data-checked:bg-primary-fill data-checked:text-primary-ink',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <RiCheckLine />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
