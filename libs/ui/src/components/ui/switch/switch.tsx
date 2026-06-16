'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn switch to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6):
//  · data-checked:bg-primary → bg-primary (DS brand-accent surface = the "on"
//    state; primary.use = selection/active surface).
//  · data-unchecked:bg-input → bg-input (the off track fill rides the `input`
//    colour neutral/450 #79828f — a mid-grey that stays ≥3:1 on white; muted
//    #f4f6f8 would be near-invisible. `input`'s named utility is a border, but
//    the fill carries the stock contrast intent — see notes.md / skill-feedback).
//  · thumb bg-background → bg-background (white knob on both tracks).
//  · rounded-full → corner-full (DS radius vocab; all rounded-* dead, §2/§6).
//  · focus = border-ring + ring-ring/50 ring-[3px]; invalid = destructive
//    (⚠ placeholder token, stock hex — bound but NOT finalized) TRACK FILL +
//    border. The destructive ring (ring/20) is FOCUS-GATED — its width comes
//    from focus-visible:ring-[3px] only (no aria-invalid:ring-[3px]), so invalid
//    alone shows track+border and the red ring appears on invalid+focus, matching
//    .Input / .Checkbox. Deviates from default-shadcn-switch (ships ring-3); the
//    Figma .Switch focus-invalid members carry the focus-gated glow. invalid TRACK
//    FILL is destructive only when CHECKED (aria-invalid:data-checked:bg-destructive
//    overrides primary); the UNCHECKED-invalid track keeps the input grey — only the
//    border signals invalid, matching .Input/.Checkbox. (Synced from Figma 2026-06-16:
//    the earlier aria-invalid:data-unchecked:bg-destructive both-positions fill removed.)
//    (ring-[3px], not stock ring-3, to match the sibling field convention —
//    input / checkbox / input-group / textarea all use the arbitrary form.)
//  · all dimensions stay numeric (geometry ≠ token): track h-[18.4px]/w-[32px]
//    (default) · h-[14px]/w-[24px] (sm), thumb size-4/size-3, the checked
//    translate-x-[calc(100%-2px)]. dark: variants dropped (light-only DS).
// The `size` prop ("sm" | "default") is a manual code prop (not CVA); in Figma
// it is the size axis, the interaction states the state axis.
function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center corner-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-primary data-unchecked:bg-input aria-invalid:data-checked:bg-destructive data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block corner-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
