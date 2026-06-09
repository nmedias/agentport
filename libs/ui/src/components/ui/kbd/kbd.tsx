import * as React from 'react';

import { cn } from '@/lib/utils';

// shadcn kbd on the **radix-nova structure**, re-clothed in DS values
// (tokens-reference.md §6). Unlike button/input, Nova ships kbd metric-identical
// to new-york — same h-5/min-w-5/px-1/gap-1/rounded-sm/size-3 — so there is no
// density re-align here; the re-port only adopts Nova's structural idiom and the
// DS token mapping:
//  · tooltip context via Nova's `in-data-[slot=tooltip-content]:` v4 variant
//    (was the older `[[…]_&]` descendant form); `dark:` companion dropped.
//  · font-sans text-xs font-medium → text-kbd (DS purpose-built mono key format).
//  · gap-1/px-1 (4px) → gap-xs/px-xs (named space tokens).
//  · bg-muted/text-muted-foreground → bg-inverse/text-inverse-foreground — the
//    Figma-synced inverted dark keycap (Figma stays source-of-truth, not Nova's
//    raw neutral cap), same as button keeping the DS accent over Nova's neutral.
//  · rounded-sm kept · h-5/min-w-5/size-3 stay numeric (control/icon geometry).
//  Modifier symbols (⌘ ⇧ …) belong here as an icon, not a text glyph.
function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-xs rounded-sm bg-inverse px-xs text-kbd text-inverse-foreground select-none',
        'in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background',
        "[&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-xs', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
