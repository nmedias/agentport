import * as React from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// shadcn separator on the radix-nova structure (Radix Separator.Root, decorative
// by default → non-interactive). Single static element, no CVA: the only axis is
// content — `orientation` (horizontal | vertical), driven by the data-* classes.
//
// DS re-clothe (tokens-reference.md §6):
//  · bg-border → the DS `border` token (--color-border): its `use` is exactly
//    "Standard-Kanten/Trenner" — the default divider line. Not border-emphasis/
//    -strong (those are the heavier rungs of the line ladder), so the class name
//    is unchanged but the binding is now semantic, not a value coincidence.
//  · h-px / w-px stay numeric — a 1px line is geometry, not a spacing token.
//  · w-full (horizontal) / self-stretch (vertical) fill the cross-axis; shrink-0
//    keeps the line from collapsing in a flex row. All layout, no DS change.
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
