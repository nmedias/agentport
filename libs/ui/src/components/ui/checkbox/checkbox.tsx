import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { RiCheckLine } from '@remixicon/react';

import { cn } from '@/lib/utils';





// Token-faithful port of the shadcn checkbox to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6). No CVA → the axis
// is state, not variant×size: default · checked · focus · disabled · invalid ·
// checked-invalid.
//
// DS re-clothe:
//  · rounded-[4px] → corner-sm — the DS 4px radius for small controls/markers;
//    all rounded-* are dead under the theme reset (§2/§6), corner-* is the only
//    radius vocabulary.
//  · border-input → border-input — DS Form-Control-Border token, same role
//    (control edge; focus hands off to the ring).
//  · data-checked:{bg,border}-primary + text-primary-foreground → primary /
//    primary-foreground — checked = "selected", primary's documented surface use;
//    the glyph sits on the primary fill so text-primary-foreground (icon-on-primary).
//  · focus border-ring + ring-ring/50 ring-[3px] — mirrors the Input focus ring
//    (ring-[3px], not ring-3, to match the sibling field convention).
//  · default/focus/disabled/invalid box fill → bg-input-background (DS Input fill,
//    bound in Figma; the unchecked box is no longer transparent).
//  · aria-invalid → destructive border (⚠ PLACEHOLDER token — stock hex, not
//    designed; bound but not finalized, same as Input/Badge). The destructive ring
//    (ring-destructive/20) is FOCUS-GATED: its width comes from focus-visible:ring-[3px]
//    only, so invalid-resting shows the border alone and the red ring appears on
//    invalid+focus — matching .Input (which omits aria-invalid:ring-[3px]). This
//    deviates from default-shadcn-checkbox (it ships an always-on aria-invalid:ring-3);
//    the Figma .Checkbox invalid member still carries the always-on glow → a dedicated
//    invalid-focus member is the pending Figma re-sync.
//  · aria-invalid:aria-checked → destructive fill + border (the checked-and-invalid
//    box is solid destructive in Figma; the white glyph rides the red fill, the
//    destructive ring carries the error). Overrides data-checked:bg/border-primary.
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
        'peer relative flex size-4 shrink-0 items-center justify-center corner-sm border border-input bg-input-background transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-destructive aria-invalid:aria-checked:bg-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground',
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
