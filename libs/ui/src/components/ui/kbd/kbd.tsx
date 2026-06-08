import * as React from 'react';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn kbd to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6):
//  font-sans text-xs font-medium → text-kbd (the DS has a purpose-built mono
//  keyboard-key format) · gap-1/px-1 (4px) → gap-xs/px-xs · bg-inverse +
//  text-inverse-foreground (inverted dark keycap, per Figma) ·
//  rounded-sm kept · h-5/min-w-5/size-3 stay numeric (control/icon geometry).
//  Modifier symbols (⌘ ⇧ …) belong here as an icon, not a text glyph.
function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-xs rounded-sm bg-inverse px-xs text-kbd text-inverse-foreground select-none',
        "[&_svg:not([class*='size-'])]:size-3",
        '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background',
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
