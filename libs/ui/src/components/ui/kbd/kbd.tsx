import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Public axis authored once here; the cva object is checked against it via `satisfies` (below) and the
// prop is typed by it, so the docgen-readable union can't drift from the cva (/docgen-props).
//  · emphasis — the keycap weight; the ONLY axis (kbd has no state axis — the cap is inert).
type KbdEmphasis = 'high' | 'low';

const kbdVariants = cva(
  "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-xs corner-sm px-xs text-format-kbd select-none in-data-[slot=tooltip-content]:bg-surface/20 in-data-[slot=tooltip-content]:text-ink [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      emphasis: {
        high: 'bg-inverse-fill text-inverse-ink',
        low: 'bg-muted-fill text-muted-ink',
      } as const satisfies Record<KbdEmphasis, string>,
    },
    defaultVariants: { emphasis: 'high' },
  }
);

// Own DS prop, FLAT with JSDoc so react-docgen surfaces it (/docgen-props): `emphasis` is typed by the
// local named alias (docgen resolves a named alias to its union → working select; a generic like
// VariantProps<…>['emphasis'] it does NOT resolve). DOM props pass through via `...props`.
interface KbdProps extends React.ComponentProps<'kbd'> {
  /**
   * Keycap weight. `high` is the inverted dark cap (Inverse fill/ink); `low` is the quiet muted cap
   * (the stock-shadcn look).
   * @default "high"
   */
  emphasis?: KbdEmphasis;
}

function Kbd({ className, emphasis, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ emphasis }), className)}
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

export { Kbd, KbdGroup, kbdVariants };
export type { KbdProps };
